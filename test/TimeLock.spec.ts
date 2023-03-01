import chai, { expect } from 'chai'
import Long from 'long'
import { solidity } from 'ethereum-waffle'
import { TokenId, TokenSupplyType } from '@hashgraph/sdk'
import { Contract, Wallet } from '@hashgraph/hethers'
import { hethers } from 'hardhat'
import { BigNumber as BigNumberJs } from 'bignumber.js'
import EnvContainer from './shared/EnvContainer'
import { Utils } from "./shared/utils";
import { timelockFixture } from './shared/fixtures'
chai.use(solidity)

describe('Token TimeLock', () => {

    const network = 'testnet'
    let env = new EnvContainer(network)

    let myRawPubKey: string
    let aliceRawPubKey: string

    let wallet: Wallet
    let other: Wallet
    let timelock: Contract;

    // solidity vesting setup vars:
    let _tokenAddr: TokenId;
    let _beneficiary: string;

    // duration in seconds of timelock
    let lockDuration = 20;

    // initial supply of tokens to be sent to contract to timelock
    let initAmount = Long.fromString('10000000000000000') 

    // first waiting period to let mirror node catch up with contract balance (ms)
    let firstWait = 8000

    beforeEach(async () => {
        [wallet, other] = await (hethers as any).getSigners()
        myRawPubKey = ""+env.myPrivateKey.publicKey.toEvmAddress()
        aliceRawPubKey = ""+env.alicePrivateKey.publicKey.toEvmAddress()

        _beneficiary = env.aliceId.toSolidityAddress();
        _tokenAddr = await Utils.createToken(
            "token0",
            "TK0", 
            initAmount, 
            initAmount,
            env.myPrivateKey,
            env.myPrivateKey,
            env.myAccountId,
            env.myPrivateKey, 
            TokenSupplyType.Finite, 
            env.myClient, 
        )
        timelock = await timelockFixture(
            _tokenAddr.toSolidityAddress(), 
            env.alicePrivateKey.publicKey.toEvmAddress(),
            lockDuration
        )
        await Utils.tokenTransferTransaction(
            _tokenAddr, 
            initAmount,
            timelock.address, 
            env.myAccountId.toString(), 
            env.myClient
        )
    })

    describe('TimeLock Tests', async () => {

        it('sets owner, tokenAddr, duration, released, beneficiary', async () => {

            expect((await timelock.owner()).toString().toUpperCase()).to.equal("0X"+myRawPubKey.toUpperCase());
            expect((await timelock.released()).toString()).to.equal('0');
            expect((await timelock.beneficiary()).toString().toUpperCase()).to.equal("0X"+aliceRawPubKey.toUpperCase());
            expect((await timelock.tokenAddr()).toString().toUpperCase()).to.equal("0X"+_tokenAddr.toSolidityAddress().toUpperCase());
        })

        it('owner can change beneficiary', async () => {
            
            const set = await timelock.setBeneficiary(env.myAccountId.toSolidityAddress());
            expect((await timelock.beneficiary()).toString().toUpperCase()).to.equal("0X"+env.myAccountId.toSolidityAddress().toUpperCase());
        })

        it('does not release too early', async () => {

            Utils.wait(firstWait) // wait for mirror node to catch up
            await Utils.associateTokenTransaction(_tokenAddr, env.aliceId, env.aliceClient);

            const balAliceBefore = await Utils.getTokenBalanceForId(env.aliceId.toString(), _tokenAddr.toString(), network);
            const balContractBefore = await Utils.getTokenBalanceForId(timelock.address.toString(), _tokenAddr.toString(), network);
            
            await timelock.release();

            const balAliceAfter = await Utils.getTokenBalanceForId(env.aliceId.toString(), _tokenAddr.toString(), network);
            const balContractAfter = await Utils.getTokenBalanceForId(timelock.address.toString(), _tokenAddr.toString(), network);

            expect(balAliceAfter.toString()).to.equal(balAliceBefore.toString())
            expect(balContractAfter.toString()).to.equal(balContractBefore.toString())
        })

        it('releases entire balance after lockup period ends', async () => {

            Utils.wait(firstWait) // wait for mirror node to catch up
            await Utils.associateTokenTransaction(_tokenAddr, env.aliceId, env.aliceClient);
            Utils.wait(lockDuration*1000 - firstWait) // wait the rest of the lock duration

            const balAliceBefore = await Utils.getTokenBalanceForId(env.aliceId.toString(), _tokenAddr.toString(), network);
            const balContractBefore = await Utils.getTokenBalanceForId(timelock.address.toString(), _tokenAddr.toString(), network);
            
            await timelock.release();
            Utils.wait(firstWait) // wait for the mirror node to catch up

            const balAliceAfter = await Utils.getTokenBalanceForId(env.aliceId.toString(), _tokenAddr.toString(), network);
            const balContractAfter = await Utils.getTokenBalanceForId(timelock.address.toString(), _tokenAddr.toString(), network);

            
            expect(balAliceBefore.toString()).to.equal('0')
            expect(balContractBefore.toString()).to.equal(initAmount.toString())
            expect(balAliceAfter.toString()).to.equal(balContractBefore.toString())
            expect(balContractAfter.toString()).to.equal('0')
        })
    })
})