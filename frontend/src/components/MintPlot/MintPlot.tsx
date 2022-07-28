import React, {useState, useEffect, useContext, useRef} from "react";
import { useWeb3Contract, useWeb3ExecuteFunction, useMoralis } from "react-moralis";
import NolandiaAbi from '../../contracts/Nolandia.json';
import contractAddress from "../../contracts/contract-address.json";
import { PlotDataContextType, PlotDataContext } from "../App/App";
// import styles from './MintPlot.module.css';
//  "Nolandia": "0x4A5B2494CBae765766684dC7F58fF381f2C756B4"

interface Point {
    x: number,
    y: number
}

interface PointPair {
    x1: number,
    x2: number,
    y1: number,
    y2: number
}

const getCoordsFromPoints = (xp1: number, xp2: number, yp1: number, yp2: number): PointPair => {

    let x1 = 0;
    let x2 = 0;
    let y1 = 0;
    let y2 = 0;

    if (xp1 <= xp2 && yp1 <= yp2) {
        x1 = xp1;
        x2 = xp2;
        y1 = yp1;
        y2 = yp2;
    } else if (xp1 <= xp2 && yp1 > yp2) {
        x1 = xp1;
        x2 = xp2;
        y1 = yp2;
        y2 = yp1;
    } else if (xp1 > xp2 && yp1 <= yp2) {
        x1 = xp2;
        x2 = xp1;
        y1 = yp1;
        y2 = yp2;
    } else if (xp1 > xp2 && yp1 > yp2) {
        x1 = xp2;
        x2 = xp1;
        y1 = yp2;
        y2 = yp1;
    }

    return {x1, x2, y1, y2};
};

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

    const [point1, setPoint1] = useState<Point>();
    const [point2, setPoint2] = useState<Point>();
    const [showOwnedError, setShowOwnedError] = useState<boolean>();

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
            paintOwned();
        }
    }, [parcelsOwned, plotGridRef.current]);

    useEffect(() => {
        const ctx = plotGridRef.current?.getContext("2d");
        if (ctx && plotGridRef.current) {
            if (point1 && !point2) {
                ctx.clearRect(0, 0, plotGridRef.current.width, plotGridRef.current.height);
                paintOwned();
                const { x, y } = point1;
                if (!parcelsOwned?.[y]?.[x]) {
                    ctx.fillStyle = '#b233a1';
                    ctx.fillRect(x * 8, y * 8, 8, 8);
                } else {
                    setPoint1(undefined);
                    setShowOwnedError(true);
                }

            } else if (point1 && point2) {
                const {x: xp1, y: yp1} = point1;
                const {x: xp2, y: yp2} = point2;

                if (xp1 === xp2 && yp1 === yp2) {
                    setPoint2(undefined);
                    return;
                } else  {
                   const {x1, x2, y1, y2} = getCoordsFromPoints(xp1, xp2, yp1, yp2);
                    ctx.clearRect(0, 0, plotGridRef.current.width, plotGridRef.current.height);
                    paintOwned();
                    for (let i = x1; i <= x2; i++) {
                        for (let j = y1; j <= y2; j++) {
                            if (parcelsOwned?.[j]?.[i]) {
                                ctx.clearRect(0, 0, plotGridRef.current.width, plotGridRef.current.height);
                                paintOwned();
                                setPoint1(undefined);
                                setPoint2(undefined);
                                setShowOwnedError(true);
                                return;
                            }
                            ctx.fillStyle = '#b233a1';
                            ctx.fillRect(i * 8, j * 8, 8, 8);
                        }
                    }
               }
            }

        }
    }, [point1, point2, parcelsOwned]);

    const selectParcel = (event: React.MouseEvent<HTMLCanvasElement>) => {

        const {clientX, clientY} = event;
        const ctx = plotGridRef.current?.getContext("2d");
        if (ctx && plotGridRef.current) {
            setShowOwnedError(false);
            const { left, top } = plotGridRef.current.getBoundingClientRect();
            const x = clientX - left;
            const y = clientY - top;
            const plotX = Math.floor(x / 8);
            const plotY = Math.floor(y / 8);
            if (point1 && !point2) {
                setPoint2(point1)
            } else if (point1 && point2) {
                setPoint2(undefined);
            }
            setPoint1({x: plotX, y: plotY});
        }
    }

    const paintOwned = () => {
        if (parcelsOwned && plotGridRef.current) {
            const ctx = plotGridRef.current.getContext("2d");
            if (!ctx) return;
            parcelsOwned.forEach((row, y) => {
                row.forEach((parcelVal, x) => {
                    if (parcelVal) {
                        ctx.fillStyle = '#663300';
                        ctx.fillRect(x * 8, y * 8, 8, 8);
                    }
                })
            })
        }
    };

    const mint = () => {

        const {x: x1, y: y1 } = point1 || {};
        const {x: x2, y: y2 } = point2 || {};

        if (x1 !== undefined && y1 !== undefined) {
            let params;
            if (x2 !== undefined && y2 !== undefined) {
                params = getCoordsFromPoints( x1, x2, y1, y2);
                params.x2 = params.x2 + 1;
                params.y2 = params.y2 + 1;
            } else {
                params = { x1, y1, x2: x1 + 1, y2: y1 + 1 }
            }

            if (params) {
                console.log(params)
                const value = ((params.x2 - params.x1) * (params.y2 - params.y1)) * 64;
                console.log(value)
                const stringParams = { x1: params.x1.toString(), y1: params.y1.toString(), x2: params.x2.toString(), y2: params.y2.toString() }
                const options = {
                    params: stringParams,
                    msgValue: `${value}`
                }
                runContractFunction({ params: options }).then(() => fetch()).catch(e => console.log(e));
            }
        }
    };

    return (
        <div style={{padding: '10px', border: '1px solid black'}}>
            <h1>Mint New Plot</h1>
            <h3>Click once to select one parcel, click again to select multiple parcels.</h3>
            <div><button disabled={isFetching || isLoading} onClick={mint}>Mint!</button></div>
            <div>data: {JSON.stringify(data)}</div>
            <div>mint error: {JSON.stringify(error)}</div>
            <div>you own: {JSON.stringify(balanceData)} plots</div>
            <div>balance check error: {JSON.stringify(bError)}</div>
            {showOwnedError && <div style={{color: 'red'}}>Can't buy owned!</div>}
            <div>1: {point1?.x}, {point1?.y} 2: {point2?.x}, {point2?.y}</div>
            <canvas width="1024" height="1024"  ref={plotGridRef} id="nolandiaCanvas" onClick={selectParcel}/>
        </div>
    )
};