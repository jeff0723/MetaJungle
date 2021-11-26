// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers, getNamedAccounts } from "hardhat";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const { deployer } = await getNamedAccounts();

  // We get the contract to deploy
  const BullsFactory = await ethers.getContractFactory("Bullosseum");
  const bullsContract = await BullsFactory.deploy(
    "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
    "ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/",
    [deployer], [1]);

  await bullsContract.deployed();
  console.log("Bullosseum deployed to:", bullsContract.address);
  const bafAddr = await bullsContract.getAddrOfBAF();
  console.log("BullosseumAmissionFee deployed to:", bafAddr);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
