//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./BullsToTheMoonInterface.sol";
import "./MagicGrass.sol";

/// @notice ENS registry to get chainlink resolver
interface ENS {
    function resolver(bytes32) external view returns (Resolver);
}

/// @notice Chainlink resolver to get price feed proxy
interface Resolver {
    function addr(bytes32) external view returns (address);
}

/**
 * @title Core operations of virtual trading
 * @author Justa Liang
 */
abstract contract BullsToTheMoonCore is
    BullsToTheMoonInterface,
    ERC721Enumerable
{
    /// @dev Current generation
    uint32 private _generation;

    /// @dev ENS interface
    ENS private _ens;

    /// @dev MagicGrass interface
    IERC20 internal _magicGrass;

    /// @dev Map from bull ID to on-chain data
    mapping(uint256 => BullData) private _bullData;

    /// @dev Setup ENS registry and deploy MagicGrass
    constructor(address ensRegistryAddr) {
        _generation = 1;
        _ens = ENS(ensRegistryAddr);
        _magicGrass = IERC20(new MagicGrass(_msgSender()));
    }

    /// @dev Check bull's owner
    modifier checkOwner(uint256 bullId) {
        require(_isApprovedOrOwner(msg.sender, bullId), "not owner");
        _;
    }

    /**
     * @dev see {BullsToTheMoonInterface-breed}
     */
    function breed() external override returns (uint256) {
        _magicGrass.transferFrom(_msgSender(), address(this), 1000e18);
        uint256 newId = totalSupply() + 1;
        _safeMint(_msgSender(), newId);
        _bullData[newId] = BullData(
            // state
            _generation,
            true,
            1000,
            // position
            address(0),
            0,
            0
        );
        return newId;
    }

    /**
     * @dev See {BullsToTheMoonInterface-open}.
     */
    function open(
        uint256 bullId,
        bytes32 namehash,
        int8 leverage
    ) external override checkOwner(bullId) {
        BullData storage target = _bullData[bullId];

        // check parameters
        require(target.closed, "already opened");
        require(leverage >= 10 && leverage <= 100, "invalid leverage");

        // resolve namehash
        address proxy = _resolve(namehash);
        require(proxy != address(0), "invalid namehash");

        // get current price
        AggregatorV3Interface pricefeed = AggregatorV3Interface(proxy);
        (, int256 currPrice, , , ) = pricefeed.latestRoundData();

        // update on-chain data
        target.closed = false;
        target.proxy = proxy;
        target.openPrice = currPrice;
        target.leverage = leverage;
    }

    /**
     * @dev See {BullsToTheMoonInterface-close}.
     */
    function close(uint256 bullId) external override checkOwner(bullId) {
        BullData storage target = _bullData[bullId];
        require(!target.closed, "already closed");

        // get current price
        AggregatorV3Interface pricefeed = AggregatorV3Interface(target.proxy);
        (, int256 currPrice, , , ) = pricefeed.latestRoundData();

        // update on-chain data
        target.closed = true;
        target.netWorth +=
            ((currPrice - target.openPrice) *
                target.leverage *
                100 *
                target.netWorth) /
            target.openPrice /
            1000;
        require(target.netWorth >= 0, "run out of margin");
    }

    /**
     * @dev See {BullsToTheMoonInterface-report}.
     */
    function report(uint256 bullId) external override {
        BullData storage target = _bullData[bullId];
        require(!target.closed, "should be opened");

        // get current price
        AggregatorV3Interface pricefeed = AggregatorV3Interface(target.proxy);
        (, int256 currPrice, , , ) = pricefeed.latestRoundData();

        // compute margin and check
        int256 margin = target.netWorth +
            ((currPrice - target.openPrice) *
                target.leverage *
                100 *
                target.netWorth) /
            target.openPrice /
            1000;
        require(margin < 0, "not out of margin");

        // bankrupt the bull
        delete _bullData[bullId];

        // reward the reporter
        _magicGrass.transfer(_msgSender(), 100e18);
    }

    /**
     * @dev see {BullsToTheMoonInterface-generation}
     */
    function generation() public view override returns (uint32) {
        return _generation;
    }

    /**
     * @dev see {BullsToTheMoonInterface-getData}
     */
    function getBullData(uint256 bullId)
        public
        view
        override
        returns (BullData memory)
    {
        require(_exists(bullId), "query for nonexistent bull");
        return _bullData[bullId];
    }

    /// @dev Resolve ENS-namehash to Chainlink price feed proxy
    function _resolve(bytes32 namehash) internal view returns (address) {
        Resolver resolver = _ens.resolver(namehash);
        return resolver.addr(namehash);
    }
}
