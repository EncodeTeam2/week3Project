import { configureGoerliWallet } from '../Utils'
import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
import { VotingERC20Token, VotingERC20Token__factory } from '../../typechain-types';
import { TransactionReceipt } from '@ethersproject/providers';
dotenv.config();

// ERC20 Voting Token does have arguments for constructor.
async function deployERC20VotingToken(): Promise<void> {

    // Create a wallet instance connected to goerli.
    const testnetWallet: ethers.Wallet = configureGoerliWallet(process.env.ERC20_TOKEN_DEPLOYER_PRIVATE_KEY);

    // Create the token factory instance.
    const VotingERC20TokenFactory: VotingERC20Token__factory = new VotingERC20Token__factory(testnetWallet);
    console.log("Deploying ERC20 Voting Token...");
    console.log("Waiting for confirmation...");

    // Deploy the Voting ERC20 Token contract
    const VotingERC20TokenContract: VotingERC20Token = await VotingERC20TokenFactory.deploy();
    const VotingERC20TokenReceipt: TransactionReceipt = await VotingERC20TokenContract.deployTransaction.wait();

    console.log(`
        Contract Name: ERC20VotingTokeny
        Action: Deploy
        Deployer: ${VotingERC20TokenReceipt.from}
        Tx hash: ${VotingERC20TokenReceipt.transactionHash}
        Block: ${VotingERC20TokenReceipt.blockNumber}
        Contract Address: ${VotingERC20TokenReceipt.contractAddress}
        Cost in ETH: ${ethers.utils.formatEther(VotingERC20TokenReceipt.gasUsed.mul(VotingERC20TokenReceipt.effectiveGasPrice))}
        Confirmations: ${VotingERC20TokenReceipt.confirmations}
`)
}

deployERC20VotingToken().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
