import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployTimeLock: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, get } = deployments;

  const { deployer } = await getNamedAccounts();

  const token = await get("EtaToken");
  const timelock = await get("TimeLock");

  await deploy("EtaGovernor", {
    from: deployer,
    args: [token.address, timelock.address],
    log: true,
  });

  console.log("--------------------------------------");
};
export default deployTimeLock;
deployTimeLock.tags = ["TimeLock", "all"];
