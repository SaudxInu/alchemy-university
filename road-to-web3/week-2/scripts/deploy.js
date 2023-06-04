const hre = require("hardhat");


async function main() {
    const buyMeACoffeeFactory = await hre.ethers.getContractFactory("BuyMeACoffee");

    const buyMeACoffee = await buyMeACoffeeFactory.deploy();

    await buyMeACoffee.deployed();

    console.log(`BuyMeACoffee deployed at ${buyMeACoffee.address}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
});

// BuyMeACoffee smart contract deployed at 0x9Db8f05C246C5228F156B292d006aFBbc23072a4

// Frontend at https://replit.com/@SaudIqbal2/Buy-Me-a-Coffee#pages/index.jsx