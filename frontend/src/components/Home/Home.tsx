import { switchNetwork } from '@wagmi/core';
import React from 'react';
import { useMoralis } from "react-moralis";
import { useChain } from "react-moralis";
import { Link } from "react-router-dom";

const networks =[ {
    key: 0x89,
    value: "Polygon",
},
    {
        key: 0x13881,
        value: "Mumbai",
  }];

export const Home = () => {

    const { authenticate, isAuthenticated, isAuthenticating, user, /* account, */ logout, enableWeb3 } = useMoralis();
    const { /* switchNetwork, */ chainId, chain, account, network } = useChain();

    const ready = isAuthenticated && chain?.shortName === "maticmum";

    const login = async () => {
        if (!isAuthenticated) {

            await authenticate({ signingMessage: "Log in using Moralis" })
                .then(function (user) {
                    //console.log("logged in user:", user);
                    //console.log(user!.get("ethAddress"));
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }

    const logOut = async () => {
        await logout();
        console.log("logged out");
    }


    return (
        <div>
            <div>{account || ''} {chain?.name || ''} {chainId || ""} {network || ""}</div>
            <h1>{isAuthenticated && 'Authenticated '}Hello Wyrld!</h1>
            <p>Welcome to Nolandia {user?.get("ethAddress")}!</p>
            <button onClick={login} disabled={isAuthenticated || isAuthenticating}>Moralis Metamask Login</button>
            <button onClick={logOut} disabled={isAuthenticating}>Logout</button>
            {ready && <div style={{ margin: '10px' }}><Link to="buyplot">Buy Plot</Link></div>}
            {ready && <div style={{ margin: '10px' }}><Link to="yourplots">Your Plots</Link></div>}
            {ready && <div style={{ margin: '10px' }}><Link to="draw">Draw On Your Plot</Link></div>}
            {isAuthenticated && !ready && (
                <div><br />
                    <button onClick={() => switchNetwork({chainId: networks[1].key})}> Please switch your network to Polygon Mumbai to use the app</button>
                </div>
            )}
        </div>
    );
};