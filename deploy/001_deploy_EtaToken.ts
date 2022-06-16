import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const deployEtaToken: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  await deploy("EtaToken", {
    from: deployer,
    args: [],
    log: true,
  });

  const token = await ethers.getContract("EtaToken", deployer);
  const tx = await token.delegate(deployer);
  await tx.wait();

  console.log("--------------------------------------");
};
export default deployEtaToken;
deployEtaToken.tags = ["Token", "all"];
