import { expect } from "chai";
import { Contract, Signer, BigNumber } from "ethers";
import { ethers } from "hardhat";
import { createChallenge, submitLevel, bigNumberToEther } from "./utils";

let accounts: Signer[];
let eoa: Signer;
let attacker: Contract;
let challenge: Contract; // challenge contract
let tx: any;

before(async () => {
  accounts = await ethers.getSigners();
  [eoa] = accounts;
  const challengeFactory = await ethers.getContractFactory(`King`);
  const challengeAddress = await createChallenge(
    `0x43BA674B4fbb8B157b7441C2187bCdD2cdF84FD5`,
    ethers.utils.parseEther("0.001")
  );
  challenge = await challengeFactory.attach(challengeAddress);

});

it("solves the challenge", async function () {
  let provider: any = eoa.provider;

  console.log("challenge address: ", challenge.address);
  console.log("our address: ", await eoa.getAddress());
  console.log("original king: ", await challenge._king());
  const prize: BigNumber = await challenge.prize();
  console.log("original prize", bigNumberToEther(prize));


  const attackerFactory = await ethers.getContractFactory(`KingAttacker`);
  attacker = await attackerFactory.deploy(challenge.address, { value: ethers.utils.parseEther("0.0015")});

  console.log("new king: ", await challenge._king());
  console.log("new prize", bigNumberToEther(await challenge.prize()));

});

after(async () => {
  expect(await submitLevel(challenge.address), "level should be solved").to.be.true;
});
