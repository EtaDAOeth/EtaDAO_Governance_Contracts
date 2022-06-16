import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployTimeLock: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  await deploy("TimeLock", {
    from: deployer,
    args: [3600, [], []],
    log: true,
  });

  console.log("--------------------------------------");
};
export default deployTimeLock;
deployTimeLock.tags = ["TimeLock", "all"];
