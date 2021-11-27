import { expect } from "chai";
import { ethers, deployments } from "hardhat";
const { parseEther, formatEther, namehash } = ethers.utils;
import { MetaJungle__factory, JungleResource__factory, MockPublicResolver__factory, MockV3Aggregator__factory } from "../../react-app/src/typechain";

describe("MetaJungle", function () {

  it("Simple flow", async function () {
    // Accounts
    const [dev, player0, player1] = await ethers.getSigners();

    // Deployment
    await deployments.fixture(["mock", "jungle"]);
    const jungleDeployment = await deployments.get("MetaJungle");
    const jungleContract = MetaJungle__factory.connect(jungleDeployment.address, dev);
    const jgrAddr = await jungleContract.getAddrOfJGR();
    const jgrContract = JungleResource__factory.connect(jgrAddr, dev);
    const mockResolverDeployment = await deployments.get("MockPublicResolver");
    const mockResolver = MockPublicResolver__factory.connect(mockResolverDeployment.address, dev);
    const ethPriceFeed = MockV3Aggregator__factory.connect(await mockResolver.addr(namehash("eth-usd.data.eth")), dev);
    const linkPriceFeed = MockV3Aggregator__factory.connect(await mockResolver.addr(namehash("link-usd.data.eth")), dev);
    const priceDivider = 10**(await ethPriceFeed.decimals());

    // Test start
    console.log("\nTest start\n");
    let tx, junglerData;

    // Dev transfer JGR to player0
    console.log("\nDev transfer 1 JGR to player0");
    tx = await jgrContract.transfer(player0.address, parseEther("1"));
    await tx.wait();
    console.log("-- player0 has", formatEther(await jgrContract.balanceOf(player0.address)), "JGR");

    // Dev transfer JGR to player1
    console.log("\nDev transfer 2 JGR to player1");
    tx = await jgrContract.transfer(player1.address, parseEther("2"));
    await tx.wait();
    console.log("-- player1 has", formatEther(await jgrContract.balanceOf(player1.address)), "JGR");

    // Player1 approve JGR to MetaJungle
    tx = await jgrContract.connect(player1).approve(jungleContract.address, ethers.constants.MaxUint256);
    await tx.wait();

    // Player1 summon a jungler
    console.log("\nPlayer1 summon a jungler");
    tx = await jungleContract.connect(player1).summon();
    await tx.wait();
    const junglerId1 = await jungleContract.tokenOfOwnerByIndex(player1.address, 0);
    console.log("-- player1 has jungler#"+junglerId1.toString());

    // Player0 approve JGR to MetaJungle
    tx = await jgrContract.connect(player0).approve(jungleContract.address, ethers.constants.MaxUint256);
    await tx.wait();

    // Player0 summon a jungler
    console.log("\nPlayer0 summon a jungler");
    tx = await jungleContract.connect(player0).summon();
    await tx.wait();
    const junglerId2 = await jungleContract.tokenOfOwnerByIndex(player0.address, 0);
    console.log("-- player0 has jungler#"+junglerId2.toString());

    // Player1 summon a jungler
    console.log("\nPlayer1 summon a jungler");
    tx = await jungleContract.connect(player1).summon();
    await tx.wait();
    const junglerId3 = await jungleContract.tokenOfOwnerByIndex(player1.address, 1);
    console.log("-- player1 has jungler#"+junglerId3.toString());

    // Player1 open jungler#0 in pair ETH/USD with leverage 1
    console.log("\nPlayer1 open jungler#0 in ETH/USD with leverage 1");
    tx = await jungleContract.connect(player1).open(junglerId1, namehash("eth-usd.data.eth"), 10);
    await tx.wait();
    junglerData = await jungleContract.getJunglerData(junglerId1);
    console.log("-- jungler#0 openPrice", junglerData.openPrice.div(priceDivider).toNumber(), "leverage:", junglerData.leverage);
    
    // Player1 open jungler#2 in pair ETH/USD with leverage 5
    console.log("\nPlayer1 open jungler#2 in ETH/USD with leverage 5");
    tx = await jungleContract.connect(player1).open(junglerId3, namehash("eth-usd.data.eth"), 50);
    await tx.wait();
    junglerData = await jungleContract.getJunglerData(junglerId3);
    console.log("-- jungler#2 openPrice", junglerData.openPrice.div(priceDivider).toNumber(), "leverage:", junglerData.leverage);

    // ETH/USD price rise 20%
    console.log("\nETH/USD rise 20%");
    const previousPrice = (await ethPriceFeed.latestAnswer());
    tx = await ethPriceFeed.updateAnswer( previousPrice.mul(12).div(10) );
    await tx.wait();
    console.log("-- ETH/USD:", previousPrice.div(priceDivider).toNumber(),
                  "=>", (await ethPriceFeed.latestAnswer()).div(priceDivider).toNumber());

    // Player1 close jungler#0 position
    console.log("\nPlayer1 close jungler#0");
    tx = await jungleContract.connect(player1).close(junglerId1);
    await tx.wait();
    junglerData = await jungleContract.getJunglerData(junglerId1);
    console.log("-- jungler#0 power:", junglerData.power);

    // Player1 close jungler#2 position
    console.log("\nPlayer1 close jungler#2");
    tx = await jungleContract.connect(player1).close(junglerId3);
    await tx.wait();
    junglerData = await jungleContract.getJunglerData(junglerId3);
    console.log("-- jungler#2 power:", junglerData.power);
  });
});
