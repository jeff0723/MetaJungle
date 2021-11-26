//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title ERC20 token as currency in Bullosseum
 * @author Justa Liang
 */
contract BullosseumAmissionFee is ERC20 {
    /// @dev Setup name, symbol and initial supply
    constructor(address founder) ERC20("BullosseumAmissionFee", "BAF") {
        _mint(_msgSender(), 5e27);
        _mint(founder, 5e27);
    }
}
