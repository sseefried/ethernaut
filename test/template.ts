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
  const challengeFactory = await ethers.getContractFactory(`TheSourceFile`);
  const challengeAddress = await createChallenge(
    `GET ADDRESS FROM ETHERNAUT SITE`
  );
  challenge = await challengeFactory.attach(challengeAddress);

  const attackerFactory = await ethers.getContractFactory(`YourAttackerSourceFile`);
  attacker = await attackerFactory.deploy(challenge.address);
});

it("solves the challenge", async function () {
  // WRITE YOUR CODE HERE
});

after(async () => {
  expect(await submitLevel(challenge.address), "level should be solved").to.be.true;
});
