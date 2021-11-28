//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Jungler.sol";

/**
 * @title Bushes that allow junglers to camp
 * @author Justa Liang
 */
abstract contract JungleBush is Jungler {
    /// @dev Max number of bushes
    uint8 internal constant ENV_CAPACITY = 100;

    /// @dev Reward per second
    uint256 private constant REWARD_PER_SEC = 4e11;

    /// @dev Map from bush ID to jungler ID (Faker the GOAT!!!)
    mapping(uint8 => uint256) internal _hideOnBush;

    /// @dev Map from bush ID to update time
    mapping(uint8 => uint256) private _bushTimer;

    /// @dev Map from bush ID to generation
    mapping(uint8 => uint32) internal _bushGeneration;

    /**
     * @notice Stage of proposing or voting
     */
    Stage public stage;
    enum Stage {
        PROPOSING,
        VOTING
    }

    /// @dev Voting stage (bush locked)
    modifier votingStage() {
        require(stage == Stage.VOTING, "not in voting stage");
        _;
    }

    /// @dev Proposing stage (bush not locked)
    modifier proposingStage() {
        require(stage == Stage.PROPOSING, "not in proposing stage");
        _;
    }

    /// @dev Initialize stage
    constructor() {
        stage = Stage.PROPOSING;
    }

    /**
     * @notice See {JungleInterface-camp}
     */
    function camp(uint256 junglerId, uint8 bushId)
        external
        override
        checkOwner(junglerId)
        proposingStage
    {
        require(bushId < ENV_CAPACITY, "invalid bush ID");

        // get attacker data
        JunglerData storage attackerData = _junglerData[junglerId];
        require(!attackerData.isCampping, "already on bush");

        // get defender data
        uint256 defenderId = _hideOnBush[bushId];
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
        defenderData.isCampping = false;
        attackerData.isCampping = true;
        _hideOnBush[bushId] = junglerId;

        if (defenderId != 0) {
            uint256 reward = (block.timestamp - _bushTimer[bushId]) *
                REWARD_PER_SEC;
            uint256 selfFund = balanceOf(address(this));
            if (reward > selfFund) {
                reward = selfFund;
            }
            transferFrom(address(this), ownerOf(defenderId), reward);
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
        uint256 junglerId;
        for (uint8 bushId = 0; bushId < ENV_CAPACITY; bushId++) {
            junglerId = _hideOnBush[bushId];
            if (
                _exists(junglerId) &&
                ownerOf(junglerId) == owner &&
                _bushGeneration[bushId] != generation
            ) {
                votableBushCount++;
            }
        }
        bushIdList = new uint8[](votableBushCount);
        uint8 idx = 0;
        for (uint8 bushId = 0; bushId < ENV_CAPACITY; bushId++) {
            junglerId = _hideOnBush[bushId];
            if (
                _exists(junglerId) &&
                ownerOf(junglerId) == owner &&
                _bushGeneration[bushId] != generation
            ) {
                bushIdList[idx] = bushId;
                idx++;
            }
        }
    }

    /**
     * @notice Return jungler data given bush ID
     */
    function getJunglerOnBush(uint8 bushId)
        public
        view
        returns (JunglerData memory)
    {
        require(bushId < ENV_CAPACITY, "invalid bush ID");
        return getJunglerData(_hideOnBush[bushId]);
    }
}
