//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title ERC20 token for BullsToTheMoon
 * @author Justa Liang
 */
contract MagicGrass is ERC20 {
    /// @dev Setup name, symbol and initial supply
    constructor(address founder) ERC20("MagicGrass", "MG") {
        _mint(_msgSender(), 7777777e21);
        _mint(founder, 7777777e21);
    }
}
