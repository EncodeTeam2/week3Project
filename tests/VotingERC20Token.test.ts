import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { formatBytes32String } from 'ethers/lib/utils';
import { ethers } from 'hardhat';
import { VotingERC20Token } from '../typechain-types';

const MINTER_ROLE_HASH = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE"))
const DEFAULT_ADMIN_ROLE_HASH = ethers.constants.HashZero

describe("VotingERC20Token.sol tests", () => {
    let votingERC20TokenContract: VotingERC20Token;
    let accounts: SignerWithAddress[]

    beforeEach(async () => {
        // Looks in artifacts folder the bytecode for VotingERC20Token.sol
        const votingERC20TokenContractFactory = await ethers.getContractFactory("VotingERC20Token");

        // Uses the default signer to deploy the contract with arguments passed.
        // Returns a contract which is attached to an address
        // The contract will be deployed on that address when the transaction is mined.
        votingERC20TokenContract = await votingERC20TokenContractFactory.deploy() as VotingERC20Token;


        // Waits that the contract finishes deploying.
        await votingERC20TokenContract.deployed();

        // Generalize getting accounts
        accounts = await ethers.getSigners();
    })

    describe("when the contract is deployed", () => {
        it("check token values are set as expected and supply is zero", async () => {
            expect(await votingERC20TokenContract.name()).to.be.equal("VotingERC20Token");
            expect(await votingERC20TokenContract.symbol()).to.be.equal("VOTE");
            expect(await votingERC20TokenContract.decimals()).to.be.equal(18);
            expect(await votingERC20TokenContract.totalSupply()).to.be.equal(0);
        })

        it("check deployer has DEFAULT_ADMIN_ROLE and MINTER_ROLE set", async () => {

            expect(await votingERC20TokenContract.
                hasRole(
                    MINTER_ROLE_HASH,
                    accounts[0].address
                )
            ).to.be.equal(true)

            expect(await votingERC20TokenContract.
                hasRole(
                    DEFAULT_ADMIN_ROLE_HASH,
                    accounts[0].address
                )
            ).to.be.equal(true)

        })

        describe("mint function", () => {
            let accountTokenBalanceBeforeMint: BigNumber
            let tokenTotalSupplyBeforeMint: BigNumber
            const TOKENS_TO_MINT: BigNumber = ethers.utils.parseEther("10")

            beforeEach(async () => {
                // Get values before minting
                accountTokenBalanceBeforeMint = await votingERC20TokenContract.balanceOf(accounts[1].address)
                tokenTotalSupplyBeforeMint = await votingERC20TokenContract.totalSupply()

            });

            describe("when called by account without MINTER_ROLE set", () => {
                it("reverts", async () => {
                    await expect(votingERC20TokenContract
                        .connect(accounts[1])
                        .mint(
                            accounts[1].address,
                            TOKENS_TO_MINT
                        )).to.be.revertedWith("AccessControl: account 0x70997970c51812dc3a010c7d01b50e0d17dc79c8 is missing role 0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6")
                })
            })

            describe("when called by account with MINTER_ROLE set", () => {
                it("check account balanceOf and token totalSupply are well calculated", async () => {
                    // Do the minting as accounts[0]. Mint TOKENS_TO_MINT to accounts[1]
                    const mintTx = await votingERC20TokenContract
                        .connect(accounts[0])
                        .mint(
                            accounts[1].address,
                            TOKENS_TO_MINT
                        )

                    await mintTx.wait()

                    expect(await votingERC20TokenContract.totalSupply())
                        .to.be.equal(tokenTotalSupplyBeforeMint.add(TOKENS_TO_MINT))

                    expect(await votingERC20TokenContract.balanceOf(accounts[1].address))
                        .to.be.equal(accountTokenBalanceBeforeMint.add(TOKENS_TO_MINT))
                })
            })

        })
    })
})

