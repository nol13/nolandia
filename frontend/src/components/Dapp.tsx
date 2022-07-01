import { MoralisProvider } from "react-moralis"

import { App } from './App/App'


export const Dapp = () => {
  return (
    <MoralisProvider serverUrl={process.env.REACT_APP_SERVER_URL || ''} appId={process.env.REACT_APP_APP_ID || ''}>
      <App />
    </MoralisProvider>
  );

}