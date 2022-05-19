const fs = require("fs");

// This file is only here to make interacting with the Dapp easier,
// feel free to ignore it if you don't need it.

task("faucet", "Sends ETH and tokens to an address")
  .addPositionalParam("receiver", "The address that will receive them")
  .setAction(async ({ receiver }) => {
    console.log(1);
    if (network.name === "hardhat") {
      console.warn(
        "You are running the faucet task with Hardhat network, which" +
          "gets automatically created and destroyed every time. Use the Hardhat" +
          " option '--network localhost'"
      );
    }
    console.log(2);

    const addressesFile =
      __dirname + "/../frontend/src/contracts/contract-address.json";

    if (!fs.existsSync(addressesFile)) {
      console.error("You need to deploy your contract first");
      return;
    }
    console.log(3);

    const addressJson = fs.readFileSync(addressesFile);
    console.log(4);
    const address = JSON.parse(addressJson);
    console.log(5);

    if ((await ethers.provider.getCode(address.Nolandia)) === "0x") {
      console.error("You need to deploy your contract first");
      return;
    }
    console.log(6);

    const token = await ethers.getContractAt("Nolandia", address.Nolandia);
    console.log(7);
    const [sender] = await ethers.getSigners();

    console.log(ethers.constants.WeiPerEther);

    //const tx = await token.transfer(receiver, 100);
    //await tx.wait();

    //console.log(receiver);

    const tx2 = await sender.sendTransaction({
      to: receiver,
      value: ethers.constants.WeiPerEther.mul(3000),
    });
    await tx2.wait();

    console.log(`Transferred 1 ETH and 100 tokens to ${receiver}`);
  });
