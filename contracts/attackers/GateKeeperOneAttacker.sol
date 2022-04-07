pragma solidity ^0.6.0;

interface IGateKeeperOne {
  function enter(bytes8 _gateKey) external;
}


contract GateKeeperOneAttacker {
  IGateKeeperOne gk1Address;

  constructor(address _address) public {
    gk1Address = IGateKeeperOne(_address);
  }

}
