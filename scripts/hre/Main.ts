import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { token } from "../../typechain-types/@openzeppelin/contracts";
import { attachToTokenizedBallot, attachToVotingERC20Token } from "../Utils";
import { delegateVotingERC20Token, deployTokenizedBallot, deployVotingERC20Token, mintVotingERC20Token, voteTokenizedBallot } from "./ModularSingleScriptWithoutArguments";

const TOKENS_OF_ACCOUNT1: BigNumber = BigNumber.from(1)
const TOKENS_OF_ACCOUNT2: BigNumber = BigNumber.from(2)
const TOKENS_OF_ACCOUNT3: BigNumber = BigNumber.from(3)

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

async function main() {


    //const tokenContractInstance = await attachToVotingERC20Token(tokenContractAddress, accounts[0])


    // get signers accounts.
    const accounts = await ethers.getSigners();

    // Deploy ERC20VotingToken contract and get it's address.
    const tokenContractAddress = await deployVotingERC20Token(accounts[0])

    // Mint TOKENS_OF_ACCOUNT1 for account[1] 
    // Need to pass contract address to attach.
    await mintVotingERC20Token(tokenContractAddress, accounts[0], accounts[1].address, BigNumber.from(TOKENS_OF_ACCOUNT1))
    // Mint TOKENS_OF_ACCOUNT2 for account[2] 
    await mintVotingERC20Token(tokenContractAddress, accounts[0], accounts[2].address, BigNumber.from(TOKENS_OF_ACCOUNT2))
    await mintVotingERC20Token(tokenContractAddress, accounts[0], accounts[3].address, BigNumber.from(TOKENS_OF_ACCOUNT3))


    // account[1] delegates it's tokens to account[2]
    await delegateVotingERC20Token(tokenContractAddress, accounts[1], accounts[2].address)

    // Make self-delegations of accounts to gain voting power before deploying Tokenized Ballot.
    await delegateVotingERC20Token(tokenContractAddress, accounts[2], accounts[2].address)
    await delegateVotingERC20Token(tokenContractAddress, accounts[3], accounts[3].address)

    // Deploy Tokenized Ballot passing tokenContractAddress and proposals.
    const tokenizedBallotContractAddress = await deployTokenizedBallot(accounts[0], tokenContractAddress, PROPOSALS)

    const tokenizedBallotInstance = await attachToTokenizedBallot(tokenizedBallotContractAddress, accounts[0])

    // account[2] votes all power to Proposal #2
    await voteTokenizedBallot(tokenizedBallotContractAddress, accounts[2], BigNumber.from(1), await tokenizedBallotInstance.votingPower(accounts[2].address))

    // account[3] votes all power -1 to Proposal #3
    await voteTokenizedBallot(tokenizedBallotContractAddress, accounts[3], BigNumber.from(2), (await tokenizedBallotInstance.votingPower(accounts[3].address)).sub(1))

    // account[3] votes all remaining power to Proposal #2
    await voteTokenizedBallot(tokenizedBallotContractAddress, accounts[3], BigNumber.from(1), await tokenizedBallotInstance.votingPower(accounts[3].address))

    const winningProposal = await tokenizedBallotInstance.proposals(await tokenizedBallotInstance.winningProposal())
    console.log(`
        Winner: ${ethers.utils.parseBytes32String(winningProposal.name)}
        Votes: ${winningProposal.voteCount}
        Block Number: ${(await ethers.provider.getBlock("latest")).number}
    `)
}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
