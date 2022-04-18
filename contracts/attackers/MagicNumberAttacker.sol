// SPDX-License-Identifier: MIT
pragma solidity ^0.7.3;

contract MagicNumberAttacker {

    function whatIsTheMeaningOfLife() public returns (uint256 r) {
        assembly {
            r := 42
        }
    }


}
