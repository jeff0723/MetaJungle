//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./MetaJungleInterface.sol";
import "./token/JungleResource.sol";

/// @notice ENS registry to get chainlink resolver
interface ENS {
    function resolver(bytes32) external view returns (Resolver);
}

/// @notice Chainlink resolver to get price feed proxy
interface Resolver {
    function addr(bytes32) external view returns (address);
}

/**
 * @title Define the actions of Jungler
 * @author Justa Liang
 */
abstract contract Jungler is MetaJungleInterface, ERC721Enumerable {
    /**
     * @notice Current generation
     */
    uint32 public generation;

    /// @dev ENS interface
    ENS private _ens;

    /// @dev JungleResource token contract
    IERC20 internal _jgrContract;

    /// @dev Map from jungler ID to on-chain data
    mapping(uint256 => JunglerData) internal _junglerData;
    struct JunglerData {
        // state
        uint32 generation; // the generation in which the jungler summon
        bool isOpen; // if position is open
        bool isCamping; // if jungler is camping
        int40 power; // net worth of the jungler
        // position
        address proxy; // proxy of Chainlink price feed
        int256 openPrice; // price when opening position
        int8 leverage; // leverage when opening position
    }

    /// @dev event emit
    event CurrentJunglerState(uint256 indexed id, JunglerData data);

    /// @dev Initialize generation, setup ENS registry and deploy JungleResource
    constructor(address ensRegistryAddr) {
        generation = 1;
        _ens = ENS(ensRegistryAddr);
        _jgrContract = IERC20(new JungleResource(_msgSender()));
    }

    /// @dev Check jungler's owner
    modifier checkOwner(uint256 junglerId) {
        require(_isApprovedOrOwner(msg.sender, junglerId), "not owner");
        _;
    }

    /**
     * @notice see {MetaJungleInterface-summon}
     */
    function summon() external override {
        // cost 1000 JGR
        _jgrContract.transferFrom(_msgSender(), address(this), 1e18);

        // mint token
        uint256 newId = totalSupply() + 1;
        _safeMint(_msgSender(), newId);

        // allocate data
        _junglerData[newId] = JunglerData(
            generation,
            false,
            false,
            1e6,
            address(0),
            0,
            0
        );
        emit CurrentJunglerState(newId, _junglerData[newId]);
    }

    /**
     * @notice See {MetaJungleInterface-open}.
     */
    function open(
        uint256 junglerId,
        bytes32 namehash,
        int8 leverage
    ) external override checkOwner(junglerId) {
        JunglerData storage target = _junglerData[junglerId];

        // check generation
        require(target.generation == generation, "generation error");

        // check position state
        require(!target.isOpen, "already open");

        // resolve namehash
        address proxy = _resolve(namehash);
        require(proxy != address(0), "invalid namehash");

        // get current price
        AggregatorV3Interface pricefeed = AggregatorV3Interface(proxy);
        (, int256 currPrice, , , ) = pricefeed.latestRoundData();

        // update on-chain data
        target.isOpen = true;
        target.proxy = proxy;
        target.openPrice = currPrice;
        target.leverage = leverage;
        emit CurrentJunglerState(junglerId, target);
    }

    /**
     * @notice See {MetaJungleInterface-close}.
     */
    function close(uint256 junglerId) external override checkOwner(junglerId) {
        JunglerData storage target = _junglerData[junglerId];
        require(target.isOpen, "already closed");

        // get current price
        AggregatorV3Interface pricefeed = AggregatorV3Interface(target.proxy);
        (, int256 currPrice, , , ) = pricefeed.latestRoundData();

        // update on-chain data
        target.isOpen = false;
        target.power += int40(
            ((currPrice - target.openPrice) * target.leverage * target.power) /
                (target.openPrice * 10)
        );
        require(target.power >= 0, "out of margin");
        emit CurrentJunglerState(junglerId, target);
    }

    /**
     * @notice See {MetaJungleInterface-gank}.
     */
    function gank(uint256 junglerId) external override {
        JunglerData storage target = _junglerData[junglerId];
        require(target.isOpen, "should be open");

        // get current price
        AggregatorV3Interface pricefeed = AggregatorV3Interface(target.proxy);
        (, int256 currPrice, , , ) = pricefeed.latestRoundData();

        // compute margin and check
        int256 margin = target.power +
            ((currPrice - target.openPrice) * target.leverage * target.power) /
            (target.openPrice * 10);
        require(margin < 0, "not out of margin");

        // bankrupt the jungler
        target.power = 0;
        emit CurrentJunglerState(junglerId, target);

        // reward the ganker
        _jgrContract.transfer(_msgSender(), 1e17);
    }

    /**
     * @notice Return jungler data given jungler ID
     */
    function getJunglerData(uint256 junglerId)
        public
        view
        returns (JunglerData memory)
    {
        require(_exists(junglerId), "query for nonexistent jungler");
        return _junglerData[junglerId];
    }

    /// @dev Resolve ENS-namehash to Chainlink price feed proxy
    function _resolve(bytes32 namehash) internal view returns (address) {
        Resolver resolver = _ens.resolver(namehash);
        return resolver.addr(namehash);
    }
}
