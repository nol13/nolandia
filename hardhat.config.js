require("@nomiclabs/hardhat-waffle");

// The next line is part of the sample project, you don't need it in your
// project. It imports a Hardhat task definition, that can be used for
// testing the frontend.
require("./tasks/faucet");

// Go to https://www.alchemyapi.io, sign up, create
// a new App in its dashboard, and replace "KEY" with its key
const ALCHEMY_API_KEY = "y8DH9fbRKPwePMOfYj_nNIil8Llk6CqK";

// Replace this private key with your Ropsten account private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Be aware of NEVER putting real Ether into testing accounts
const ROPSTEN_PRIVATE_KEY = "7e6dc6d1a6f895f1c8019808bdb23f8214dc3f366f1810556d7202d0eb613ef5";

module.exports = {
  solidity: "0.8.9",
  networks: {
    hardhat: {
      chainId: 1337
    },
    ropsten: {
      url: `https://eth-ropsten.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [`${ROPSTEN_PRIVATE_KEY}`],
      chainId: 3
    },
  }
};
