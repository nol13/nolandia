import { WagmiConfig, createClient, defaultChains, configureChains } from 'wagmi'

import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'

import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
//import Moralis from 'moralis/dist/moralis.min.js'
import { MoralisProvider } from "react-moralis"

import { Profile } from './Profile/Profile'

const alchemyId: string = "y8DH9fbRKPwePMOfYj_nNIil8Llk6CqK" //| undefined = process.env.REACT_APP_ALCHEMY_API_KEY

console.log(alchemyId);
//const web3Provider = await Moralis.enableWeb3();

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, provider, webSocketProvider } = configureChains(defaultChains, [
  //web3Provider(),
  alchemyProvider({ alchemyId }),
  publicProvider(),
])

// Set up client
const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'wagmi',
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true,
      },
    }),
  ],
  provider,
  webSocketProvider,
})

export const Dapp = ({message}: {message: String}) => {
    return (
     /*  <MoralisProvider serverUrl="https://xxxxx/server" appId="YOUR_APP_ID"> */
        <WagmiConfig client={client}>
          <Profile />
        </WagmiConfig>
     /*  </MoralisProvider> */
    );
}