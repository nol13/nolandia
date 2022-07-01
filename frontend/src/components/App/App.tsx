import React from 'react';
import { useMoralis } from "react-moralis";
import { useChain } from "react-moralis";

import { MintPlot } from '../MintPlot/MintPlot';
import { ListPlots } from '../ListPlots/ListPlots';
import { DrawPixels } from '../DrawPixels/DrawPixels';


export const  App = () => {

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
            { isAuthenticated && <MintPlot /> }
            { isAuthenticated && <ListPlots /> }
            { isAuthenticated && <DrawPixels /> }
        </div>
    );
}

export default App;