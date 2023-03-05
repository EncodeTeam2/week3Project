import * as dotenv from 'dotenv';
import { BigNumber, ethers } from "ethers";
import { attachToTokenizedBallot, configureGoerliWallet } from '../Utils';
dotenv.config()

async function WinningProposalAndWinnerNameScript() {
    if (!process.env.TOKENIZED_BALLOT_CONTRACT_ADDRESS) throw new Error("Missing ballot contract address enviroment variable.")

    // Create a wallet instance connected to goerli.

    const signer: ethers.Wallet = configureGoerliWallet(process.env.ERC20_TOKEN_DEPLOYER_PRIVATE_KEY);

    // Get instance of Tokenized Ballot token contract.
    const tokenizedBallotContract = await attachToTokenizedBallot(process.env.TOKENIZED_BALLOT_CONTRACT_ADDRESS, signer)

    // Grabbing the values from winning proposal and winner proposal name
    const winningProposal = await tokenizedBallotContract.proposals(await tokenizedBallotContract.winningProposal())
    console.log(`
        Winner: ${ethers.utils.parseBytes32String(winningProposal.name)}
        Votes: ${winningProposal.voteCount}
        Block Number: ${await signer.provider.getBlockNumber()}
    `)

}

WinningProposalAndWinnerNameScript().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
