import hardhat from "hardhat";
import {Contract } from "@hashgraph/hethers";
// @ts-ignore

export async function timelockFixture(
    tokenAddr: string, 
    beneficiaryAddr: string, 
    lockDuration: number
): Promise<Contract> {
	// @ts-ignore
	const TimeLock = await hardhat.hethers.getContractFactory("TokenTimeLock");
	const timelock = await TimeLock.deploy(tokenAddr, beneficiaryAddr, lockDuration);
	await timelock.deployTransaction.wait();
	return timelock;
}
