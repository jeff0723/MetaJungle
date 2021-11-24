import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { ethers } from 'hardhat';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const chainId = await hre.getChainId();

    if (chainId === '1337') {
        const { deploy, execute } = hre.deployments;
        const { deployer } = await hre.getNamedAccounts();
        console.log("");
        const ens = await deploy("MockEnsRegistry", { from: deployer });
        console.log("ENS deployed to:", ens.address);
        console.log("");
        const resolver = await deploy("MockPublicResolver", { from: deployer });
        console.log("Resolver deployed to:", resolver.address);
        const mockPairs = ['eth-usd', 'btc-usd', 'bnb-usd', 'link-usd'];
        const mockPrices = [3500, 50000, 400, 30];

        for (const [idx, pair] of mockPairs.entries()) {
            const pairHash = ethers.utils.namehash(pair + ".data.eth");
            console.log("");
            console.log(pair, "=>", pairHash);
            const mockAgg = await deploy(`MockV3Aggregator_${pair}`, {
                contract: 'MockV3Aggregator',
                from: deployer,
                args:[1, mockPrices[idx]*10**8]
            });
            console.log(idx, pair, "Aggregator deployed to:", mockAgg.address);  
            await execute(
                "MockEnsRegistry", { from: deployer },
                "setResolver", pairHash, resolver.address
            );
            await execute(
                "MockPublicResolver", { from: deployer },
                "setAddr", pairHash, mockAgg.address
            );
        }
    }    
};
export default func;
  