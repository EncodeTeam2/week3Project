# Tokenized Ballot

Learning to use ERC20 EIP standard and Open Zeppelin contracts implementing a tokenized ballot.

## Setup

---

Put your .env file at root. It should contain:

```env
ERC20_TOKEN_DEPLOYER_PRIVATE_KEY="" # Deploys both contracts. also minter.
VOTER1_PRIVATE_KEY="" # Delegates voting power to VOTER2
VOTER2_PRIVATE_KEY="" # Receives delegation from VOTER1 and votes.
VOTER3_PRIVATE_KEY="" # Just votes
ERC20_TOKEN_CONTRACT_ADDRESS=""
INFURA_API_KEY=""
INFURA_API_SECRET=""
ALCHEMY_API_KEY=""
ETHERSCAN_API_KEY=""
```

Install dependencies

```shell
yarn install
```

Compile contracts

```shell
yarn hardhat compile
```

## Test

---

```shell
yarn hardhat test
```

## Run no-interaction mode inside hre

---

```shell
yarn run ts-node --files ./scripts/hre/Main.ts
```

## Deployment Scripts

---

### Deploying to Goerli Testnet

In order to properly deploy to Goerli, you need to have a funded account. You can get some Goerli ETH a Goerli Faucet. Once an account is funded with Goerli ETH, you can deploy the contracts to Goerli by running the following commands in this order:

Deploy VotingERC20Token as deployer - needed for users to get voting tokens and getting voting power

```shell
yarn run ts-node --files ./scripts/goerli/DeployVotingToken.ts
```

Mint desired amount of tokens for Voter1 and Voter2.

```shell
yarn run ts-node --files ./scripts/goerli/MintVotingToken.ts "amount"
```

Voter 1 delegates voting power to Voter 2. Also Voter 2 self-delegates to activate vote power.

```shell
yarn run ts-node --files ./scripts/goerli/DelegateVotingToken.ts "Voter2 address"
```

Deploy Tokenized Ballot as deployer. Will get last BlockId. Pass proposals as params.

```shell
yarn run ts-node --files ./scripts/goerli/DeployTokenizedBallot.ts "Proposal 1" "Proposal 2" "Proposal 3"
```

Voter 2 votes certain amount to desired proposal number.

```shell
yarn run ts-node --files ./scripts/goerli/Vote.ts "proposal" "amount"
```

Voter 2 votes half+1 to proposal 2.

```shell
yarn run ts-node --files ./scripts/goerli/Vote.ts "proposal" "amount"
```

Check who's winning on current block.

```shell
yarn run ts-node --files ./scripts/goerli/WinnerName.ts
```
