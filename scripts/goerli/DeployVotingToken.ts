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

    console.log("ERC20 Voting Token deployed at: ", VotingERC20TokenReceipt.contractAddress);
}

deployERC20VotingToken().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
