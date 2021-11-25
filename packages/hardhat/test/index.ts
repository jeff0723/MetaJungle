import { expect } from "chai";
import { ethers, deployments } from "hardhat";
const { BigNumber } = ethers;
const { parseEther, formatEther } = ethers.utils;
import { BullsToTheMoon__factory, MagicGrass__factory } from "../../react-app/src/typechain";


describe("BullsToTheMoon", function () {

  it("Simple flow", async function () {
    // Accounts
    const [dev ,user0 ,user1] = await ethers.getSigners();

    // Deployment
    await deployments.fixture(["mock", "bulls"]);
    const bullsDep = await deployments.get("BullsToTheMoon");
    const bullsContract = BullsToTheMoon__factory.connect(bullsDep.address, dev);
    const mgsAddr = await bullsContract.getMagicGrassAddr();
    const mgsContract = MagicGrass__factory.connect(mgsAddr, dev);

    // Test start
    console.log("\nTest start\n");
  
    // Dev transfer MGS to user0
    const tx0 = await mgsContract.transfer(user0.address, parseEther("1000"));
    await tx0.wait();
    console.log("user0 has", formatEther(await mgsContract.balanceOf(user0.address)));

    // Dev transfer MGS to user1
    const tx1 = await mgsContract.transfer(user1.address, parseEther("2000"));
    await tx1.wait();
    console.log("user1 has", formatEther(await mgsContract.balanceOf(user1.address)));

    // User1 approve MGS to BullsToTheMoon
    const tx2 = await mgsContract.connect(user1).approve(bullsContract.address, ethers.constants.MaxUint256);
    await tx2.wait();

    // User1 breed a bull
    const tx3 = await bullsContract.connect(user1).breed();
    await tx3.wait();
    const bullId0 = await bullsContract.tokenOfOwnerByIndex(user1.address, 0);
    console.log("user1 has bull", bullId0.toNumber());

    // User1 approve MGS to BullsToTheMoon
    const tx4 = await mgsContract.connect(user0).approve(bullsContract.address, ethers.constants.MaxUint256);
    await tx4.wait();

    // User0 breed a bull
    const tx5 = await bullsContract.connect(user0).breed();
    await tx5.wait();
    const bullId1 = await bullsContract.tokenOfOwnerByIndex(user0.address, 0);
    console.log("user0 has bull", bullId1.toNumber());

    // User1 breed a bull
    const tx6 = await bullsContract.connect(user1).breed();
    await tx6.wait();
    const bullId2 = await bullsContract.tokenOfOwnerByIndex(user1.address, 1);
    console.log("user1 has bull", bullId2.toNumber());
  });
});
