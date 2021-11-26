//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./BullosseumFighter.sol";

/**
 * @title Fields that allow bulls to occupy
 * @author Justa Liang
 */
abstract contract BullosseumFields is BullosseumFighter {
    /// @dev Max number of fields
    uint8 internal constant GRASSLAND_SIZE = 100;

    /// @dev Map from field ID to bull ID
    mapping(uint8 => uint256) private _bullIdOnField;

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
     * @notice See {BullosseumInterface-occupy}
     */
    function occupy(uint256 bullId, uint8 fieldId)
        external
        override
        checkOwner(bullId)
        proposingStage
    {
        require(fieldId < GRASSLAND_SIZE, "out of grassland");

        // get attacker data
        BullData storage attackerData = _bullData[bullId];
        require(!attackerData.onField, "already on field");

        // get defender data
        uint256 defenderId = _bullIdOnField[fieldId];
        BullData storage defenderData = _bullData[defenderId];

        // attacker should be of this generation
        require(attackerData.generation == generation, "bull too old");

        // if the defender bull is at open position or out of generation
        // then will be replaced regardless of net worth
        if (defenderData.closed && defenderData.generation == generation) {
            require(
                attackerData.netWorth > defenderData.netWorth,
                "attacker can't overtake"
            );
        }

        // update on-chain data
        defenderData.onField = false;
        attackerData.onField = true;
        _bullIdOnField[fieldId] = bullId;
    }

    /**
     * @notice Return bull ID given field ID
     */
    function getBullOnField(uint8 fieldId) public view returns (uint256) {
        require(fieldId < GRASSLAND_SIZE, "out of grassland");
        return _bullIdOnField[fieldId];
    }
}
