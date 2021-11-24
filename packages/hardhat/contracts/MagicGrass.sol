//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title ERC20 token for BullsToTheMoon
 * @author Justa Liang
 */
contract MagicGrass is ERC20 {
    /// @dev Setup name, symbol and initial supply
    constructor(address founder) ERC20("MagicGrass", "MGS") {
        _mint(_msgSender(), 5e21);
        _mint(founder, 5e21);
    }
}
