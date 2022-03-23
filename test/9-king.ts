import { expect } from "chai";
import { Contract, Signer } from "ethers";
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
  const challengeFactory = await ethers.getContractFactory(`King`);
  const challengeAddress = await createChallenge(
    `0x43BA674B4fbb8B157b7441C2187bCdD2cdF84FD5`
  );
  challenge = await challengeFactory.attach(challengeAddress);

//  const attackerFactory = await ethers.getContractFactory(`YourAttackerSourceFile`);
//  attacker = await attackerFactory.deploy(challenge.address);
});

it("solves the challenge", async function () {
  // console.log(await challenge.prize());
  // tx = eoa.sendTransaction({
  //   value: ethers.utils.parseUnits("1", "wei")
  // });
  // console.log(await challenge.prize());
  // console.log(await challenge._king());

});

after(async () => {
  expect(await submitLevel(challenge.address), "level should be solved").to.be.true;
});
