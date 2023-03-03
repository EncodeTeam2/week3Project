import { ethers } from "ethers";
import { Ballot, Ballot__factory } from "../typechain-types";

export function getArguments(args: Array<string>): Array<string> {

    // Remove first 2 default arguments.
    args = args.slice(2)

    // If no arguments were provided, err out.
    if (args.length <= 0) throw new Error("Missing arguments")

    return args
}

export function configureWallet(privateKey: string | undefined): ethers.Wallet {
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

export async function attachToBallot(signerWallet: ethers.Wallet): Promise<Ballot> {
    // Loads the bytecode from contract.
    // Picks contract factory from typechain.
    // Need to pass signer.
    const ballotContractFactory = new Ballot__factory(signerWallet);
    let ballotContractInstance: Ballot;

    // Get deployed contract address from env and attach it to a new contract instance.
    if (process.env.CONTRACT_ADDRESS !== undefined) {
        ballotContractInstance = ballotContractFactory.attach(process.env.CONTRACT_ADDRESS)
    } else {
        throw new Error("Missing contract address.")
    }

    return ballotContractInstance
}
