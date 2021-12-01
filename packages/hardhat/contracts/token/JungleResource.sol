//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title Resource in the jungle (ERC20)
 * @author Justa Liang
 */
contract JungleResource is ERC20 {
    /// @dev Setup name, symbol and initial supply
    constructor(address founder) ERC20("JungleResource", "JGR") {
        _mint(_msgSender(), 5e23);
        _mint(founder, 5e23);
    }
}
