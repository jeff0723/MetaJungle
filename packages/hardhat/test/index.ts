import { expect } from "chai";
import { ethers, deployments } from "hardhat";
const { BigNumber } = ethers;
const { parseEther, formatEther, namehash } = ethers.utils;
import { Bullosseum__factory, BullosseumAmissionFee__factory, MockPublicResolver__factory, MockV3Aggregator__factory } from "../../react-app/src/typechain";


describe("Bullosseum", function () {

  it("Simple flow", async function () {
    // Accounts
    const [dev ,user0 ,user1] = await ethers.getSigners();

    // Deployment
    await deployments.fixture(["mock", "bulls"]);
    const bullsDeployment = await deployments.get("Bullosseum");
    const bullsContract = Bullosseum__factory.connect(bullsDeployment.address, dev);
    const bafAddr = await bullsContract.getAddrOfBAF();
    const bafContract = BullosseumAmissionFee__factory.connect(bafAddr, dev);
    const mockResolverDeployment = await deployments.get("MockPublicResolver");
    const mockResolver = MockPublicResolver__factory.connect(mockResolverDeployment.address, dev);
    const ethPriceFeed = MockV3Aggregator__factory.connect(await mockResolver.addr(namehash("eth-usd.data.eth")), dev);
    const linkPriceFeed = MockV3Aggregator__factory.connect(await mockResolver.addr(namehash("link-usd.data.eth")), dev);
    const priceDivider = 10**(await ethPriceFeed.decimals());

    // Test start
    console.log("\nTest start\n");
    let tx, bullData;

    // Dev transfer BAF to user0
    console.log("\nDev transfer 1000 BAF to user0");
    tx = await bafContract.transfer(user0.address, parseEther("1000"));
    await tx.wait();
    console.log("-- user0 has", formatEther(await bafContract.balanceOf(user0.address)), "BAF");

    // Dev transfer BAF to user1
    console.log("\nDev transfer 2000 BAF to user1");
    tx = await bafContract.transfer(user1.address, parseEther("2000"));
    await tx.wait();
    console.log("-- user1 has", formatEther(await bafContract.balanceOf(user1.address)), "BAF");

    // User1 approve BAF to Bullosseum
    tx = await bafContract.connect(user1).approve(bullsContract.address, ethers.constants.MaxUint256);
    await tx.wait();

    // User1 breed a bull
    console.log("\nUser1 breed a bull");
    tx = await bullsContract.connect(user1).breed();
    await tx.wait();
    const bullId1 = await bullsContract.tokenOfOwnerByIndex(user1.address, 0);
    console.log("-- user1 has bull#"+bullId1.toString());

    // User0 approve BAF to Bullosseum
    tx = await bafContract.connect(user0).approve(bullsContract.address, ethers.constants.MaxUint256);
    await tx.wait();

    // User0 breed a bull
    console.log("\nUser0 breed a bull");
    tx = await bullsContract.connect(user0).breed();
    await tx.wait();
    const bullId2 = await bullsContract.tokenOfOwnerByIndex(user0.address, 0);
    console.log("-- user0 has bull#"+bullId2.toString());

    // User1 breed a bull
    console.log("\nUser1 breed a bull");
    tx = await bullsContract.connect(user1).breed();
    await tx.wait();
    const bullId3 = await bullsContract.tokenOfOwnerByIndex(user1.address, 1);
    console.log("-- user1 has bull#"+bullId3.toString());

    // User1 open bull#0 in pair ETH/USD with leverage 1
    console.log("\nUser1 open bull#0 in ETH/USD with leverage 1");
    tx = await bullsContract.connect(user1).open(bullId1, namehash("eth-usd.data.eth"), 10);
    await tx.wait();
    bullData = await bullsContract.getBullData(bullId1);
    console.log("-- bull#0 openPrice", bullData.openPrice.div(priceDivider).toNumber(), "leverage:", bullData.leverage);
    
    // User1 open bull#2 in pair ETH/USD with leverage 5
    console.log("\nUser1 open bull#2 in ETH/USD with leverage 5");
    tx = await bullsContract.connect(user1).open(bullId3, namehash("eth-usd.data.eth"), 50);
    await tx.wait();
    bullData = await bullsContract.getBullData(bullId3);
    console.log("-- bull#2 openPrice", bullData.openPrice.div(priceDivider).toNumber(), "leverage:", bullData.leverage);

    // ETH/USD price rise 20%
    console.log("\nETH/USD rise 20%");
    const previousPrice = (await ethPriceFeed.latestAnswer());
    tx = await ethPriceFeed.updateAnswer( previousPrice.mul(12).div(10) );
    await tx.wait();
    console.log("-- ETH/USD:", previousPrice.div(priceDivider).toNumber(),
                  "=>", (await ethPriceFeed.latestAnswer()).div(priceDivider).toNumber());

    // User1 close bull#0 position
    console.log("\nUser1 close bull#0");
    tx = await bullsContract.connect(user1).close(bullId1);
    await tx.wait();
    bullData = await bullsContract.getBullData(bullId1);
    console.log("-- bull#0 net worth:", bullData.netWorth.toNumber());

    // User1 close bull#2 position
    console.log("\nUser1 close bull#2");
    tx = await bullsContract.connect(user1).close(bullId3);
    await tx.wait();
    bullData = await bullsContract.getBullData(bullId3);
    console.log("-- bull#2 net worth:", bullData.netWorth.toNumber());
  });
});
