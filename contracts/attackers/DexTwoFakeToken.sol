// SPDX-License-Identifier: MIT
pragma solidity ^0.7.3;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import '@openzeppelin/contracts/math/SafeMath.sol';

contract DexTwoFakeToken is ERC20 {
    address public player;
    address public dex;

    constructor (string memory name_, string memory symbol_) ERC20(name_, symbol_) {}

    function initialize(address _player, address _dex) public {
        player = _player;
        dex = _dex;
    }

    function resetBalances(uint256 _amount) public {
        _burn(player, balanceOf(player));
        _burn(dex, balanceOf(dex));
        _mint(player, _amount);
        _mint(dex, _amount);
    }

}