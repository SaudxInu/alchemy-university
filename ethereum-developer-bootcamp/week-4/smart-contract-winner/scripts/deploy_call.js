const hre = require("hardhat");
const ethers = require("ethers");

require("dotenv").config();

async function main() {
  let wallet = new ethers.Wallet(
    process.env.PRIVATE_KEY,
    new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_GOERLI_URL)
  );

  let artifacts = await hre.artifacts.readArtifact("Solution");

  let factory = new ethers.ContractFactory(
    artifacts.abi,
    artifacts.bytecode,
    wallet
  );

  let solution = await factory.deploy();

  console.log("Solution Contract Address:", solution.address);

  await solution.deployed();

  await solution.call_attempt("0xcF469d3BEB3Fc24cEe979eFf83BE33ed50988502");

  console.log("Success!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
