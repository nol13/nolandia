require("@nomiclabs/hardhat-waffle");
require('dotenv').config();
require('hardhat-gas-reporter');

// The next line is part of the sample project, you don't need it in your
// project. It imports a Hardhat task definition, that can be used for
// testing the frontend.
require("./tasks/faucet");

// Go to https://www.alchemyapi.io, sign up, create
// a new App in its dashboard, and replace "KEY" with its key
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
// Replace this private key with your Ropsten account private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Be aware of NEVER putting real Ether into testing accounts
const ROPSTEN_PRIVATE_KEY = process.env.ROPSTEN_PRIVATE_KEY;

// https://pro.coinmarketcap.com/account/
const COINMARKETCUP_API_KEY = process.env.COINMARKETCUP_API_KEY;

console.log(ALCHEMY_API_KEY);

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
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [ROPSTEN_PRIVATE_KEY],
      chainId: 80001,
      gasPrice: 35000000000,
    }
  },
  gasReporter: {
    enabled: true,
    outputFile: "gas-reporter.txt",
    noColors: true,
    currency: "USD",
    coinmarketcap: COINMARKETCUP_API_KEY
  }
};
