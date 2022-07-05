import React from 'react';
import { MoralisProvider } from "react-moralis";
import { BrowserRouter } from "react-router-dom";
import { App } from './App/App';


export const Dapp = () => {
  return (
    <MoralisProvider serverUrl={process.env.REACT_APP_SERVER_URL || ''} appId={process.env.REACT_APP_APP_ID || ''}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MoralisProvider>
  );

}