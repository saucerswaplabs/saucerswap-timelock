import { AccountId, Client, PrivateKey } from "@hashgraph/sdk"

/**
 * Container to hold environment variables
 */
export default class EnvContainer  {

    aliceId: AccountId
    alicePrivateKey: PrivateKey
    aliceClient: Client

    myAccountId: AccountId
    myPrivateKey: PrivateKey
    myClient: Client
    
    // use ECSDA keys
    constructor(network: string = "testnet", path: string="./.env") {
        switch(network) {
            case 'local':
            
                this.aliceId = AccountId.fromString(process.env.LOCAL_ALICE_ID!);
                this.alicePrivateKey = PrivateKey.fromStringECDSA(process.env.LOCAL_ALICE_PRIVATEKEY!);
                this.aliceClient = Client.forLocalNode().setOperator(this.aliceId, this.alicePrivateKey);

                this.myAccountId = AccountId.fromString(process.env.LOCAL_MYACCOUNTID!);
                this.myPrivateKey = PrivateKey.fromStringECDSA(process.env.LOCAL_MYPRIVATEKEY!);
                this.myClient = Client.forLocalNode().setOperator(this.myAccountId, this.myPrivateKey);
              
                break;            
            case 'mainnet':

                this.aliceId = AccountId.fromString(process.env.MAINNET_ALICE_ID!);
                this.alicePrivateKey = PrivateKey.fromStringECDSA(process.env.MAINNET_ALICE_PRIVATEKEY!);
                this.aliceClient = Client.forMainnet().setOperator(this.aliceId, this.alicePrivateKey);

                this.myAccountId = AccountId.fromString(process.env.MAINNET_MYACCOUNTID!);
                this.myPrivateKey = PrivateKey.fromStringECDSA(process.env.MAINNET_MYPRIVATEKEY!);
                this.myClient = Client.forMainnet().setOperator(this.myAccountId, this.myPrivateKey);

                break;
            case 'testnet':
            default:
                
                this.aliceId = AccountId.fromString(process.env.TESTNET_ALICE_ID!);
                this.alicePrivateKey = PrivateKey.fromStringECDSA(process.env.TESTNET_ALICE_PRIVATEKEY!);
                this.aliceClient = Client.forTestnet().setOperator(this.aliceId, this.alicePrivateKey);

                this.myAccountId = AccountId.fromString(process.env.TESTNET_MYACCOUNTID!);
                this.myPrivateKey = PrivateKey.fromStringECDSA(process.env.TESTNET_MYPRIVATEKEY!);
                this.myClient = Client.forTestnet().setOperator(this.myAccountId, this.myPrivateKey);

                break;
        }

    }
}