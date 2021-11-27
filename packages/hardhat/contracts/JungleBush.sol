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
    uint256 private constant REWARD_PER_SEC = 1e11;

    /// @dev Map from bush ID to jungler ID (Faker the GOAT!!!)
    mapping(uint8 => uint256) private _hideOnBush;

    /// @dev Map from bush ID to update time
    mapping(uint8 => uint256) private _bushTimer;

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
        require(bushId < ENV_CAPACITY, "out of grassland");

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
     * @notice Return jungler ID given bush ID
     */
    function getJunglerOnBush(uint8 bushId) public view returns (uint256) {
        require(bushId < ENV_CAPACITY, "out of grassland");
        return _hideOnBush[bushId];
    }
}
