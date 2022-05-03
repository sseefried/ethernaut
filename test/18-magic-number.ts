import { expect } from "chai";
import { Contract, Signer, BigNumber } from "ethers";
import { ethers } from "hardhat";
import { createChallenge, submitLevel, bigNumberToEther,
         logEvents, dumpStorage } from "./utils";
import { parse, assemble, Node, disassemble } from "@ethersproject/asm";


let accounts: Signer[];
let eoa: Signer;
let eoaAddress: string;
let attacker: Contract;
let challenge: Contract; // challenge contract
let tx: any;

before(async () => {
  accounts = await ethers.getSigners();
  [eoa] = accounts;
  eoaAddress = await eoa.getAddress();
  const challengeFactory = await ethers.getContractFactory(`MagicNum`);
  const challengeAddress = await createChallenge(
    `0x200d3d9Ac7bFd556057224e7aEB4161fED5608D0`
  );

  challenge = await challengeFactory.attach(challengeAddress);

//  const attackerFactory = await ethers.getContractFactory(`MagicNumberAttacker`);
//  console.log("bytecode", attackerFactory.bytecode);

//  attacker = await attackerFactory.deploy();
});

it("solves the challenge", async function () {
  const program = `
    codecopy(0, $myContract, #myContract)
    return(0, #myContract)

    @myContract {
      mstore(0, 42);
      return(0, 32);
    }
  `;


  const ast: Node = parse(program);
  const bytecode = await assemble(ast, {});
  console.log("assembled bytecode", bytecode);


  // By leaving out "to" field this is an _init transaction_ i.e. deploys a contract
  tx = await eoa.sendTransaction({
    from: eoaAddress,
    data: bytecode
  })

  const txReceipt = await tx.wait();
  challenge.setSolver(txReceipt.contractAddress);
});

after(async () => {
  expect(await submitLevel(challenge.address), "level should be solved").to.be.true;
});
