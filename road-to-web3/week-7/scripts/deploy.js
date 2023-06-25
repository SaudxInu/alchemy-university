const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const NftMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");

  const nftMarketplace = await NftMarketplace.deploy();

  await nftMarketplace.deployed();

  const data = {
    address: nftMarketplace.address,
    abi: JSON.parse(nftMarketplace.interface.format("json")),
  };

  fs.writeFileSync("./src/Marketplace.json", JSON.stringify(data));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
