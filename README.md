# Tokenized Ballot

Learning to use ERC20 EIP standard and Open Zeppelin contracts implementing a tokenized ballot.

## Setup

---

Put your .env file at root. It should contain:

```env
PRIVATE_KEY=
INFURA_API_KEY=
INFURA_API_SECRET=
ALCHEMY_API_KEY=
ETHERSCAN_API_KEY=
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

VotingERC20Token - needed for users to get voting tokens and getting voting power

```shell
yarn run ts-node --files ./scripts/deploy/DeployVotingToken.ts
```
