import { ethers } from "ethers";
import { attachToTokenizedBallot, attachToVotingERC20Token, configureGoerliWallet } from "../Utils";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
    if (!process.env.ERC20_TOKEN_CONTRACT_ADDRESS) throw new Error("Missing token contract address environment variable.");
    if (!process.env.TOKENIZED_BALLOT_CONTRACT_ADDRESS) throw new Error("Missing tokenized ballot contract address environment variable.");
    if (!process.env.VOTER1_PUBLIC_KEY) throw new Error("Missing voter 1 public key address environment variable.");
    if (!process.env.VOTER2_PUBLIC_KEY) throw new Error("Missing voter 2 public key address environment variable.");

    // Create a wallet instance connected to goerli.
    const play: ethers.Wallet = configureGoerliWallet(process.env.ERC20_TOKEN_DEPLOYER_PRIVATE_KEY);



    // Get instance of votingERC20TokenContract
    const votingERC20TokenContract = await attachToVotingERC20Token(process.env.ERC20_TOKEN_CONTRACT_ADDRESS, play)


    // Get number of votes to delegate
    console.log(await votingERC20TokenContract.balanceOf(process.env.VOTER1_PUBLIC_KEY))
    console.log(await votingERC20TokenContract.balanceOf(process.env.VOTER2_PUBLIC_KEY))
    console.log(await votingERC20TokenContract.getVotes(process.env.VOTER1_PUBLIC_KEY))
    console.log(await votingERC20TokenContract.getVotes(process.env.VOTER2_PUBLIC_KEY))

    const tokenizedBallot = await attachToTokenizedBallot(process.env.TOKENIZED_BALLOT_CONTRACT_ADDRESS, play)
    console.log(await tokenizedBallot.votingPower(process.env.VOTER1_PUBLIC_KEY))
    console.log(await tokenizedBallot.votingPower(process.env.VOTER2_PUBLIC_KEY))


}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
