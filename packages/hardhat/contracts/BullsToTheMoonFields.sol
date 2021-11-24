//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./BullsToTheMoonCore.sol";

/**
 * @title Fields that allow bulls to occupy
 * @author Justa Liang
 */
abstract contract BullsToTheMoonFields is BullsToTheMoonCore {
    /// @dev Max number of fields
    uint8 private constant GRASSLAND_SIZE = 100;

    /// @dev Map from field ID to bull ID
    mapping(uint8 => uint256) private _bullIdOnField;

    /**
     * @dev See {BullsToTheMoonInterface-occupy}
     */
    function occupy(uint256 bullId, uint8 fieldId)
        external
        override
        checkOwner(bullId)
    {
        require(fieldId < 100, "out of grassland");
        uint256 defenderId = _bullIdOnField[fieldId];
        if (defenderId != 0) {
            BullData memory defenderData = getBullData(defenderId);
            BullData memory attackerData = getBullData(bullId);
            if (
                defenderData.closed &&
                defenderData.generation == attackerData.generation
            ) {
                require(
                    attackerData.netWorth > defenderData.netWorth,
                    "defender win"
                );
            }
        }
        _bullIdOnField[fieldId] = bullId;
    }

    /**
     * @dev See {BullsToTheMoonInterface-getBullOnField}
     */
    function getBullOnField(uint8 fieldId)
        public
        view
        override
        returns (uint256)
    {
        require(fieldId < 100, "out of grassland");
        return _bullIdOnField[fieldId];
    }
}
