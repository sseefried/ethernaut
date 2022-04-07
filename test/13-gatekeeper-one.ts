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
  const challengeFactory = await ethers.getContractFactory(`GatekeeperOne`);
  const challengeAddress = await createChallenge(
    `0x9b261b23cE149422DE75907C6ac0C30cEc4e652A`
    // IMPORTANT: Some contracts will need a second argument specifying how
    // much value that should have in them on creation. e.g. Reentrance level e.g.
    // , ethers.utils.parseEither("0.001")
  );

  challenge = await challengeFactory.attach(challengeAddress);

  const attackerFactory = await ethers.getContractFactory(`GateKeeperOneAttacker`);
  attacker = await attackerFactory.deploy(challenge.address);
});

it("solves the challenge", async function () {
});

after(async () => {
  expect(await submitLevel(challenge.address), "level should be solved").to.be.true;
});
