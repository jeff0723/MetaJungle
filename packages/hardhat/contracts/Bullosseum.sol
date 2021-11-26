//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";
import "./BullosseumGovernance.sol";

contract Bullosseum is BullosseumGovernance, PaymentSplitter {
    using Strings for uint256;

    /// @dev Setup PaymentSplitter
    constructor(
        address ensRegistryAddr,
        string memory baseURI,
        address[] memory payees,
        uint256[] memory shares
    )
        ERC721("BullosseumFigher", "BoF")
        BullosseumFighter(ensRegistryAddr)
        BullosseumFields()
        BullosseumGovernance(baseURI)
        PaymentSplitter(payees, shares)
    {}

    /**
     * @notice Customized {ERC721-tokenURI}
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        uint32 bullGeneration = _bullData[tokenId].generation;
        uint256 netWorth = uint256(_bullData[tokenId].netWorth);
        string memory genBaseURI = _baseURIofGeneration[bullGeneration];
        return string(abi.encodePacked(genBaseURI, netWorth.toString()));
    }

    /**
     * @notice Return address of BAF contract
     */
    function getAddrOfBAF() public view returns (address) {
        return address(_bafContract);
    }
}