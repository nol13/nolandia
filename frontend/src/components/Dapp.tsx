import { MoralisProvider } from "react-moralis"

import { App } from './App/App'

export const Dapp = () => {
  return (
    <MoralisProvider serverUrl="https://5qutjtcib8xk.usemoralis.com:2053/server" appId="LNbf2dWRwfg0C3THO1tQm2bNvkqGD4YWQIHYrfkO">
      <App />
    </MoralisProvider>
  );

}