import React from 'react';
import { useMoralis } from "react-moralis";
import { useChain } from "react-moralis";
// import { useMoralisCloudFunction } from "react-moralis";

import { Nolandia } from '../Nolandia/Nolandia';

const networks = [{
    key: "0x89",
    value: "Polygon",
},
{
    key: "0x13881",
    value: "Mumbai",
}, {
    value: "Ethereum Testnet Görli",
    key: "0x5"
},
{
    value: "Ethereum Mainnet",
    key: "0x1"
}];

export const connectors = [
    {
        title: "Metamask",
        //icon: Metamask,
        connectorId: "injected",
        priority: 1,
    },
    {
        title: "WalletConnect",
        //icon: WalletConnect,
        connectorId: "walletconnect",
        priority: 2,
    },
    {
        title: "Trust Wallet",
        // icon: TrustWallet,
        connectorId: "injected",
        priority: 3,
    },
    {
        title: "MathWallet",
        //icon: MathWallet,
        connectorId: "injected",
        priority: 999,
    },
    {
        title: "TokenPocket",
        //icon: TokenPocket,
        connectorId: "injected",
        priority: 999,
    },
    {
        title: "SafePal",
        //icon: SafePal,
        connectorId: "injected",
        priority: 999,
    },
    {
        title: "Coin98",
        //icon: Coin98,
        connectorId: "injected",
        priority: 999,
    },
];


export const Home = () => {

    const { isAuthenticated, user } = useMoralis();
    const { switchNetwork, chain, /* network, chainId, account */ } = useChain();

    const ready = isAuthenticated && chain?.shortName === process.env.REACT_APP_NETWORK_SHORT_NAME;

    return (
        <>
            {/* <div>{account || ''} {chain?.name || ''} {chainId || ""} {network || ""} {chain?.shortName || ""}</div> */}
            {/*<h1>{isAuthenticated && 'Authenticated '}Hello Wyrld!</h1>*/}
            {/*<p>Welcome to Nolandia {user?.get("ethAddress")}!</p>*/}
            {/*{ready && <div style={{ margin: '10px' }}><Link to="buyplot">Buy PlotItem</Link></div>}*/}
            {/*{ready && <div style={{ margin: '10px' }}><Link to="yourplots">Your Plots</Link></div>}*/}
            {/*{ready && <div style={{ margin: '10px' }}><Link to="draw">Draw On Your PlotItem</Link></div>}*/}
            {isAuthenticated && !ready && (
                <div>
                    <br />
                    Please switch your network to Etherium to use the app.
                    <br /><br />
                    <button onClick={() => switchNetwork(networks[parseInt(process.env.REACT_APP_NETWORK_INDEX || "3")].key)}>Switch to Mumbai</button>
                </div>
            )}
            <Nolandia />
        </>
    );
};
