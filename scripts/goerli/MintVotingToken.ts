import { BigNumber, ContractReceipt, ethers, Wallet } from "ethers";
import { VotingERC20Token } from "../../typechain-types";
import { attachToVotingERC20Token, configureGoerliWallet, getArguments } from "../Utils";
import * as dotenv from "dotenv";
import { TransactionReceipt } from "@ethersproject/providers";
dotenv.config();

// Since the Voting ERC20 Token is already deployed we want to attach to the existing contract
async function mintVotingTokens(): Promise<void> {

  if (!process.env.ERC20_TOKEN_CONTRACT_ADDRESS) throw new Error("Missing token contract address environment variable.");
  if (!process.env.VOTER1_PUBLIC_KEY) throw new Error("Missing voter1 public key address environment variable.");
  if (!process.env.VOTER2_PUBLIC_KEY) throw new Error("Missing voter2 public key address environment variable.");

  // Grab the mint amount from the argument and check to make sure it is a number
  const MINT_AMOUNT = getArguments(process.argv);
  if (MINT_AMOUNT.length > 1) {
    throw new Error("Please only enter 1 number ex. 10");
  } else if (isNaN(parseInt(MINT_AMOUNT[0]))) {
    throw new Error("Please enter a number");
  }

  // Create a wallet with the private key of the Voting ERC20 Token
  const mintingWallet: ethers.Wallet = configureGoerliWallet(process.env.ERC20_TOKEN_DEPLOYER_PRIVATE_KEY);

  // Attach mintingWallet to existing Voting ERC20 Token contract
  const votingERC20TokenContract: VotingERC20Token = await attachToVotingERC20Token(process.env.ERC20_TOKEN_CONTRACT_ADDRESS, mintingWallet);

  console.log(`Minting ${MINT_AMOUNT} tokens for ${process.env.VOTER1_PUBLIC_KEY} address`);
  console.log("Waiting for confirmations...");

  // Mint same amount of tokens for Voters from the env
  const voter1Mint = await votingERC20TokenContract.mint(process.env.VOTER1_PUBLIC_KEY, BigNumber.from(parseInt(MINT_AMOUNT[0])));
  const voter1MintTxReceipt = await voter1Mint.wait();

  console.log(`
    Contract Name: ERC20VotingToken
    Action: Mint
    Minter: ${voter1MintTxReceipt.from}
    To: ${process.env.VOTER1_PUBLIC_KEY}
    Balance: ${await votingERC20TokenContract.balanceOf(process.env.VOTER1_PUBLIC_KEY)}
    Tx hash: ${voter1MintTxReceipt.transactionHash}
    Block: ${voter1MintTxReceipt.blockNumber}
    Cost in ETH: ${ethers.utils.formatEther(voter1MintTxReceipt.gasUsed.mul(voter1MintTxReceipt.effectiveGasPrice))}
    Confirmations: ${voter1MintTxReceipt.confirmations}
`)


  console.log(`Minting ${MINT_AMOUNT} tokens for ${process.env.VOTER2_PUBLIC_KEY} address`);
  console.log("Waiting for confirmations...");

  const voter2Mint = await votingERC20TokenContract.mint(process.env.VOTER2_PUBLIC_KEY, BigNumber.from(parseInt(MINT_AMOUNT[0])));
  const voter2MintTxReceipt = await voter2Mint.wait();

  console.log(`
    Contract Name: ERC20VotingToken
    Action: Mint
    Minter: ${voter2MintTxReceipt.from}
    To: ${process.env.VOTER2_PUBLIC_KEY}
    Balance: ${await votingERC20TokenContract.balanceOf(process.env.VOTER2_PUBLIC_KEY)}
    Tx hash: ${voter2MintTxReceipt.transactionHash}
    Block: ${voter2MintTxReceipt.blockNumber}
    Cost in ETH: ${ethers.utils.formatEther(voter2MintTxReceipt.gasUsed.mul(voter2MintTxReceipt.effectiveGasPrice))}
    Confirmations: ${voter2MintTxReceipt.confirmations}
`)
}

mintVotingTokens().catch((error) => {
  console.log(error);
  process.exitCode = 1;
});
