//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./BullsToTheMoonInterface.sol";

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
    /// @dev MagicGrass interface
    IERC20 private _magicGrass;

    /// @notice On-chain storage of bulls' state
    mapping(uint256 => BullState) public bullStateOf;

    /// @dev Bull info structure
    struct BullState {
        address proxy; // proxy of Chainlink price feed
        bool closed; // position closed or not
        int256 openPrice; // price when opening position
        int8 leverage; // leverage when opening position
        int256 netWorth; // net worth of the bull
    }

    /// @dev Event when bull state changes
    event BullInfo(
        uint256 indexed id,
        address indexed proxy,
        bool indexed closed,
        int256 openPrice,
        int8 leverage,
        int256 netWorth
    );

    /// @dev Check bull's owner
    modifier checkOwner(uint256 bullId) {
        require(_isApprovedOrOwner(msg.sender, bullId), "not owner");
        _;
    }

    /**
     * @dev See {BullsToTheMoonInterface-open}.
     */
    function open(uint256 bullId, int8 leverage)
        external
        override
        checkOwner(bullId)
    {
        BullState storage target = bullStateOf[bullId];
        require(target.closed, "already opened");
        require(leverage >= 10 && leverage <= 100, "invalid leverage");

        // get current price
        AggregatorV3Interface pricefeed = AggregatorV3Interface(target.proxy);
        (, int256 currPrice, , , ) = pricefeed.latestRoundData();

        // update on-chain data
        target.openPrice = currPrice;
        target.closed = false;
        target.leverage = leverage;

        // emit bull info
        emit BullInfo(
            bullId,
            target.proxy,
            false,
            currPrice,
            leverage,
            target.netWorth
        );
    }

    /**
     * @dev See {BullsToTheMoonInterface-close}.
     */
    function close(uint256 bullId) external override checkOwner(bullId) {
        BullState storage target = bullStateOf[bullId];
        require(!target.closed, "already closed");

        // get current price
        AggregatorV3Interface pricefeed = AggregatorV3Interface(target.proxy);
        (, int256 currPrice, , , ) = pricefeed.latestRoundData();

        // update on-chain data
        target.netWorth +=
            ((currPrice - target.openPrice) *
                target.leverage *
                100 *
                target.netWorth) /
            target.openPrice /
            1000;
        require(target.netWorth >= 0, "run out of margin");
        target.closed = true;

        // emit bull state
        emit BullInfo(
            bullId,
            target.proxy,
            true,
            currPrice,
            target.leverage,
            target.netWorth
        );
    }

    function report(uint256 bullId) external override {
        BullState storage target = bullStateOf[bullId];
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

        // liberate the bull
        _burn(bullId);

        // reward the reporter
        _magicGrass.transfer(_msgSender(), 1000e18);
    }
}
