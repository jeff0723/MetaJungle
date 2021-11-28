import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deploy, get, read } = hre.deployments;
    const { deployer } = await hre.getNamedAccounts();
    const chainId = await hre.getChainId();

    const ensRegistryAddr = 
        chainId === '1337' ?
            (await get("MockEnsRegistry")).address:
            "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";

    // deploy
    const mjgDeployments = await deploy("MetaJungle", {
        from: deployer,
        args: [
            ensRegistryAddr, 
            "ipfs://QmRTLzaoAYSuiMVENbRpxSbrY7sgFz9K5WE5g8yvtxL485/",
            [deployer],
            [1],
        ],
    });

    console.log("");
    console.log("MetaJungle deployed at:", mjgDeployments.address);
    console.log("");
    console.log("JungleResource deployed at:", await read("MetaJungle", "getAddrOfJGR"));
    console.log("");
};
export default func;
func.tags = ['jungle'];