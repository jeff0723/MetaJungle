//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Jungler.sol";

/**
 * @title Fields that allow Jungler to camp
 * @author Justa Liang
 */
abstract contract JungleFields is Jungler {
    /// @dev Max number of fields
    uint8 internal constant ENV_CAPACITY = 100;

    /// @dev Map from field ID to jungler ID
    mapping(uint8 => uint256) private _junglerIdOnField;

    /**
     * @notice Stage of proposing or voting
     */
    Stage public stage;
    enum Stage {
        PROPOSING,
        VOTING
    }

    /// @dev Voting stage (field locked)
    modifier votingStage() {
        require(stage == Stage.VOTING, "not in voting stage");
        _;
    }

    /// @dev Proposing stage (field not locked)
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
    function camp(uint256 junglerId, uint8 fieldId)
        external
        override
        checkOwner(junglerId)
        proposingStage
    {
        require(fieldId < ENV_CAPACITY, "out of grassland");

        // get attacker data
        JunglerData storage attackerData = _junglerData[junglerId];
        require(!attackerData.onField, "already on field");

        // get defender data
        uint256 defenderId = _junglerIdOnField[fieldId];
        JunglerData storage defenderData = _junglerData[defenderId];

        // attacker should be of this generation
        require(attackerData.generation == generation, "jungler too old");

        // if the defender jungler is at open position or out of generation
        // then will be replaced regardless of net worth
        if (defenderData.closed && defenderData.generation == generation) {
            require(
                attackerData.power > defenderData.power,
                "attacker can't overtake"
            );
        }

        // update on-chain data
        defenderData.onField = false;
        attackerData.onField = true;
        _junglerIdOnField[fieldId] = junglerId;
    }

    /**
     * @notice Return jungler ID given field ID
     */
    function getJunglerOnField(uint8 fieldId) public view returns (uint256) {
        require(fieldId < ENV_CAPACITY, "out of grassland");
        return _junglerIdOnField[fieldId];
    }
}
