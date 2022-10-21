// This is a script for deploying your contracts. You can adapt it to deploy

const { network } = require("hardhat");

// yours, or create new ones.
async function main() {
  // This is just a convenience check
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  // ethers is avaialble in the global scope
  console.log(network.name)
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Token = await ethers.getContractFactory("Nolandia");
  console.log(Token, 1);
  const token = await Token.deploy(["0x973DB30532c11e8f4371e95Be9432AbeC97D1c4B", "0xe0e0104dd229C3A99B089d074DB9a4F89Db62559"], [70, 30], 'https://nolandia.dog/tokenUri/', "0x15eee579713d1D219201B661671B145b0459FfBe");
  console.log(token, 2);
  await token.deployed();
  console.log(token, 3);

  console.log("Contract address:", token.address);

  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(token);
}

function saveFrontendFiles(token) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../frontend/src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ Nolandia: token.address }, undefined, 2)
  );

  const TokenArtifact = artifacts.readArtifactSync("Nolandia");

  fs.writeFileSync(
    contractsDir + "/Nolandia.json",
    JSON.stringify(TokenArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
