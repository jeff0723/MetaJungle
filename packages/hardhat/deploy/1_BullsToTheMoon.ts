import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deploy, get } = hre.deployments;
    const { deployer } = await hre.getNamedAccounts();
    const chainId = await hre.getChainId();

    const ensRegistryAddr = 
        chainId === '1337' ?
            (await get("MockEnsRegistry")).address:
            "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";

    // deploy
    await deploy("BullsToTheMoon", {
        from: deployer,
        args: [
            ensRegistryAddr, 
            "ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/",
            [deployer],
            [1]
        ],
    });
};
export default func;