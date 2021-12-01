//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Jungler.sol";
import "./token/HideOnBush.sol";

/**
 * @title Bushes that allow junglers to camp
 * @author Justa Liang
 */
abstract contract JungleBush is Jungler {
    /// @dev Max number of bushes
    uint8 internal constant ENV_CAPACITY = 100;

    /// @dev HideOnBush token contract
    IERC20Beta private _hobContract;

    /// @dev Bush data structure
    mapping(uint8 => BushData) internal _bushData;
    struct BushData {
        uint256 junglerId;
        uint224 timer;
        uint32 generation;
    }

    /**
     * @notice Stage of proposing or voting
     */
    Stage public stage;
    enum Stage {
        SURVIVING,
        VOTING
    }

    /// @dev Voting stage (bush locked)
    modifier votingStage() {
        require(stage == Stage.VOTING, "not in voting stage");
        _;
    }

    /// @dev Surviving stage (bush not locked)
    modifier survivingStage() {
        require(stage == Stage.SURVIVING, "not in surviving stage");
        _;
    }

    /// @dev Initialize stage
    constructor() {
        stage = Stage.SURVIVING;
        _hobContract = IERC20Beta(new HideOnBush());
    }

    /**
     * @notice See {JungleInterface-camp}
     */
    function camp(uint256 junglerId, uint8 bushId)
        external
        override
        checkOwner(junglerId)
        survivingStage
    {
        require(bushId < ENV_CAPACITY, "invalid bush ID");

        // get attacker data
        JunglerData storage attackerData = _junglerData[junglerId];
        require(!attackerData.isCamping, "already on bush");

        // get defender data
        BushData storage targetBush = _bushData[bushId];
        uint256 defenderId = targetBush.junglerId;
        JunglerData storage defenderData = _junglerData[defenderId];

        // attacker should be of this generation
        require(attackerData.generation == generation, "jungler too old");

        // if the defender jungler is at open position or out of generation
        // then will be replaced regardless of power
        if (!defenderData.isOpen && defenderData.generation == generation) {
            require(
                attackerData.power > defenderData.power,
                "attacker can't overtake"
            );
        }

        // update on-chain data
        defenderData.isCamping = false;
        attackerData.isCamping = true;
        targetBush.junglerId = junglerId;

        if (defenderId != 0) {
            uint256 hobReward = (block.timestamp - targetBush.timer);
            _hobContract.mint(ownerOf(defenderId), hobReward);
            targetBush.timer = uint224(block.timestamp);
        }
    }

    /**
     * @notice Return votable bushes given owner
     */
    function getVotableBushesByOwner(address owner)
        public
        view
        returns (uint8[] memory bushIdList)
    {
        uint8 votableBushCount = 0;
        BushData memory targetBush;

        for (uint8 bushId = 0; bushId < ENV_CAPACITY; bushId++) {
            targetBush = _bushData[bushId];
            if (
                _exists(targetBush.junglerId) &&
                ownerOf(targetBush.junglerId) == owner &&
                targetBush.generation != generation
            ) {
                votableBushCount++;
            }
        }
        bushIdList = new uint8[](votableBushCount);
        uint8 idx = 0;
        for (uint8 bushId = 0; bushId < ENV_CAPACITY; bushId++) {
            targetBush = _bushData[bushId];
            if (
                _exists(targetBush.junglerId) &&
                ownerOf(targetBush.junglerId) == owner &&
                targetBush.generation != generation
            ) {
                bushIdList[idx] = bushId;
                idx++;
            }
        }
    }
}
