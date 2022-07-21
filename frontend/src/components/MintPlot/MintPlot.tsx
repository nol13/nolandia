import React, {useState, useEffect, useContext, useRef} from "react";
import { useWeb3Contract, useWeb3ExecuteFunction, useMoralis } from "react-moralis";
import NolandiaAbi from '../../contracts/Nolandia.json';
import contractAddress from "../../contracts/contract-address.json";
import { PlotDataContextType, PlotDataContext } from "../App/App";
// import styles from './MintPlot.module.css';
//  "Nolandia": "0x4A5B2494CBae765766684dC7F58fF381f2C756B4"


export const MintPlot = () => {
    const { user, isWeb3Enabled } = useMoralis();
    const { data, error, runContractFunction, isFetching, isLoading } =
        useWeb3Contract({
            abi: NolandiaAbi.abi,
            contractAddress: contractAddress.Nolandia,
            functionName: "buyPlot"
        });

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
    }, [isWeb3Enabled]);

    const [parcelsOwned, setParcelsOwned] = useState<boolean[][]>();

    const plotGridRef = useRef<HTMLCanvasElement>(null);

    const {
        mappedPlotData
    } = useContext<PlotDataContextType>(PlotDataContext);

    useEffect(() => {
        if (mappedPlotData) {
            const newParcelsOwned = Array(128).map(() => Array(128));
            for (const plot of mappedPlotData) {
                const {x1, x2, y1, y2 } = plot;
                for (let i = y1; i < y2; i++) {
                    const row = newParcelsOwned[i] ? newParcelsOwned[i] : Array(128);
                    for (let j = x1; j < x2; j++) {
                        row[j] = true;
                    }
                    newParcelsOwned[i] = row;
                }
            }
            setParcelsOwned(newParcelsOwned)
        }
    }, [mappedPlotData]);

    useEffect(() => {
        if (parcelsOwned && plotGridRef.current) {
            const ctx = plotGridRef.current.getContext("2d");
            if (!ctx) return;
            parcelsOwned.forEach((row, i) => {
                row.forEach((parcelVal, j) => {
                    if (parcelVal) {
                        ctx.fillStyle = '#663300';
                        ctx.fillRect(i * 8, j * 8, 8, 8);
                    }
                })
            })
        }
    }, [parcelsOwned, plotGridRef.current]);

    const selectParcel = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const {clientX, clientY} = event;
        const ctx = plotGridRef.current?.getContext("2d");
        if (ctx && plotGridRef.current) {
            const { left, top } = plotGridRef.current.getBoundingClientRect();
            const x = clientX - left;
            const y = clientY - top;
            const plotX = Math.floor(x / 8);
            const plotY = Math.floor(y / 8);
            ctx.fillStyle = '#b233a1';
            ctx.fillRect(plotX * 8, plotY * 8, 8, 8);
        }
    }

 
    
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

    return (
        <div style={{padding: '10px', border: '1px solid black'}}>
            <h1>Mint New Plot</h1>
            <div>x1: <input value={x1} onChange={e => setX1(e.target.value)} /></div>
            <div>y1: <input value={y1} onChange={e => setY1(e.target.value)} /></div>
            <div>x2: <input value={x2} onChange={e => setX2(e.target.value)} /></div>
            <div>y2: <input value={y2} onChange={e => setY2(e.target.value)} /></div>
            <div><button disabled={isFetching || isLoading} onClick={mint}>Mint!</button></div>
            <div>data: {JSON.stringify(data)}</div>
            <div>mint error: {JSON.stringify(error)}</div>
            <div>you own: {JSON.stringify(balanceData)} plots</div>
            <div>balance check error: {JSON.stringify(bError)}</div>
            <canvas width="1024" height="1024"  ref={plotGridRef} id="nolandiaCanvas" onClick={selectParcel}/>
        </div>
    )
};