import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { network } from "hardhat";

const deployEtaToken: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  if (network.name == "hardhat") {
    await deploy("test", {
      from: deployer,
      args: [],
      log: true,
    });
  }

  console.log("--------------------------------------");
};
export default deployEtaToken;
deployEtaToken.tags = ["test", "all"];
