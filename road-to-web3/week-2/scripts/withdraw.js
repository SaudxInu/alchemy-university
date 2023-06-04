const hre = require("hardhat");
const abi = require("../artifacts/contracts/BuyMeACoffee.sol/BuyMeACoffee.json");

async function getBalance(provider, address) {
    const balanceBigInt = await provider.getBalance(address);

    return hre.ethers.utils.formatEther(balanceBigInt);
}

async function main() {
    const contractAddress="0x9Db8f05C246C5228F156B292d006aFBbc23072a4";
    const contractABI = abi.abi;

    const provider = new hre.ethers.providers.AlchemyProvider("goerli", process.env.GOERLI_API_KEY);

    const signer = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const buyMeACoffee = new hre.ethers.Contract(contractAddress, contractABI, signer);

    console.log("Current balance of owner: ", await getBalance(provider, signer.address), "ETH");

    console.log("Current balance of contract: ", await getBalance(provider, buyMeACoffee.address), "ETH");

    const contractBalance = await getBalance(provider, buyMeACoffee.address);

    if (contractBalance !== "0.0") {
        console.log("Withdrawing funds..")

        const withdrawTxn = await buyMeACoffee.withdrawTips();

        await withdrawTxn.wait();
    } else {
        console.log("No funds to withdraw!");
    }

    console.log("Current balance of owner: ", await getBalance(provider, signer.address), "ETH");

    console.log("Current balance of contract: ", await getBalance(provider, buyMeACoffee.address), "ETH");
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
    console.error(error);
    process.exit(1);
});
