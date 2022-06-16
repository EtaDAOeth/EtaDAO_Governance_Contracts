import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const setup: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, network } = hre;

  const { deployer } = await getNamedAccounts();

  console.log("SETUP");

  const timeLock = await ethers.getContract("TimeLock", deployer);
  const EtaGovernor = await ethers.getContract("EtaGovernor", deployer);

  const proposerRole = await timeLock.PROPOSER_ROLE();
  const executorRole = await timeLock.EXECUTOR_ROLE();
  const adminRole = await timeLock.TIMELOCK_ADMIN_ROLE();

  const proposer_tx = await timeLock.grantRole(
    proposerRole,
    EtaGovernor.address
  );
  await proposer_tx.wait();

  const executorTx = await timeLock.grantRole(
    executorRole,
    ethers.constants.AddressZero
  );
  await executorTx.wait();

  const revokeTx = await timeLock.revokeRole(adminRole, deployer);
  await revokeTx.wait();

  console.log("--------------------------------------");
};
export default setup;
setup.tags = ["setup", "all"];
