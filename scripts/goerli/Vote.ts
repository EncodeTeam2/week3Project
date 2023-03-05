import { attachToTokenizedBallot, configureGoerliWallet, getArguments } from "../Utils";
import * as dotenv from 'dotenv';
import { ethers } from "ethers";
dotenv.config();

export async function voteTokenizedBallot() {
    if (!process.env.ERC20_TOKEN_CONTRACT_ADDRESS) throw new Error("Missing token contract address enviroment variable.")
    if (!process.env.TOKENIZED_BALLOT_CONTRACT_ADDRESS) throw new Error("Missing ballot contract address enviroment variable.")

    // Receives proposal and amount of votes
    const args = getArguments(process.argv)

    // Check it's a number for proposal 
    const proposal = Number(args[0]) - 1
    if (isNaN(proposal)) {
        throw new Error("Please provide a numerical character for proposal");
    }

    // Check it's a number for amount of votes 
    const amount = Number(args[1])
    if (isNaN(amount)) {
        throw new Error("Please provide a numerical character for amount");
    }

    // Create a wallet instance connected to goerli.
    const voter: ethers.Wallet = configureGoerliWallet(process.env.VOTER2_PRIVATE_KEY);

    // Get instance of Tokenized Ballot token contract.
    const tokenizedBallotContract = await attachToTokenizedBallot(process.env.TOKENIZED_BALLOT_CONTRACT_ADDRESS, voter)

    // Vote given amount for given proposal.
    const voteTx = await tokenizedBallotContract
        .connect(voter)
        .vote(proposal, amount)

    const voteTxReceipt = await voteTx.wait()

    console.log(`
        Contract Name: Tokenized Ballot
        Action: Vote
        Proposal #: ${proposal + 1} 
        Voter: ${voteTxReceipt.from}
        Vote weight: ${amount}
        Remaining voting power: ${await tokenizedBallotContract.votingPower(voter.address)}
        Tx hash: ${voteTxReceipt.transactionHash}
        Block: ${voteTxReceipt.blockNumber}
        Cost in ETH: ${ethers.utils.formatEther(voteTxReceipt.gasUsed.mul(voteTxReceipt.effectiveGasPrice))}
        Confirmations: ${voteTxReceipt.confirmations}
    `)
}

voteTokenizedBallot().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
