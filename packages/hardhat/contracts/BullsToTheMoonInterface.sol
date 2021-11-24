//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Interface of BullsToTheMoon
 * @author Justa Liang
 */
interface BullsToTheMoonInterface {
    //-------------------------
    // Core
    //-------------------------

    /**
     * @notice Breed a bull
     * @return ID of the new bull
     */
    function breed() external returns (uint256);

    /**
     * @notice Core: Open a long position with leverage
     * @param bullId ID of the bull
     * @param namehash ENS namehash of chainlink price feed
     * @param leverage Perpetual leverage
     */
    function open(
        uint256 bullId,
        bytes32 namehash,
        int8 leverage
    ) external;

    /**
     * @notice Core: Close the position and update its net worth
     * @param bullId ID of the bull
     */
    function close(uint256 bullId) external;

    /**
     * @notice Core: Report a bull ran out of margin
     * @param bullId ID of the bull
     */
    function report(uint256 bullId) external;

    //-------------------------
    // Fields
    //-------------------------

    /**
     * @notice Fields: Occupy certain field
     * @param bullId ID of the bull
     * @param fieldId ID of the field on grassland
     */
    function occupy(uint256 bullId, uint8 fieldId) external;

    //-------------------------
    // Governance
    //-------------------------

    /**
     * @notice Governance: Propose the next-generation skin
     * @param newBaseURI Base URI of proposer's designed NFTs
     * @param slotId Which slot to propose
     */
    function propose(string calldata newBaseURI, uint8 slotId) external payable;

    /**
     * @notice Governance: Vote the proposals using owned fields
     * @param proposalId ID of the proposal
     * @param fieldIdList List of field ID that voter occupied
     */
    function vote(uint256 proposalId, uint8[] calldata fieldIdList) external;

    /**
     * @notice Governance: Start the vote
     */
    function startVote() external;

    /**
     * @notice Governance: End the vote
     */
    function endVote() external;
}
