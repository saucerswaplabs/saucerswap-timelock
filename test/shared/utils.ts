

import { AccountId, Client, Key, PrivateKey, TokenAssociateTransaction, TokenCreateTransaction, TokenId, TokenSupplyType, TokenType, TransferTransaction } from "@hashgraph/sdk";
import { BigNumber as BigNumberJs } from 'bignumber.js'
import axios from 'axios';

export const DEFAULT_DECIMAL = 8
export const BASE_TEN = 10

export namespace Utils {

    export function expandToDecimalsJs(n: number, decimals: number = 8): BigNumberJs {
        return new BigNumberJs(n).multipliedBy(new BigNumberJs(BASE_TEN).pow(decimals))
    }

    export async function createToken(
        name: string, 
        symbol: string, 
        initSupply: Long, 
        maxSupply: Long,
        adminKey: PrivateKey,
        supplyKey: Key, 
        treasuryId: AccountId,
        treasuryKey: PrivateKey, 
        supplyType: TokenSupplyType, 
        client: Client, 
        decimals: number = DEFAULT_DECIMAL
    ): Promise<TokenId> {
        
        let tokenCreateTx = new TokenCreateTransaction()
            .setTokenName(name)
            .setTokenSymbol(symbol)
            .setTokenType(TokenType.FungibleCommon)
            .setDecimals(decimals)
            .setInitialSupply(initSupply.toNumber())
            .setMaxSupply(maxSupply.toNumber())
            .setTreasuryAccountId(AccountId.fromString(treasuryId?.toString()))
            .setSupplyType(supplyType)
            .setSupplyKey(supplyKey)
            .setAdminKey(adminKey)
            .freezeWith(client);

        let tokenCreateSign = await tokenCreateTx.sign(treasuryKey);
        let tokenCreateSubmit = await tokenCreateSign.execute(client);
        let tokenCreateRx = await tokenCreateSubmit.getReceipt(client);
        
        return tokenCreateRx.tokenId!
    }

    export async function associateTokenTransaction(tokenId: TokenId, accountId: AccountId, clientToUse: Client) {

        const transaction = await new TokenAssociateTransaction()
            .setAccountId(accountId)
            .setTokenIds([tokenId])
            .execute(clientToUse);

        const txReceipt = await transaction.getReceipt(clientToUse);
        return txReceipt.status;
    }

    export async function tokenTransferTransaction(tokenId: TokenId, amount: Long, to: string, from: string, clientToUse: Client) {

        const transaction = await new TransferTransaction()
            .addTokenTransfer(tokenId, to, amount)
            .addTokenTransfer(tokenId, from, amount.mul(-1))
            .execute(clientToUse);

        const receipt = await transaction.getReceipt(clientToUse)
        return receipt.status;
    }

    function getMirrorNodeURL(environment: String) {
        switch (environment) {
            case 'mainnet':
                return 'https://mainnet-public.mirrornode.hedera.com/';
            case 'local':
                return 'put local here';
            case 'testnet':
            default:
                return 'https://testnet.mirrornode.hedera.com/'
        }
    }

    export async function getTokenBalanceForId(id: string, tokenId: string, network: string = 'testnet') {
        let url = getMirrorNodeURL(network)
        let endpoint = `${url}api/v1/accounts/${id}/tokens?token.id=${tokenId}`
        let data = await axios.get(endpoint)
        if(!data || !data.data || data.data.tokens.length == 0) {
            return 0
        }
        return data.data.tokens[0].balance
    }

    export function wait(ms: number) {
        var start = new Date().getTime();
        var end = start;
        while (end < start + ms) {
          end = new Date().getTime();
        }
      }

}