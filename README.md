# Solutions to OpenZeppelin's Ethernaut CTF

These are my (`sseefried`'s) solutions to the [Ethernaut CTF](https://ethernaut.openzeppelin.com/). However, I forked this repository from `cmichel`'s 
[Ethernaut solutions](https://github.com/MrToph/ethernaut)

I did this because I wanted to borrow his `hardhat` test infrastructure, which is a much faster way to interact with smart contructs that doing it via Remix on a real testnet. 

It might be hard to believe but I am one of those people who is capable of not looking at the answers, even when conveniently within reach, in order to fully benefit from the learning experience. I removed all of `cmichel`'s solutions from my fork of the repo in [commit 313c6964352de8e201ff0e3ed96f8d848ffc85ca](https://github.com/sseefried/ethernaut-solutions/commit/313c6964352de8e201ff0e3ed96f8d848ffc85ca).

Plus, more levels were added to Ethernaut since `cmichel` solved them, hopefully proving that I'm capable of solving these challenges without the assistance of others. 

## Set up

```bash
npm i
```

You need to configure environment variables:

```bash
cp .env.template .env
# fill out
```
Pick a mnemonic and the resulting accounts will be used in the challenges.

#### Hardhat

This repo uses [hardhat](https://hardhat.org/) to run the CTF challenges.
Challenges are implemented as hardhat tests in [`/test`](./test).

The tests run on a local hardnet network but it needs to be forked from Rinkeby because it interacts with the challenge factory and submission contract.
To fork the Rinkeby testnet, you need an archive URL like the free ones from [Alchemy](https://alchemyapi.io/).

#### Running challenges

Optionally set the block number in the `hardhat.config.ts` hardhat network configuration to the rinkeby head block number such that the challenge contract is deployed.

```bash
# fork rinkeby but run locally
npx hardhat test test/0-hello.ts
```
