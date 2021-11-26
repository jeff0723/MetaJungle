//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./BullosseumInterface.sol";
import "./BullosseumAmissionFee.sol";

/// @notice ENS registry to get chainlink resolver
interface ENS {
    function resolver(bytes32) external view returns (Resolver);
}

/// @notice Chainlink resolver to get price feed proxy
interface Resolver {
    function addr(bytes32) external view returns (address);
}

/**
 * @title Define the operations of Bull Fighter
 * @author Justa Liang
 */
abstract contract BullosseumFighter is BullosseumInterface, ERC721Enumerable {
    /**
     * @notice Generation of bulls
     */
    uint32 public generation;

    /// @dev ENS interface
    ENS private _ens;

    /// @dev BullosseumAmissionFee contract
    IERC20 internal _bafContract;

    /// @dev Map from bull ID to on-chain data
    mapping(uint256 => BullData) internal _bullData;
    struct BullData {
        // state
        uint32 generation; // the generation in which the bull bred
        bool closed; // position closed or not
        bool onField; // on the field or not
        int256 netWorth; // net worth of the bull
        // position
        address proxy; // proxy of Chainlink price feed
        int256 openPrice; // price when opening position
        int8 leverage; // leverage when opening position
    }

    /// @dev Initialize generation, setup ENS registry and deploy BullosseumAmissionFee
    constructor(address ensRegistryAddr) {
        generation = 1;
        _ens = ENS(ensRegistryAddr);
        _bafContract = IERC20(new BullosseumAmissionFee(_msgSender()));
    }

    /// @dev Check bull's owner
    modifier checkOwner(uint256 bullId) {
        require(_isApprovedOrOwner(msg.sender, bullId), "not owner");
        _;
    }

    /**
     * @notice see {BullosseumInterface-breed}
     */
    function breed() external override returns (uint256) {
        // cost 1000 BAF
        _bafContract.transferFrom(_msgSender(), address(this), 1000e18);

        // mint token
        uint256 newId = totalSupply() + 1;
        _safeMint(_msgSender(), newId);

        // allocate data
        _bullData[newId] = BullData(
            generation,
            true,
            false,
            1000,
            address(0),
            0,
            0
        );
        return newId;
    }

    /**
     * @notice See {BullosseumInterface-open}.
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
     * @notice See {BullosseumInterface-close}.
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
     * @notice See {BullosseumInterface-report}.
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
        target.netWorth = 0;

        // reward the reporter
        _bafContract.transfer(_msgSender(), 100e18);
    }

    /**
     * @notice Return bull data given bull ID
     */
    function getBullData(uint256 bullId) public view returns (BullData memory) {
        require(_exists(bullId), "query for nonexistent bull");
        return _bullData[bullId];
    }

    /// @dev Resolve ENS-namehash to Chainlink price feed proxy
    function _resolve(bytes32 namehash) internal view returns (address) {
        Resolver resolver = _ens.resolver(namehash);
        return resolver.addr(namehash);
    }
}
