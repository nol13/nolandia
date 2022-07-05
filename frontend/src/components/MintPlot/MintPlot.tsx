import React, { useState, useEffect } from "react";
import { useWeb3Contract, useWeb3ExecuteFunction, useMoralis } from "react-moralis";
import NolandiaAbi from '../../contracts/Nolandia.json';
import contractAddress from "../../contracts/contract-address.json";
//  "Nolandia": "0x4A5B2494CBae765766684dC7F58fF381f2C756B4"


export const MintPlot = () => {
    const { user, isWeb3Enabled } = useMoralis();
    const { data, error, runContractFunction, isFetching, isLoading } =
        useWeb3Contract({
            abi: NolandiaAbi.abi,
            contractAddress: contractAddress.Nolandia,
            functionName: "buyPlot"
        });

    //const balance = runContractFunction({params: {}})
    const { data: balanceData, error: bError, fetch, /* isFetching, isLoading */ } = useWeb3ExecuteFunction({
        abi: NolandiaAbi.abi,
        contractAddress: contractAddress.Nolandia,
        functionName: "balanceOf",
        params: {
            owner: user?.get("ethAddress")
        },
    });

    useEffect(() => {
        isWeb3Enabled && fetch()
    }, [isWeb3Enabled])

    //console.log(isInitializing)
 
    
    const [x1, setX1] = useState<string>("");
    const [y1, setY1] = useState<string>("");
    const [x2, setX2] = useState<string>("");
    const [y2, setY2] = useState<string>("");

    const mint = () => {
        const x1Int = parseInt(x1);
        const y1Int = parseInt(y1);
        const x2Int = parseInt(x2);
        const y2Int = parseInt(y2);

        if (
            Number.isInteger(x1Int) &&
            Number.isInteger(y1Int) &&
            Number.isInteger(x2Int) &&
            Number.isInteger(y2Int)
        ) {
            const value = ((x2Int - x1Int) * (y2Int - y1Int)) * 64
            const options = {
                params: { x1, y1, x2, y2 },
                msgValue: `${value}`
            }
            runContractFunction({ params: options }).then(() => fetch());
        }
    };
    //console.log(bError)
    return (
        <div style={{padding: '10px', border: '1px solid black'}}>
            <h1>Mint New Plot</h1>
            <div>x1: <input value={x1} onChange={e => setX1(e.target.value)} /></div>
            <div>y1: <input value={y1} onChange={e => setY1(e.target.value)} /></div>
            <div>x2: <input value={x2} onChange={e => setX2(e.target.value)} /></div>
            <div>x2: <input value={y2} onChange={e => setY2(e.target.value)} /></div>
            <div><button disabled={isFetching || isLoading} onClick={mint}>Mint!</button></div>
            <div>data: {JSON.stringify(data)}</div>
            <div>mint error: {JSON.stringify(error)}</div>
            <div>you own: {JSON.stringify(balanceData)} plots</div>
            <div>balance check error: {JSON.stringify(bError)}</div>
           
        </div>
    )
};