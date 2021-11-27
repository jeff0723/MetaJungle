//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./JungleBush.sol";

/**
 * @title Governance of jungle community
 * @author Justa Liang
 */
abstract contract JungleGovernance is JungleBush {
    /// @dev Max number of proposals
    uint8 private constant SLOT_SIZE = 10;

    /// @dev Interval of proposing stage
    uint256 private constant PROPOSAL_INTERVAL = 25 days;

    /// @dev Interval of voting stage
    uint256 private constant VOTE_INTERVAL = 3 days;

    /// @dev Map from field ID to generation
    mapping(uint8 => uint32) private _fieldGeneration;

    /// @dev Latest update time
    uint256 private _latestUpdateTime;

    /// @dev Proposal contents
    struct Proposal {
        address proposer;
        string baseURI;
        uint88 bid;
        uint8 voteCount;
    }

    /// @dev List of proposals
    Proposal[] private _proposals;

    /// @dev Map from generation to baseURI
    mapping(uint32 => string) internal _baseURIofGeneration;

    /// @dev Initialize timer and first-generation baseURI
    constructor(string memory baseURI) {
        _latestUpdateTime = block.timestamp;
        _baseURIofGeneration[generation] = baseURI;
    }

    /**
     * @notice See {JungleInterface-propose}
     */
    function propose(string calldata newBaseURI, uint8 slotId)
        external
        payable
        override
    {
        // if not reach max number of proposals, just push back
        if (_proposals.length < SLOT_SIZE) {
            _proposals.push(
                Proposal(_msgSender(), newBaseURI, uint88(msg.value), 0)
            );
        }
        // else replace the proposal on slot if given enough bid
        else {
            require(slotId < SLOT_SIZE, "index out of range");
            Proposal memory propOnSlot = _proposals[slotId];
            require(msg.value >= propOnSlot.bid + 0.01 ether, "not enough bid");
            Address.sendValue(payable(propOnSlot.proposer), propOnSlot.bid);
            _proposals[slotId] = Proposal(
                _msgSender(),
                newBaseURI,
                uint88(msg.value),
                0
            );
        }
    }

    /**
     * @notice See {JungleInterface-vote}
     */
    function vote(uint256 proposalId, uint8[] calldata fieldIdList)
        external
        override
    {
        uint8 fieldCount = uint8(fieldIdList.length);
        Proposal storage target = _proposals[proposalId];

        // verify every field
        for (uint8 fid = 0; fid < fieldCount; fid++) {
            uint256 junglerId = getJunglerOnBush(fid);
            require(ownerOf(junglerId) == _msgSender(), "not owner");
            require(_fieldGeneration[fid] < generation, "already voted");
            _fieldGeneration[fid] = generation;
        }

        // update vote count
        target.voteCount += fieldCount;

        // reward voter
        _jgrContract.transfer(
            _msgSender(),
            ((balanceOf(address(this)) * fieldCount) * 8) / 10 / ENV_CAPACITY
        );
    }

    /**
     * @notice See {JungleInterface-startVote}
     */
    function startVote() external override proposingStage {
        require(
            block.timestamp >= _latestUpdateTime + PROPOSAL_INTERVAL,
            "not yet to start vote"
        );
        require(_proposals.length > 0, "no proposal to vote");
        stage = Stage.VOTING;
        _latestUpdateTime = block.timestamp;
    }

    /**
     * @notice See {JungleInterface-endVote}
     */
    function endVote() external override votingStage {
        require(
            block.timestamp >= _latestUpdateTime + VOTE_INTERVAL,
            "not yet to end vote"
        );
        stage = Stage.PROPOSING;
        _latestUpdateTime = block.timestamp;

        // determine winning proposal
        uint8 maxVote = 0;
        uint8 maxIdx = 0;
        for (uint8 i = 0; i < _proposals.length; i++) {
            if (_proposals[i].voteCount > maxVote) {
                maxVote = _proposals[i].voteCount;
                maxIdx = i;
            }
        }
        Proposal memory winningProp = _proposals[maxIdx];

        // reward winner
        _jgrContract.transfer(
            winningProp.proposer,
            (balanceOf(address(this))) / 10
        );

        // evolve to next generation
        generation++;
        _baseURIofGeneration[generation] = winningProp.baseURI;
    }

    /**
     * @notice Return all proposals' contents
     */
    function getAllProposals() external view returns (Proposal[] memory) {
        return _proposals;
    }
}
