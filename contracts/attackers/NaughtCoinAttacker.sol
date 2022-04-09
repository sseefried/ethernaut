// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface INaughtCoin {
    function transfer(address _to, uint256 _value) external returns(bool);
}

contract NaughtCoinAttacker {
    INaughtCoin nc;

    constructor(address _address) {
        nc = INaughtCoin(_address);
    }
}