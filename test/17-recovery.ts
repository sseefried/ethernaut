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
  const challengeFactory = await ethers.getContractFactory(`Recovery`);
  const challengeAddress = await createChallenge(
    `0x0EB8e4771ABA41B70d0cb6770e04086E5aee5aB2`
  );


  challenge = await challengeFactory.attach(challengeAddress);

//  const attackerFactory = await ethers.getContractFactory(`YourAttackerSourceFile`);
//  attacker = await attackerFactory.deploy(challenge.address);
});

it("solves the challenge", async function () {
  let provider: any = eoa.provider;
  const eoaAddress = await eoa.getAddress();

  // We can't see "internal transactions" using ethers so we have to generate contract address ourselves
  // See: https://ethereum.stackexchange.com/questions/760/how-is-the-address-of-an-ethereum-contract-computed

  const lostAddressKeccak256 =  ethers.utils.keccak256(ethers.utils.RLP.encode([ challenge.address, "0x01" ]));
  const lostAddress: string = "0x" + lostAddressKeccak256.slice(2).slice(24);

  // You could also use this ethers utility function
  //   const lostAddress = ethers.utils.getContractAddress({
  //      from: challenge.address,
  //      nonce: BigNumber.from(`1`)});

  const iface = new ethers.utils.Interface(["function destroy(address payable _to) public"]);
  const methodCallData: string = iface.encodeFunctionData("destroy", [ eoaAddress ]);

  tx = await eoa.sendTransaction({
      to: lostAddress,
      from: eoaAddress,
      data: methodCallData
  });
  await tx.wait();


});

after(async () => {
  expect(await submitLevel(challenge.address), "level should be solved").to.be.true;
});
