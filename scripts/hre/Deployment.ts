import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { ERC20__factory, TokenizedBallot, TokenizedBallot__factory, VotingERC20Token, VotingERC20Token__factory } from "../../typechain-types";
import { getArguments } from "../Utils";

const TOKENS_TO_MINT = BigNumber.from(1);

async function deploymentScript() {
    // Clean args passed as parameters and get proposals.
    const proposals = getArguments(process.argv)

    //  connected to localhost blockchain
    const provider = ethers.provider;

    const accounts = await ethers.getSigners();


    // Deploy erc20 token contract
    //const votingERC20TokenContractFactory = await ethers.getContractFactory("VotingERC20Token");
    const votingERC20TokenContractFactory = new VotingERC20Token__factory(accounts[0])
    const votingERC20TokenContract = await votingERC20TokenContractFactory.deploy() as VotingERC20Token;
    const txReceiptERC20 = await votingERC20TokenContract.deployTransaction.wait();


    // Get tx receipt information

    console.log(`
        Action: Deploy
        Deployer: ${txReceiptERC20.from}
        Tx hash: ${txReceiptERC20.transactionHash}
        Block: ${txReceiptERC20.blockNumber}
        Contract Name: ERC20VotingToken
        Contract Address: ${txReceiptERC20.contractAddress}
        Cost in ETH: ${ethers.utils.formatEther(txReceiptERC20.gasUsed.mul(txReceiptERC20.effectiveGasPrice))}
        Confirmations: ${txReceiptERC20.confirmations}
    `)


    // accounts[0] (deployer) mints and gives tokens to
    // when the contract is deployed the total supply is 0.
    // when we mint, the total supply increases the amount we minted.
    for (let index = 1; index < 4; index++) {
        // accounts[0] mints to accounts[index] 1 vote
        const mintTx = await votingERC20TokenContract
            .mint(
                accounts[index].address,
                TOKENS_TO_MINT
            )

        const mintTxReceipt = await mintTx.wait()
        const tokensBalance = await votingERC20TokenContract.balanceOf(accounts[index].address)
        console.log(`
        Action: Mint
        Deployer: ${mintTxReceipt.from}
        Balance: ${tokensBalance}
        Tx hash: ${mintTxReceipt.transactionHash}
        Block: ${mintTxReceipt.blockNumber}
        Contract Name: ERC20VotingToken
        Contract Address: ${mintTxReceipt.contractAddress}
        Cost in ETH: ${ethers.utils.formatEther(mintTxReceipt.gasUsed.mul(mintTxReceipt.effectiveGasPrice))}
        Confirmations: ${mintTxReceipt.confirmations}
    `)
    }

    /*     for (let index = 1; index < 4; index++) {
            console.log("*******************************************************")
            console.log("accounts: ", index)
            console.log("balance of: ", await votingERC20TokenContract.balanceOf(accounts[index].address))
            console.log("get votes: ", await votingERC20TokenContract.getVotes(accounts[index].address))
            console.log("*******************************************************")
    
        }
        console.log("")
        console.log("")
    
        console.log("")
    
        console.log("")
    
    
        console.log(" BEFORE SELF DELEGATION ") */
    // self delegations to enable voting powers.
    for (let index = 1; index < 4; index++) {
        const selfDelegate = await votingERC20TokenContract.connect(accounts[index]).delegate(accounts[index].address)
        await selfDelegate.wait()
    }
    /*     console.log(" AFTER SELF DELEGATION ")
    
        console.log("")
    
        console.log("")
    
        console.log("")
    
    
        for (let index = 1; index < 4; index++) {
            console.log("*******************************************************")
            console.log("accounts: ", index)
            console.log("balance of: ", await votingERC20TokenContract.balanceOf(accounts[index].address))
            console.log("get votes: ", await votingERC20TokenContract.getVotes(accounts[index].address))
            console.log("*******************************************************")
    
        } */


    // accounts[1] delegates voting power to accounts[2]
    const delegateTx = await votingERC20TokenContract.connect(accounts[1]).delegate(accounts[2].address)
    const delegateTxReceipt = await delegateTx.wait()

    const delegatorVotingPower = await votingERC20TokenContract.getVotes(accounts[1].address)
    const delegateeVotingPower = await votingERC20TokenContract.getVotes(accounts[2].address)

    console.log(`
    Action: Delegate
    Delegator: ${delegateTxReceipt.from}
    Delegates to: ${accounts[2].address}
    Balance delegator: ${delegatorVotingPower}
    Balance delegatee: ${delegateeVotingPower}
    Tx hash: ${delegateTxReceipt.transactionHash}
    Block: ${delegateTxReceipt.blockNumber}
    Contract Name: ERC20VotingToken
    Contract Address: ${delegateTxReceipt.contractAddress}
    Cost in ETH: ${ethers.utils.formatEther(delegateTxReceipt.gasUsed.mul(delegateTxReceipt.effectiveGasPrice))}
    Confirmations: ${delegateTxReceipt.confirmations}
`)

    // Deploy tokenized ballot contract passing the proposals.
    //const tokenizedBallotContractFactory = await ethers.getContractFactory("TokenizedBallot");
    const tokenizedBallotContractFactory = new TokenizedBallot__factory(accounts[0])
    let tokenizedBallotContract = await tokenizedBallotContractFactory.deploy(
        proposals.map(p => ethers.utils.formatBytes32String(p)),
        votingERC20TokenContract.address,
        delegateTxReceipt.blockNumber
    ) as TokenizedBallot;
    const txTokenizedBallotReceipt = await tokenizedBallotContract.deployTransaction.wait();

    console.log(`
        Action: Deploy
        Deployer: ${txTokenizedBallotReceipt.from}
        Tx hash: ${txTokenizedBallotReceipt.transactionHash}
        Block: ${txTokenizedBallotReceipt.blockNumber}
        Contract Name: Tokenized Ballot
        Contract Address: ${txTokenizedBallotReceipt.contractAddress}
        Cost in ETH: ${ethers.utils.formatEther(txTokenizedBallotReceipt.gasUsed.mul(txTokenizedBallotReceipt.effectiveGasPrice))}
        Confirmations: ${txTokenizedBallotReceipt.confirmations}
    `)

    // vote
    // accounts[1] delegated to accounts[2]
    // accounts[2] has a power of 2
    // accounts[3] has a power of 1

    // Account[2] votes 1 for proposal 1



    /* console.log("")
    console.log("")
    console.log("")
    console.log("")
    console.log("")


    for (let index = 1; index < 4; index++) {
        console.log("*******************************************************")
        console.log("accounts: ", index)
        console.log("balance of: ", await votingERC20TokenContract.balanceOf(accounts[index].address))
        console.log("get votes: ", await votingERC20TokenContract.getVotes(accounts[index].address))
        console.log("voting power: ", await tokenizedBallotContract.votingPower(accounts[index].address))
        console.log("*******************************************************")
    }
 */
    const account2voteProposal1Tx = await tokenizedBallotContract.connect(accounts[2]).vote(0, delegateeVotingPower.sub(1))
    const account2voteProposal1TxReceipt = await account2voteProposal1Tx.wait()

    console.log(`
       Action: Vote
       Proposal #: 1 
       Voter: ${account2voteProposal1TxReceipt.from}
       Vote weight: ${delegateeVotingPower.sub(1)}
       Remaining voting power: ${await tokenizedBallotContract.votingPower(accounts[2].address)}
       Tx hash: ${account2voteProposal1TxReceipt.transactionHash}
       Block: ${account2voteProposal1TxReceipt.blockNumber}
       Contract Name: ERC20VotingToken
       Cost in ETH: ${ethers.utils.formatEther(account2voteProposal1TxReceipt.gasUsed.mul(account2voteProposal1TxReceipt.effectiveGasPrice))}
       Confirmations: ${account2voteProposal1TxReceipt.confirmations}
       `)


    // Account[2] votes 1 for proposal 2
    const account2voteProposal2Tx = await tokenizedBallotContract.connect(accounts[2]).vote(1, BigNumber.from(1))
    const account2voteProposal2TxReceipt = await account2voteProposal2Tx.wait()

    console.log(`
           Action: Vote
           Proposal #: 2 
           Voter: ${account2voteProposal2TxReceipt.from}
           Vote weight: ${delegateeVotingPower.sub(1)}
           Remaining voting power: ${await tokenizedBallotContract.votingPower(accounts[2].address)}
           Tx hash: ${account2voteProposal2TxReceipt.transactionHash}
           Block: ${account2voteProposal2TxReceipt.blockNumber}
           Contract Name: ERC20VotingToken
           Cost in ETH: ${ethers.utils.formatEther(account2voteProposal2TxReceipt.gasUsed.mul(account2voteProposal2TxReceipt.effectiveGasPrice))}
           Confirmations: ${account2voteProposal2TxReceipt.confirmations}
           `)


    // Account[3] votes 1 for proposal 2
    const account3voteProposal2Tx = await tokenizedBallotContract.connect(accounts[3]).vote(1, BigNumber.from(1))
    const account3voteProposal2TxReceipt = await account3voteProposal2Tx.wait()

    console.log(`
           Action: Vote
           Proposal #: 2 
           Voter: ${account3voteProposal2TxReceipt.from}
           Vote weight: ${BigNumber.from(1)}
           Remaining voting power: ${await tokenizedBallotContract.votingPower(accounts[3].address)}
           Tx hash: ${account3voteProposal2TxReceipt.transactionHash}
           Block: ${account3voteProposal2TxReceipt.blockNumber}
           Contract Name: ERC20VotingToken
           Cost in ETH: ${ethers.utils.formatEther(account3voteProposal2TxReceipt.gasUsed.mul(account3voteProposal2TxReceipt.effectiveGasPrice))}
           Confirmations: ${account3voteProposal2TxReceipt.confirmations}
           `)

    // Call winner name

    console.log("Winner: ", ethers.utils.parseBytes32String(await tokenizedBallotContract.winnerName()))
}

deploymentScript().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
