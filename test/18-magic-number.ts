import { expect } from "chai";
import { Contract, Signer, BigNumber } from "ethers";
import { ethers } from "hardhat";
import { createChallenge, submitLevel, bigNumberToEther,
         logEvents, dumpStorage } from "./utils";

let accounts: Signer[];
let eoa: Signer;
let attacker: Contract;
let challenge: Contract; // challenge contract
let tx: any;

before(async () => {
  accounts = await ethers.getSigners();
  [eoa] = accounts;
  const challengeFactory = await ethers.getContractFactory(`MagicNum`);
  const challengeAddress = await createChallenge(
    `0x200d3d9Ac7bFd556057224e7aEB4161fED5608D0`
  );

  challenge = await challengeFactory.attach(challengeAddress);

  const attackerFactory = await ethers.getContractFactory(`MagicNumberAttacker`);
  console.log("bytecode", attackerFactory.bytecode);

  attacker = await attackerFactory.deploy();
});

it("solves the challenge", async function () {
    challenge.setSolver(attacker);
});

after(async () => {
  expect(await submitLevel(challenge.address), "level should be solved").to.be.true;
});
