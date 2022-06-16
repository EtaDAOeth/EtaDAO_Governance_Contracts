import { deployments, ethers } from "hardhat";
import { moveTime } from "./utils/move-time";
import { moveBlocks } from "./utils/move-blocks";
import { Contract } from "ethers";
import { SignerWithAddress } from "hardhat-deploy-ethers/signers";

describe("Governance WorkFlow", () => {
  let token: Contract;
  let timelock: Contract;
  let gov: Contract;
  let test: Contract;
  let user: SignerWithAddress;
  let user2: SignerWithAddress;
  let user3: SignerWithAddress;

  before(async () => {
    await deployments.fixture(["all"]);

    [user, user2, user3] = await ethers.getSigners();

    token = await ethers.getContract("EtaToken");
    timelock = await ethers.getContract("TimeLock");
    gov = await ethers.getContract("EtaGovernor");
    test = await ethers.getContract("test");
  });

  describe("WORKFLOW", () => {
    it("Should register proposal", async () => {
      const encodeFunction = test.interface.encodeFunctionData("set", [10]);
      const propose_tx = await gov.propose(
        [test.address],
        [0],
        [encodeFunction],
        "description"
      );

      const propose_receipt = await propose_tx.wait();
      const propId = propose_receipt.events![0].args!.proposalId;
      let proposalState = await gov.state(propId);
      console.log("Current prop id", proposalState);

      await moveBlocks(2);

      const voteTx = await gov.castVoteWithReason(propId, 1, "Because");
      await voteTx.wait();

      proposalState = await gov.state(propId);
      console.log("Current prop id", proposalState);

      await moveBlocks(6);

      const descHash = ethers.utils.id("description");
      console.log(descHash);
      const queueTx = await gov.queue(
        [test.address],
        [0],
        [encodeFunction],
        descHash
      );
      await queueTx.wait();

      await moveTime(3601);
      await moveBlocks(1);

      proposalState = await gov.state(propId);
      console.log("Current prop id", proposalState);

      const exTx = await gov.execute(
        [test.address],
        [0],
        [encodeFunction],
        descHash
      );
      await exTx.wait();

      const num = await test.show();
      console.log(num.toString());
    });
  });
});
