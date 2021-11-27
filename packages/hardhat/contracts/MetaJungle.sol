//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";
import "./JungleGovernance.sol";

contract MetaJungle is JungleGovernance, PaymentSplitter {
    using Strings for uint256;

    /// @dev Setup PaymentSplitter
    constructor(
        address ensRegistryAddr,
        string memory baseURI,
        address[] memory payees,
        uint256[] memory shares
    )
        ERC721("MetaJungler", "MJG")
        Jungler(ensRegistryAddr)
        JungleFields()
        JungleGovernance(baseURI)
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
        uint32 targetGeneration = _junglerData[tokenId].generation;
        uint256 power = uint256(_junglerData[tokenId].power);
        string memory genBaseURI = _baseURIofGeneration[targetGeneration];
        return string(abi.encodePacked(genBaseURI, power.toString()));
    }

    /**
     * @notice Return address of JGR contract
     */
    function getAddrOfJGR() public view returns (address) {
        return address(_jgrContract);
    }

    struct JunglerProfile {
        uint256 id;
        uint32 generation;
        bool closed;
        bool onField;
        int256 power;
        address proxy;
        int256 openPrice;
        int8 leverage;
        string tokenURI;
    }

    /**
     * @notice Get ceratin jungler profile
     */
    function getJunglerProfile(uint256 junglerId)
        public
        view
        returns (JunglerProfile memory)
    {
        JunglerData memory target = _junglerData[junglerId];
        return
            JunglerProfile(
                junglerId,
                target.generation,
                target.closed,
                target.onField,
                target.power,
                target.proxy,
                target.openPrice,
                target.leverage,
                tokenURI(junglerId)
            );
    }

    /**
     * @notice Get all profile of junlers of given owner
     */
    function getOwnerJunglerList(address owner)
        external
        view
        returns (JunglerProfile[] memory junglerList)
    {
        uint256 tokenBalance = balanceOf(owner);
        junglerList = new JunglerProfile[](tokenBalance);
        uint256 tokenId;
        for (uint256 idx; idx < tokenBalance; idx++) {
            tokenId = tokenOfOwnerByIndex(owner, idx);
            junglerList[idx] = getJunglerProfile(tokenId);
        }
    }
}
