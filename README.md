# saucerswap-timelock

Repository to deploy a token timelock smart contract onto the Hedera Network.

## Installation

Clone the repository and run `npm install`
Compile using hardhat command `npx hardhat compile`

## Unit Test

Create a .env file in the root directory <br>
Create two accounts with ECDSA keys and fill in the .env file with sample-env as a guide <br>
Run the unit test from the root directory with command `npx hardhat test test/TimeLock.spec.ts`

## Deploy

Run the deploy script from the root directory with command `npx ts-node scripts/deploy.ts`
