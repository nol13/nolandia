import React from 'react';
import { useMoralis } from "react-moralis";
import { MintPlot } from '../MintPlot/MintPlot';
import { ListPlots } from '../ListPlots/ListPlots';

export const  App = () => {

    const { authenticate, isAuthenticated, isAuthenticating, user, /* account, */ logout } = useMoralis();

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
            <h1>{isAuthenticated && 'Authenticated '}Hello Wyrld!</h1>
            <p>Welcome to Nolandia {user?.get("ethAddress")}!</p>
            <button onClick={login} disabled={isAuthenticated || isAuthenticating}>Moralis Metamask Login</button>
            <button onClick={logOut} disabled={isAuthenticating}>Logout</button>
            { isAuthenticated && <MintPlot />}
            { isAuthenticated && <ListPlots />}
        </div>
    );
}

export default App;