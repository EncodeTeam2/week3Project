import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { BigNumber } from "ethers"
import { ethers } from "hardhat"
import { TokenizedBallot, TokenizedBallot__factory, VotingERC20Token, VotingERC20Token__factory } from "../../typechain-types"
import { attachToTokenizedBallot, attachToVotingERC20Token } from "../Utils"


export async function deployVotingERC20Token(deployer: SignerWithAddress): Promise<string> {

    // Deploy ERC20 voting token contract
    //const votingERC20TokenContractFactory = await ethers.getContractFactory("VotingERC20Token");
    const votingERC20TokenContractFactory = new VotingERC20Token__factory(deployer)
    const votingERC20TokenContract = await votingERC20TokenContractFactory.deploy() as VotingERC20Token;
    const txReceiptERC20 = await votingERC20TokenContract.deployTransaction.wait();


    // Get tx receipt information
    console.log(`
        Contract Name: ERC20VotingToken
        Action: Deploy
        Deployer: ${txReceiptERC20.from}
        Tx hash: ${txReceiptERC20.transactionHash}
        Block: ${txReceiptERC20.blockNumber}
        Contract Address: ${txReceiptERC20.contractAddress}
        Cost in ETH: ${ethers.utils.formatEther(txReceiptERC20.gasUsed.mul(txReceiptERC20.effectiveGasPrice))}
        Confirmations: ${txReceiptERC20.confirmations}
    `)

    return txReceiptERC20.contractAddress
}

export async function mintVotingERC20Token(contractAddress: string, minter: SignerWithAddress, to: string, amount: BigNumber) {
    // Get instance of votingERC20TokenContract
    const votingERC20TokenContract = await attachToVotingERC20Token(contractAddress, minter)

    // Mint given amount for given address.
    const mintTx = await votingERC20TokenContract
        .mint(
            to,
            amount
        )

    const mintTxReceipt = await mintTx.wait()

    console.log(`
        Contract Name: ERC20VotingToken
        Action: Mint
        Minter: ${minter.address}
        To: ${to}
        Tx hash: ${mintTxReceipt.transactionHash}
        Block: ${mintTxReceipt.blockNumber}
        Cost in ETH: ${ethers.utils.formatEther(mintTxReceipt.gasUsed.mul(mintTxReceipt.effectiveGasPrice))}
        Confirmations: ${mintTxReceipt.confirmations}
    `)

}

export async function delegateVotingERC20Token(contractAddress: string, delegator: SignerWithAddress, delegatee: string) {
    // Get instance of votingERC20TokenContract
    const votingERC20TokenContract = await attachToVotingERC20Token(contractAddress, delegator)

    const votesToDelegate = await votingERC20TokenContract.balanceOf(delegator.address)

    // Mint given amount for given address.
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
}

export async function deployTokenizedBallot(deployer: SignerWithAddress, tokenContractAddress: string, proposals: Array<string>): Promise<string> {

    // Deploy Tokenized Ballot contract
    const tokenizedBallotContractFactory = new TokenizedBallot__factory(deployer)
    const latestBlock = await ethers.provider.getBlock("latest")
    let tokenizedBallotContract = await tokenizedBallotContractFactory.deploy(
        proposals.map(p => ethers.utils.formatBytes32String(p)),
        tokenContractAddress,
        latestBlock.number
    ) as TokenizedBallot;
    const txTokenizedBallotReceipt = await tokenizedBallotContract.deployTransaction.wait();

    console.log(`
        Contract Name: Tokenized Ballot
        Action: Deploy
        Block Snapshot: ${latestBlock.number}
        Deployer: ${txTokenizedBallotReceipt.from}
        Tx hash: ${txTokenizedBallotReceipt.transactionHash}
        Block: ${txTokenizedBallotReceipt.blockNumber}
        Contract Address: ${txTokenizedBallotReceipt.contractAddress}
        Cost in ETH: ${ethers.utils.formatEther(txTokenizedBallotReceipt.gasUsed.mul(txTokenizedBallotReceipt.effectiveGasPrice))}
        Confirmations: ${txTokenizedBallotReceipt.confirmations}
    `)

    return txTokenizedBallotReceipt.contractAddress
}


export async function voteTokenizedBallot(contractAddress: string, voter: SignerWithAddress, proposal: BigNumber, amount: BigNumber) {
    // Get instance of votingERC20TokenContract
    const tokenizedBallotContract = await attachToTokenizedBallot(contractAddress, voter)

    // Vote given amount for given proposal.
    const voteTx = await tokenizedBallotContract
        .connect(voter)
        .vote(proposal, amount)

    const voteTxReceipt = await voteTx.wait()

    console.log(`
        Contract Name: Tokenized Ballot
        Action: Vote
        Proposal #: ${proposal} 
        Voter: ${voteTxReceipt.from}
        Vote weight: ${amount}
        Remaining voting power: ${await tokenizedBallotContract.votingPower(voter.address)}
        Tx hash: ${voteTxReceipt.transactionHash}
        Block: ${voteTxReceipt.blockNumber}
        Cost in ETH: ${ethers.utils.formatEther(voteTxReceipt.gasUsed.mul(voteTxReceipt.effectiveGasPrice))}
        Confirmations: ${voteTxReceipt.confirmations}
    `)
}
