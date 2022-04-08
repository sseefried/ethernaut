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
  const challengeFactory = await ethers.getContractFactory(`GatekeeperTwo`);
  const challengeAddress = await createChallenge(
    `0xdCeA38B2ce1768E1F409B6C65344E81F16bEc38d`
    // IMPORTANT: Some contracts will need a second argument specifying how
    // much value that should have in them on creation. e.g. Reentrance level e.g.
    // , ethers.utils.parseEither("0.001")
  );

  challenge = await challengeFactory.attach(challengeAddress);

  // challenge = await challengeFactory.deploy();

  const attackerFactory = await ethers.getContractFactory(`GatekeeperTwoAttacker`);
  attacker = await attackerFactory.deploy(challenge.address);
});

it("solves the challenge", async function () {
});

after(async () => {
  expect(await submitLevel(challenge.address), "level should be solved").to.be.true;
});
