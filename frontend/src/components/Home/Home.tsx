import React from 'react';
import { useMoralis } from "react-moralis";
import { useChain } from "react-moralis";
import { Link } from "react-router-dom";


export const Home = () => {

    const { authenticate, isAuthenticated, isAuthenticating, user, /* account, */ logout, enableWeb3 } = useMoralis();
    const { /* switchNetwork, */ chainId, chain, account, network } = useChain();

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
            <button onClick={() => enableWeb3} disabled={isAuthenticating}>w3</button>
            {isAuthenticated && <div style={{ margin: '10px' }}><Link to="buyplot">Buy Plot</Link></div> }
            {isAuthenticated && <div style={{ margin: '10px' }}><Link to="yourplots">Your Plots</Link></div> }
            {isAuthenticated && <div style={{ margin: '10px' }}><Link to="draw">Draw On Your Plot</Link></div> }
        </div>
    );
};