import { TokenizedBallot } from './../typechain-types/contracts/TokenizedBallot.sol/TokenizedBallot';
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "ethers";
import { TokenizedBallot__factory, VotingERC20Token, VotingERC20Token__factory } from "../typechain-types";

export function getArguments(args: Array<string>): Array<string> {

    // Remove first 2 default arguments.
    args = args.slice(2)

    // If no arguments were provided, err out.
    if (args.length <= 0) throw new Error("Missing arguments")

    return args
}

export function configureGoerliWallet(privateKey: string | undefined): ethers.Wallet {
    // Configure provider as goerli

    const provider = ethers.providers.getDefaultProvider("goerli", {
        // Provide personal keys from environment.
        alchemy: process.env.ALCHEMY_API_KEY,
        etherscan: process.env.ETHERSCAN_API_KEY,
        infura: {
            projectId: process.env.INFURA_API_KEY,
            projectSecret: process.env.INFURA_API_SECRET,
        }
    })

    //const provider = new ethers.providers.AlchemyProvider("goerli", process.env.ALCHEMY_API_KEY)

    if (!privateKey || privateKey.length <= 0) {
        throw new Error("Missing private key")
    }

    // Connect to our wallet providing our private key.
    const wallet = new ethers.Wallet(privateKey)

    // return wallet connected to goerli.
    return wallet.connect(provider)
}

export async function attachToVotingERC20Token(contractAddress: string, signerWallet: SignerWithAddress): Promise<VotingERC20Token> {
    // Loads the bytecode from contract.
    // Picks contract factory from typechain.
    // Need to pass signer.
    const votingERC20TokenContractFactory = new VotingERC20Token__factory(signerWallet);
    let votingERC20TokenContractInstance: VotingERC20Token;

    votingERC20TokenContractInstance = votingERC20TokenContractFactory.attach(contractAddress)

    return votingERC20TokenContractInstance
}

export async function attachToTokenizedBallot(contractAddress: string, signerWallet: SignerWithAddress): Promise<TokenizedBallot> {
    // Loads the bytecode from contract.
    // Picks contract factory from typechain.
    // Need to pass signer.
    const tokenizedBallotContractFactory = new TokenizedBallot__factory(signerWallet);
    let tokenizedBallotContractInstance: TokenizedBallot;

    tokenizedBallotContractInstance = tokenizedBallotContractFactory.attach(contractAddress)

    return tokenizedBallotContractInstance
}
