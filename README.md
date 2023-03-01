# saucerswap-timelock

Repository to deploy a token timelock smart contract onto the Hedera Network.

# Installation

clone the repository and run npm install
compile using hardhat command npx hardhat compile

# Unit Test

create a .env file in the root directory
create two accounts with ECDSA keys and fill in the .env file with sample-env as a guide
run the unit test from the root directory with command npx hardhat test test/TimeLock.spec.ts

# Deploy

run the deploy script from the root directory with command npx ts-node scripts/deploy.ts
