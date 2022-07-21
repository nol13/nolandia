import React from 'react';
import { useMoralis } from "react-moralis";
import { useChain } from "react-moralis";
import { Link } from "react-router-dom";

import { Nolandia } from '../Nolandia/Nolandia';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const networks = [{
    key: "0x89",
    value: "Polygon",
},
{
    key: "0x13881",
    value: "Mumbai",
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

    const { authenticate, isAuthenticated, isAuthenticating, user, /* account, */ logout } = useMoralis();
    const { switchNetwork, chainId, chain, account, network } = useChain();

    const ready = isAuthenticated && chain?.shortName === "maticmum";

    const login = async () => {
        if (!isAuthenticated && !isAuthenticating) {

            try {
                //const user =
                await authenticate({ signingMessage: "Log into nolandia!" })
                //console.log("logged in user:", user);
                //console.log(user!.get("ethAddress"));
            } catch (error) {
                console.log(error);
            }

        }
    }

    const logOut = async () => {
        await logout();
        console.log("logged out");
    }

    return (
        <>
            <Header login={login} logout={logOut} isAuth={isAuthenticated || isAuthenticating} />
            <div>{account || ''} {chain?.name || ''} {chainId || ""} {network || ""}</div>
            <h1>{isAuthenticated && 'Authenticated '}Hello Wyrld!</h1>
            <p>Welcome to Nolandia {user?.get("ethAddress")}!</p>
            {ready && <div style={{ margin: '10px' }}><Link to="buyplot">Buy Plot</Link></div>}
            {ready && <div style={{ margin: '10px' }}><Link to="yourplots">Your Plots</Link></div>}
            {ready && <div style={{ margin: '10px' }}><Link to="draw">Draw On Your Plot</Link></div>}
            {isAuthenticated && !ready && (
                <div>
                    <br />
                    Please switch your network to Polygon Mumbai to use the app.
                    <br /><br />
                    <button onClick={() => switchNetwork(networks[1].key)}>Switch to Mumbai</button>
                </div>
            )}
            <Nolandia />
            <Footer />
        </>
    );
};
