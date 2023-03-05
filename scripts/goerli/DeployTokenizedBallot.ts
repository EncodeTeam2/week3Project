import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber, ethers } from "ethers";
import { TokenizedBallot, TokenizedBallot__factory } from "../../typechain-types";
import { configureGoerliWallet, getArguments } from "../Utils";

export async function deployTokenizedBallot() {
    // Check if token contract address is in .env.
    if (!process.env.ERC20_TOKEN_CONTRACT_ADDRESS) throw new Error("Missing token contract address enviroment variable.")


    // Receives proposals from arguments
    const proposals = getArguments(process.argv)

    // Create a wallet instance connected to goerli.
    const deployer: ethers.Wallet = configureGoerliWallet(process.env.ERC20_TOKEN_DEPLOYER_PRIVATE_KEY);

    // Get latest block.
    const latestBlock = await deployer.provider.getBlockNumber()

    // Deploy Tokenized Ballot contract
    const tokenizedBallotContractFactory = new TokenizedBallot__factory(deployer)
    let tokenizedBallotContract = await tokenizedBallotContractFactory.deploy(
        proposals.map(p => ethers.utils.formatBytes32String(p)),
        process.env.ERC20_TOKEN_CONTRACT_ADDRESS,
        latestBlock
    ) as TokenizedBallot;
    const txTokenizedBallotReceipt = await tokenizedBallotContract.deployTransaction.wait();

    console.log(`
        Contract Name: Tokenized Ballot
        Action: Deploy
        Block Snapshot: ${latestBlock}
        Deployer: ${txTokenizedBallotReceipt.from}
        Tx hash: ${txTokenizedBallotReceipt.transactionHash}
        Block: ${txTokenizedBallotReceipt.blockNumber}
        Contract Address: ${txTokenizedBallotReceipt.contractAddress}
        Cost in ETH: ${ethers.utils.formatEther(txTokenizedBallotReceipt.gasUsed.mul(txTokenizedBallotReceipt.effectiveGasPrice))}
        Confirmations: ${txTokenizedBallotReceipt.confirmations}
    `)
}

deployTokenizedBallot().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
