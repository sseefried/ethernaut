import { expect } from "chai";
import { Address } from "cluster";
import { Contract, Signer, BigNumber } from "ethers";
import { ethers } from "hardhat";
import { createChallenge, submitLevel, bigNumberToEther,
         logEvents, dumpStorage } from "./utils";

let accounts: Signer[];
let eoa: Signer;
let eoaAddress: string;
let fakeToken1: Contract;
let fakeToken2: Contract;
let challenge: Contract; // challenge contract
let tx: any;

before(async () => {
  accounts = await ethers.getSigners();
  [eoa] = accounts;
  eoaAddress = await eoa.getAddress();
  const challengeFactory = await ethers.getContractFactory(`DexTwo`);
  const challengeAddress = await createChallenge(
    `0xd2BA82c4777a8d619144d32a2314ee620BC9E09c`
  );

  challenge = await challengeFactory.attach(challengeAddress);

  const fakeTokenFactory = await ethers.getContractFactory(`DexTwoFakeToken`);
  fakeToken1 = await fakeTokenFactory.deploy(eoaAddress, challenge.address);
});

it("solves the challenge", async function () {
  // WRITE YOUR CODE HERE
});

after(async () => {
  expect(await submitLevel(challenge.address), "level should be solved").to.be.true;
});
