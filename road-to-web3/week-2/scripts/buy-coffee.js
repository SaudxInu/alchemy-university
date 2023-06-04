const hre = require("hardhat");


async function getBalance(address) {
  const balanceBigInt = await hre.ethers.provider.getBalance(address);

  return hre.ethers.utils.formatEther(balanceBigInt);
}


async function printBalances(addresses) {
  let idx = 0;
  for (const address of addresses) {
    console.log(`Address ${idx} balance: ${await getBalance(address)}`);

    idx++;
  }
}


async function printMemos(memos) {
  for (const memo of memos) {
    const tipperAddress = memo.from;
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const message = memo.message;

    console.log(`At ${timestamp}, ${tipper} (${tipperAddress}) said: "${message}"`);
  }
}


async function main() {
  const [owner, tipper1, tipper2, tipper3] = await hre.ethers.getSigners();

  const buyMeACoffeeFactory = await hre.ethers.getContractFactory("BuyMeACoffee");

  const buyMeACoffee = await buyMeACoffeeFactory.deploy();

  await buyMeACoffee.deployed();

  console.log(`BuyMeACoffee deployed at ${buyMeACoffee.address}`);

  const addresses = [owner.address, tipper1.address, tipper2.address, tipper3.address, buyMeACoffee.address];

  console.log("Start");

  await printBalances(addresses);

  console.log("Buying coffee...")

  const tip = {value: hre.ethers.utils.parseEther("1")};

  await buyMeACoffee.connect(tipper1).buyCoffee("Carolina", "You're the best!", tip);

  await buyMeACoffee.connect(tipper2).buyCoffee("Vitto", "Amazing teacher", tip);

  await buyMeACoffee.connect(tipper3).buyCoffee("Kay", "I love my Proof of Knowledge", tip);

  console.log("Bought coffee!");

  await printBalances(addresses);

  console.log("Withdrawing tips...");

  await buyMeACoffee.connect(owner).withdrawTips();

  console.log("Withdrawn tips!");

  await printBalances(addresses);

  console.log("Checking out memos...");

  const memos = await buyMeACoffee.getMemos();

  printMemos(memos);

  console.log("End");
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
