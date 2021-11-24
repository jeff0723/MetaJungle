//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @dev Bull data structure
struct BullData {
    // state
    uint32 generation; // the generation in which the bull bred
    bool closed; // position closed or not
    int256 netWorth; // net worth of the bull
    // position
    address proxy; // proxy of Chainlink price feed
    int256 openPrice; // price when opening position
    int8 leverage; // leverage when opening position
}

/**
 * @title Bulls (dynamic NFTs) that grow with rising price
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

    /**
     * @notice Core: Get current generation
     * @return Current generation
     */
    function generation() external view returns (uint32);

    /**
     * @notice Core: Check bull state
     * @param bullId ID of the bull
     * @return Bull data structure
     */
    function getBullData(uint256 bullId)
        external
        view
        returns (BullData memory);

    //-------------------------
    // Fields
    //-------------------------

    /**
     * @notice Fields: Occupy certain field
     * @param bullId ID of the bull
     * @param fieldId ID of the field on grassland
     */
    function occupy(uint256 bullId, uint8 fieldId) external;

    /**
     * @notice Fields: Get bull ID on certain field
     * @param fieldId ID of the field on grassland
     * @return ID of the bull on the field
     */
    function getBullOnField(uint8 fieldId) external returns (uint256);

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
