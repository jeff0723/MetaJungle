//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/finance/PaymentSplitter.sol";
import "./JungleGovernance.sol";

contract MetaJungle is JungleGovernance, PaymentSplitter {
    using Strings for uint40;

    //// @dev Max display power
    uint40 private constant MAX_DISPLAY_POWER = 7243;

    /// @dev Setup PaymentSplitter
    constructor(
        address ensRegistryAddr,
        string memory baseURI,
        address[] memory payees,
        uint256[] memory shares
    )
        ERC721("MetaJungler", "MJG")
        Jungler(ensRegistryAddr)
        JungleBush()
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
        uint40 powerDisplay = uint40(_junglerData[tokenId].power) / 1e3;
        if (powerDisplay > MAX_DISPLAY_POWER) {
            powerDisplay = MAX_DISPLAY_POWER;
        }
        string memory genBaseURI = _baseURIofGeneration[targetGeneration];
        return string(abi.encodePacked(genBaseURI, powerDisplay.toString()));
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
        bool isOpen;
        bool isCamping;
        int40 power;
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
        require(_exists(junglerId), "query for nonexistant jungler");
        JunglerData memory target = _junglerData[junglerId];
        return
            JunglerProfile(
                junglerId,
                target.generation,
                target.isOpen,
                target.isCamping,
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

    /**
     * @notice Return jungler profile given bush ID
     */
    function getJunglerProfileOnBush(uint8 bushId)
        public
        view
        returns (JunglerProfile memory)
    {
        require(bushId < ENV_CAPACITY, "invalid bush ID");
        return getJunglerProfile(_bushData[bushId].junglerId);
    }
}
