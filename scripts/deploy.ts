import { AccountId, TokenId } from '@hashgraph/sdk'
import { timelockFixture } from '../test/shared/fixtures'

async function deployTimelock() {

    // fill in token address in the form 0.0.123456 between the ''
    let _tokenAddr = TokenId.fromString('0.0.3601763').toSolidityAddress(); 

    // fill in beneficiary address in the form 0.0.123456 between the ''
    let _beneficiary = AccountId.fromString('0.0.31126').toSolidityAddress(); 

    // fill in _lockDuration in seconds... 1 year = 60*60*24*365
    let _lockDuration = 0 

    let contract = await timelockFixture(
        _tokenAddr,
        _beneficiary,
        _lockDuration
    )

    console.log("timelock contract address = " + contract.address)
}

deployTimelock()