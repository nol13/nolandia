import React from 'react';
import { useMoralis } from "react-moralis";

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
            <h1>{isAuthenticated && 'Authenticated '}Moralis Hello World!</h1>
            <p>{user?.get("ethAddress")}</p>
            <button onClick={login} disabled={isAuthenticated || isAuthenticating}>Moralis Metamask Login</button>
            <button onClick={logOut} disabled={isAuthenticating}>Logout</button>
        </div>
    );
}

export default App;