# Tokenized Ballot

Learning to use ERC20 EIP standard and Open Zeppelin contracts implementing a tokenized ballot.

# Setup

Put your .env file at root. It should contain:

```
PRIVATE_KEY=
INFURA_API_KEY=
INFURA_API_SECRET=
ALCHEMY_API_KEY=
ETHERSCAN_API_KEY=
```

Install dependencies

```
yarn install
```

Compile contracts

```
yarn hardhat compile
```

# Test

```shell
yarn hardhat test
```

# Deploy

```shell
yarn run ts-node --files ./scripts/hre/Deployment.ts "Proposal 1" "Proposal 2" "Proposal 3"
```
