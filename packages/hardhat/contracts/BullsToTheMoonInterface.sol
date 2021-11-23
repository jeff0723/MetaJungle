//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

/**
 * @title Bulls (dynamic NFTs) that grow with rising price
 * @author Justa Liang
 */
interface BullsToTheMoonInterface {
    /**
     * @notice Breed a bull
     * @param namehash ENS-namehash of given pair
     * @return ID of the new bull
     */
    function breed(bytes32 namehash) external returns (uint256);

    //-------------------------
    // Core
    //-------------------------

    /**
     * @notice Core: Open a long position with leverage
     * @param bullId ID of the bull
     * @param leverage Perpetual leverage
     */
    function open(uint256 bullId, int8 leverage) external;

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
    // Field
    //-------------------------

    /**
     * @notice Field: Occupy certain field
     * @param bullId ID of the bull
     * @param fieldId ID of the field on grassland
     */
    function occupy(uint256 bullId, uint256 fieldId) external;

    /**
     * @notice Field: Harvest the MagicGrass on certain field
     * @param fieldId ID of the field on grassland
     */
    function harvest(uint256 fieldId) external;

    //-------------------------
    // Governance
    //-------------------------

    /**
     * @notice Governance: Propose the next-generation skin
     * @param proposedBaseURI Base URI of proposer's designed NFTs
     */
    function propose(string memory proposedBaseURI) external;

    /**
     * @notice Governance: Vote the proposals using owned fields
     * @param proposalId ID of the proposal
     * @param fieldCount Number of owned field
     */
    function vote(uint256 proposalId, uint256 fieldCount) external;

    /**
     * @notice Governance: Start the vote
     */
    function startVote() external;

    /**
     * @notice Governance: End the vote
     */
    function endVote() external;
}
