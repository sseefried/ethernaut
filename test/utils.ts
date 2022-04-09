import { Contract, Signer, BigNumber } from "ethers";
import { LogDescription } from "ethers/lib/utils";
import { ethers } from "hardhat";

export const ETHERNAUT_ADDRESS = `0xD991431D8b033ddCb84dAD257f4821E9d5b38C33`;

// manually copied from the website while inspect the web console's `ethernaut.abi`
const ETHERNAUT_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        indexed: false,
        internalType: "contract Level",
        name: "level",
        type: "address",
      },
    ],
    name: "LevelCompletedLog",
    type: "event",
    signature:
      "0x9dfdf7e3e630f506a3dfe38cdbe34e196353364235df33e5a3b588488d9a1e78",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "instance",
        type: "address",
      },
    ],
    name: "LevelInstanceCreatedLog",
    type: "event",
    signature:
      "0x7bf7f1ed7f75e83b76de0ff139966989aff81cb85aac26469c18978d86aac1c2",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
    signature:
      "0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0",
  },
  {
    inputs: [
      {
        internalType: "contract Level",
        name: "_level",
        type: "address",
      },
    ],
    name: "createLevelInstance",
    outputs: [],
    stateMutability: "payable",
    type: "function",
    payable: true,
    signature: "0xdfc86b17",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
    signature: "0x8da5cb5b",
  },
  {
    inputs: [
      {
        internalType: "contract Level",
        name: "_level",
        type: "address",
      },
    ],
    name: "registerLevel",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x202023d4",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x715018a6",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "_instance",
        type: "address",
      },
    ],
    name: "submitLevelInstance",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xc882d7c2",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xf2fde38b",
  },
];

export const submitLevel = async (address: string) => {
  try {
    const ethernaut = await ethers.getContractAt(
      ETHERNAUT_ABI,
      ETHERNAUT_ADDRESS
    );
    let tx = await ethernaut.submitLevelInstance(address);
    await tx.wait();

    const txReceipt = await ethernaut.provider!.getTransactionReceipt(tx.hash);
    if (txReceipt.logs.length === 0) return false;

    const event = ethernaut.interface.parseLog(txReceipt.logs[0]);
    return event.name === `LevelCompletedLog`;
  } catch (error) {
    console.error(`submitLevel: ${error.message}`);
    return false;
  }
};

export const createChallenge = async (
  contractLevel: string,
  value: any = `0`
) => {
  try {
    const ethernaut = await ethers.getContractAt(
      ETHERNAUT_ABI,
      ETHERNAUT_ADDRESS
    );
    let tx = await ethernaut.createLevelInstance(contractLevel, {
      value,
    });
    await tx.wait();
    const txReceipt = await ethernaut.provider!.getTransactionReceipt(tx.hash);
    if (txReceipt.logs.length === 0) throw new Error(`No event found`);
    const events: LogDescription[] = txReceipt.logs
      .map((log) => {
        try {
          return ethernaut.interface.parseLog(log);
        } catch {
          return undefined;
        }
      })
      .filter(Boolean) as LogDescription[];

    const event = events.find(
      (event) => event.name === `LevelInstanceCreatedLog` && event.args.instance
    );
    if (!event) throw new Error(`Invalid Event ${JSON.stringify(event)}`);

    return event.args.instance;
  } catch (error) {
    console.error(`createChallenge: ${error.message}`);
    throw new Error(`createChallenge failed: ${error.message}`);
  }
};


export const bigNumberToEther = (b: BigNumber) => {
    return b.toNumber() / 1e18;
}

export const logEvents = (events: Array<any>) => {
  let i: number;
  let j: any;

  const pretty = (val: any) => {
    if (val instanceof BigNumber) {
      return (val.toNumber()/1e18).toString() + " ether, " + val.toString() + " wei";
    }
    return val.toString();
  }

  for (i = 0; i < events.length; i++) {
    if (events[i].args) {
      let a = events[i].args;
      let propNames: any = Object.getOwnPropertyNames(a);
      let result: any = {};
      for (j in propNames) {
        let k: any = propNames[j];
        //console.log("parseInt", parseInt(propNames[k]));
        if ( a.hasOwnProperty(k) &&
             k != "length" &&
             parseInt(k).toString() == "NaN" ) {
          result[k] = pretty(a[k]);
        }
      }
      console.log(events[i].event, result);
    } else {
      console.log("Unknown event", events[i].data);
    }
  }
}

//
// Dump the first n storage locations to the console
// Make sure to use call this function with 'await' e.g await dumpStorage(...)
//
export async function dumpStorage(signer: Signer, contract: Contract, n: number) {
  let provider: any = signer.provider;
  let i: number;
  for (i = 0; i < n; i++) {
    console.log(`storage[${i}]`, await provider.getStorageAt(contract.address, i));
  }
  console.log("----");
};
