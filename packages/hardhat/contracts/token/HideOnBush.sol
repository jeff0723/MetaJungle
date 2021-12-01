//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

interface IERC20Beta is IERC20 {
    function mint(address, uint256) external;

    function burn(address, uint256) external;
}

/**
 * @title Time of camping in bushes (ERC20)
 * @author Justa Liang
 */
contract HideOnBush is IERC20Beta, ERC20 {
    /// @dev Address on MetaJungle contract
    address private _metaJungleAddr;

    /// @dev Setup name, symbol and initial supply
    constructor() ERC20("HideOnBush", "HOB") {
        _metaJungleAddr = _msgSender();
    }

    /// @dev Only MetaJungler can mint and burn
    modifier onlyOwner() {
        require(_metaJungleAddr == _msgSender());
        _;
    }

    /// @dev For MetaJungle to mint
    function mint(address player, uint256 amount) external override onlyOwner {
        _mint(player, amount);
    }

    /// @dev For MetaJungle to burn
    function burn(address player, uint256 amount) external override onlyOwner {
        _burn(player, amount);
    }
}
