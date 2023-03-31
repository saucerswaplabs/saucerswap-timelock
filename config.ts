// @ts-nocheck
import { NetworksUserConfig } from 'hardhat/types';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' })

export const networks: NetworksUserConfig = {

	local: {
		consensusNodes: [
			{
				url: '127.0.0.1:50211',
				url: '127.0.0.1:50211',
				nodeId: '0.0.3'
			}
		],
		mirrorNodeUrl: 'http://127.0.0.1:5551',
		chainId: 0,
		accounts: [
			{
				"account": process.env.LOCAL_MYACCOUNTID,
				"privateKey": process.env.LOCAL_MYPRIVATEKEY 
			  },
			  {
				"account": process.env.LOCAL_ALICE_ID,
				"privateKey": process.env.LOCAL_ALICE_PRIVATEKEY 
			  }
		]
	},
	testnet: {
		mirrorNodeUrl: 'https://testnet.mirrornode.hedera.com',
		accounts: [
			{
				"account": process.env.TESTNET_MYACCOUNTID,
				"privateKey": process.env.TESTNET_MYPRIVATEKEY
			},
			{
				"account": process.env.TESTNET_ALICE_ID,
				"privateKey": process.env.TESTNET_ALICE_PRIVATEKEY
			}
		]
	},
	mainnet: {
		mirrorNodeUrl: 'https://mainnet-public.mirrornode.hedera.com',
		accounts: [
			{
				"account": process.env.MAINNET_MYACCOUNTID,
				"privateKey": process.env.MAINNET_MYPRIVATEKEY
			},
			{
				"account": process.env.MAINNET_ALICE_ID,
				"privateKey": process.env.MAINNET_ALICE_PRIVATEKEY
			}
		]
	}
};