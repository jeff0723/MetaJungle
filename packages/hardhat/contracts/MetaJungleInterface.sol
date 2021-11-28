//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Interface of JungleFinance
 * @author Justa Liang
 */
interface MetaJungleInterface {
    //-------------------------
    // Jungler
    //-------------------------

    /**
     * @notice Summon a jungler
     */
    function summon() external;

    /**
     * @notice Jungler: Open a long position with leverage
     * @param junglerId ID of the jungler
     * @param namehash ENS namehash of chainlink price feed
     * @param leverage Perpetual leverage
     */
    function open(
        uint256 junglerId,
        bytes32 namehash,
        int8 leverage
    ) external;

    /**
     * @notice Jungler: Close the position and update its net worth
     * @param junglerId ID of the jungler
     */
    function close(uint256 junglerId) external;

    /**
     * @notice Jungler: Gank a jungler who ran out of margin
     * @param junglerId ID of the jungler
     */
    function gank(uint256 junglerId) external;

    //-------------------------
    // Bush
    //-------------------------

    /**
     * @notice Bush: Camp at certain bush
     * @param junglerId ID of the jungler
     * @param bushId ID of the bush on grassland
     */
    function camp(uint256 junglerId, uint8 bushId) external;

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
     * @notice Governance: Vote the proposals using owned bush
     * @param proposalId ID of the proposal
     * @param bushIdList List of bush ID that voter occupied
     */
    function vote(uint256 proposalId, uint8[] calldata bushIdList) external;

    /**
     * @notice Governance: Start the vote
     */
    function startVote() external;

    /**
     * @notice Governance: End the vote
     */
    function endVote() external;
}
