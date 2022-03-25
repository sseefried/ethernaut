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
  const challengeFactory = await ethers.getContractFactory(`Elevator`);
  const challengeAddress = await createChallenge(
    `0xaB4F3F2644060b2D960b0d88F0a42d1D27484687`
    // IMPORTANT: Some contracts will need a second argument specifying how
    // much value that should have in them on creation. e.g. Reentrance level e.g.
    // , ethers.utils.parseEither("0.001")
  );

  challenge = await challengeFactory.attach(challengeAddress);

  const attackerFactory = await ethers.getContractFactory(`ElevatorAttacker`);
  attacker = await attackerFactory.deploy(challenge.address);
});

it("solves the challenge", async function () {
  tx = await attacker.attack(BigNumber.from(1n));
  const receipt = await tx.wait();
  logEvents(receipt.events);
});

after(async () => {
  expect(await submitLevel(challenge.address), "level should be solved").to.be.true;
});
