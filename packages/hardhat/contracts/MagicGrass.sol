//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IMagicGrass is IERC20 {
    /// @dev Mint MagicGrass for player
    function mint(address player, uint256 amount) external;

    /// @dev Burn MagicGrass for player
    function burn(address player, uint256 amount) external;
}

/**
 * @title ERC20 token for BullsToTheMoon
 * @author Justa Liang
 */
contract MagicGrass is IMagicGrass, ERC20 {
    /// @dev BullsToTheMoon contract address
    address private _bullsContract;

    /// @dev Setup name, symbol and initial supply
    constructor(address founder) ERC20("MagicGrass", "MG") {
        _bullsContract = _msgSender();
        _mint(_msgSender(), 7777777e21);
        _mint(founder, 7777777e21);
    }

    /// @dev Mint function only called by BullsToTheMoon
    function mint(address player, uint256 amount) external override {
        require(_msgSender() == _bullsContract);
        _mint(player, amount);
    }

    /// @dev Burn function only called by BullsToTheMoon
    function burn(address player, uint256 amount) external override {
        require(_msgSender() == _bullsContract);
        _burn(player, amount);
    }
}
