import { ethers } from "ethers";
import { VotingERC20Token__factory } from "../../typechain-types";
import { attachToVotingERC20Token, configureGoerliWallet, getArguments } from "../Utils";
import * as dotenv from 'dotenv';
dotenv.config();

// ERC20 Voting Token does have arguments for constructor.
async function delegateERC20VotingToken(): Promise<void> {
    if (!process.env.ERC20_TOKEN_CONTRACT_ADDRESS) throw new Error("Missing token contract address enviroment variable.")
    if (!process.env.VOTER1_PUBLIC_KEY) throw new Error("Missing voter1 public key enviroment variable.")

    // Receives delegatee token address
    const args = getArguments(process.argv)

    // Check it's a valid address to delegate
    const delegatee: string = args[0]
    if (!ethers.utils.isAddress(delegatee)) throw new Error("Provided address is not valid.")

    // Create a wallet instance connected to goerli.
    const delegator: ethers.Wallet = configureGoerliWallet(process.env.VOTER1_PRIVATE_KEY);

    // Get instance of votingERC20TokenContract
    const votingERC20TokenContract = await attachToVotingERC20Token(process.env.ERC20_TOKEN_CONTRACT_ADDRESS, delegator)

    // Get number of votes to delegate
    const votesToDelegate = await votingERC20TokenContract.balanceOf(process.env.VOTER1_PUBLIC_KEY)

    console.log(`Delegating tokens from ${process.env.VOTER1_PUBLIC_KEY} address to ${delegatee} address`);
    console.log("Waiting for confirmations...");

    // Make the delegation.
    const delegateTx = await votingERC20TokenContract.delegate(delegatee)
    const delegateTxReceipt = await delegateTx.wait()

    console.log(`
       Contract Name: ERC20VotingToken
       Action: Delegate
       Delegator: ${delegateTxReceipt.from}
       Delegatee: ${delegatee}
       Votes delegated: ${votesToDelegate}
       Tx hash: ${delegateTxReceipt.transactionHash}
       Block: ${delegateTxReceipt.blockNumber}
       Cost in ETH: ${ethers.utils.formatEther(delegateTxReceipt.gasUsed.mul(delegateTxReceipt.effectiveGasPrice))}
       Confirmations: ${delegateTxReceipt.confirmations}
`)

    // Create a wallet instance connected to goerli.
    const delegator2: ethers.Wallet = configureGoerliWallet(process.env.VOTER2_PRIVATE_KEY);

    // Get instance of votingERC20TokenContract
    const votingERC20TokenContract2 = await attachToVotingERC20Token(process.env.ERC20_TOKEN_CONTRACT_ADDRESS, delegator2)

    console.log(`Self delegating tokens from ${process.env.VOTER2_PUBLIC_KEY} address`);
    console.log("Waiting for confirmations...");

    // Make the self delegation to activate voting power.
    const selfDelegateTx = await votingERC20TokenContract2.delegate(delegatee)
    const selfDelegateTxReceipt = await selfDelegateTx.wait()

    console.log(`
       Contract Name: ERC20VotingToken
       Action: Self Delegate
       Delegator: ${process.env.VOTER2_PUBLIC_KEY}
       Tx hash: ${selfDelegateTxReceipt.transactionHash}
       Block: ${selfDelegateTxReceipt.blockNumber}
       Cost in ETH: ${ethers.utils.formatEther(selfDelegateTxReceipt.gasUsed.mul(selfDelegateTxReceipt.effectiveGasPrice))}
       Confirmations: ${selfDelegateTxReceipt.confirmations}
`)
}

delegateERC20VotingToken().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
