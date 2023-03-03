import { TokenizedBallot } from './../typechain-types/contracts/TokenizedBallot.sol/TokenizedBallot';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { VotingERC20Token } from '../typechain-types';
import { BigNumber } from 'ethers';

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];
const TEST_BLOCK_ID: BigNumber = BigNumber.from(2)

describe("TokenizedBallot.sol tests", () => {
    let votingERC20TokenContract: VotingERC20Token;
    let tokenizedBallotContract: TokenizedBallot;
    let accounts: SignerWithAddress[]

    beforeEach(async () => {

        // Deploy VotingERC20Token contract.
        const votingERC20TokenContractFactory = await ethers.getContractFactory("VotingERC20Token");
        votingERC20TokenContract = await votingERC20TokenContractFactory.deploy() as VotingERC20Token;
        await votingERC20TokenContract.deployed();


        // Deploy TokenizedBallot contract.
        const tokenizedBallotContractFactory = await ethers.getContractFactory("TokenizedBallot");
        tokenizedBallotContract = await tokenizedBallotContractFactory.deploy(
            PROPOSALS.map(p => ethers.utils.formatBytes32String(p)),
            votingERC20TokenContract.address,
            TEST_BLOCK_ID
        ) as TokenizedBallot;
        await tokenizedBallotContract.deployed();

        // Generalize getting accounts
        accounts = await ethers.getSigners();
    })

    describe("when the contract is deployed", () => {
        it("has the provided proposals, token address and block ID.", async () => {
            for (let i = 0; i < PROPOSALS.length; i++) {
                const testProposalNameInBytes = ethers.utils.formatBytes32String(PROPOSALS[i])
                const contractProposal = await tokenizedBallotContract.proposals(i)
                expect(testProposalNameInBytes).to.be.equal(contractProposal.name)
                expect(await tokenizedBallotContract.tokenContract())
                    .to.be.equal(votingERC20TokenContract.address)
                expect(await tokenizedBallotContract.blockId())
                    .to.be.equal(TEST_BLOCK_ID)
            }
        })

        it("has zero votes for all proposals", async () => {
            for (let i = 0; i < PROPOSALS.length; i++) {
                const contractProposal = await tokenizedBallotContract.proposals(i)
                expect(contractProposal.voteCount).to.be.equal(0)
            }
        })
    })

    describe("when interacting with the vote function in the contract", () => {
        describe("someone without voting power", () => {
            it("reverts", async () => {
                throw new Error("Not implemented");
            });
        })

        describe("someone with voting power", () => {
            it("reverts if proposal is invalid", async () => {
                throw new Error("Not implemented");
            });

            it("casts the vote if proposal is valid", async () => {
                throw new Error("Not implemented");
            });
        })

    });

    describe("when someone delegates voting power", () => {
        describe("someone without voting power", () => {
            it("reverts", async () => {
                throw new Error("Not implemented");
            });
        })

        describe("someone with voting power", () => {
            it("delegates voting power correctly", async () => {
                throw new Error("Not implemented");
            });
        })
    });


    describe("when someone interact with the winningProposal function before any votes are cast", () => {
        it("should return 0", async () => {
            expect(await tokenizedBallotContract.winningProposal()).to.be.equal(0)
        });
    });

    describe("when someone interact with the winningProposal function after one vote is cast for the second proposal", () => {
        it("should return 1", async () => {
            throw new Error("Not implemented");
        });
    });

    describe("when someone interact with the winnerName function before any votes are cast", () => {
        it("should return name of proposal 1", async () => {
            expect(await tokenizedBallotContract.winnerName()).to.be.equal(ethers.utils.formatBytes32String(PROPOSALS[0]))
        });
    });

    describe("when someone interact with the winnerName function after one vote is cast for the second proposal", () => {
        it("should return name of proposal 2", async () => {
            throw new Error("Not implemented");

        });
    });

    describe("when someone interact with the winningProposal function and winnerName after 5 random votes are cast for the proposals", () => {
        it("should return the name of the winner proposal", async () => {
            throw new Error("Not implemented");
        });
    });
})
