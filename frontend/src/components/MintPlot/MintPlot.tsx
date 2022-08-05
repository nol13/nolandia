import React, {useState, useEffect, useContext, useRef, SyntheticEvent} from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import classnames from "classnames";
import { ToastContainer, toast } from 'react-toastify';
import NolandiaAbi from '../../contracts/Nolandia.json';
import contractAddress from "../../contracts/contract-address.json";
import { PlotDataContextType, PlotDataContext } from "../App/App";
import styles from './MintPlot.module.scss';
import 'react-toastify/dist/ReactToastify.css';

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
    const { /*data,*/ error, runContractFunction, /*isFetching, isLoading*/ } =
        useWeb3Contract({
            abi: NolandiaAbi.abi,
            contractAddress: contractAddress.Nolandia,
            functionName: "buyPlot"
        });

    const [point1, setPoint1] = useState<Point>();
    const [point2, setPoint2] = useState<Point>();
    const [clickPos, setClickPos] = useState<Point>();

    const [parcelsOwned, setParcelsOwned] = useState<boolean[][]>();

    const plotGridRef = useRef<HTMLCanvasElement>(null);

    const {
        mappedPlotData
    } = useContext<PlotDataContextType>(PlotDataContext);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (e.target !== plotGridRef.current) return;
            setClickPos({ x: e.pageX, y: e.pageY });
        }

        window.addEventListener('click', handleClick);

        return () => window.removeEventListener('click', handleClick);
    }, []);

    useEffect(() => {
        if (!error) return;
        toast.error('Something went wrong!');
    }, [error])

    useEffect(() => {
        console.log('HEH')
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
                    ctx.fillStyle = '#7B3FE4';
                    ctx.fillRect(x * 8 + 1, y * 8 + 1, 7, 7);
                    //setNumSelected(1);
                    toast(`You have selected a parcel: ${1}x${1}
                    Coordinates: (${x}, ${y}) - (${x + 1}, ${y + 1})`);
                } else {
                    setPoint1(undefined);
                    //setNumSelected(0);
                    //setShowOwnedError(true);
                    toast.error('You cannot select a parcel that someone already own');
                }

            } else if (point1 && point2) {
                const {x: xp1, y: yp1} = point1;
                const {x: xp2, y: yp2} = point2;

                if (xp1 === xp2 && yp1 === yp2) {
                    setPoint2(undefined);
                    //setNumSelected(1);
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
                                //setShowOwnedError(true);
                                //setNumSelected(0);

                                toast.error('You cannot select a parcel that someone already own');
                                return;
                            }
                            ctx.fillStyle = '#7B3FE4';
                            ctx.fillRect(i * 8 + 1, j * 8 + 1, 7, 7);
                        }
                    }
                    toast(`You have selected a parcel: ${x2 - x1 + 1}x${y2 - y1 + 1}
                    Coordinates: (${x1}, ${y1}) - (${x2}, ${y2})`);


                }
            }

        }
    }, [point1, point2, parcelsOwned]);

    const selectParcel = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const {clientX, clientY} = event;
        const ctx = plotGridRef.current?.getContext("2d");
        if (ctx && plotGridRef.current) {
            //setShowOwnedError(false);
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
                        ctx.fillStyle = '#bf7ff9';
                        ctx.fillRect(x * 8 + 1, y * 8 + 1, 7, 7);
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
                const value = ((params.x2 - params.x1) * (params.y2 - params.y1)) * 64;
                const stringParams = { x1: params.x1.toString(), y1: params.y1.toString(), x2: params.x2.toString(), y2: params.y2.toString() }
                const options = {
                    params: stringParams,
                    msgValue: `${value}`
                }
                runContractFunction({ params: options }).catch(e => console.log(e));
                setPoint1(undefined);
                setPoint2(undefined);
            }
        }
    };

    const calculateMintButtonPosition = () => {
        let left = 0;
        let top = 0;
        let arrowPos = '';

        if (point1 && point2) {
            const { x: x1, y: y1 } = point1;
            const { x: x2, y: y2 } = point2;

            if (x1 - x2 <= 0) {
                left = 30;
                if (y2 - y1 >= 0) {
                    top = 42;
                    arrowPos = 'rightBottom';
                } else {
                    top = -15;
                    arrowPos = 'rightTop';
                }
            } else {
                left = 30;
                if (y2 - y1 >= 0) {
                    top = 40;
                    arrowPos = 'leftBottom';
                } else {
                    top = -15;
                    arrowPos = 'leftTop';
                }
            }
        } else if (point1) {
            top = 42;
            left = 40;
            arrowPos = 'rightBottom';
        }

        return { left, top, arrowPos };
    }

    const getTopPosMint = () => {
        if (!clickPos) return;
        const pos = clickPos?.y - calculateMintButtonPosition()?.top;
        return pos < 0 ? 0 : pos;
    };

    const getLeftPosMint = () => {
        if (!clickPos) return;
        const pos = clickPos?.x - calculateMintButtonPosition()?.left
        return pos < 0 ? 0 : pos;
    };
    return (
        <div>
            {/*<h1>Mint New Plot</h1>*/}
            {/*<h3>Click once to select one parcel, click again to select multiple parcels.</h3>*/}
            {/*<div>*/}
            {/*    <button className={styles.mintButton} disabled={isFetching || isLoading} onClick={mint}>Mint!</button>*/}
            {/*</div>*/}
            {/*<div>data: {JSON.stringify(data)}</div>*/}
            {/*<div>mint error: {JSON.stringify(error)}</div>*/}
            {/*<div>you own: {JSON.stringify(balanceData)} plots</div>*/}
            {/*<div>balance check error: {JSON.stringify(bError)}</div>*/}
            {/*{showOwnedError && <div style={{color: 'red'}}>Can't buy owned!</div>}*/}
            {/*<div>1: {point1?.x}, {point1?.y} 2: {point2?.x}, {point2?.y} - Parcels Selected: {numSelected}</div>*/}
            <ToastContainer />
            <div className={styles.canvasContainer}>
                <canvas className={styles.plotCanvas} width="1024" height="1024"  ref={plotGridRef} id={styles.canvas} onClick={selectParcel}/>
                {point1 && clickPos && (
                    <button
                        style={{top: getTopPosMint(), left: getLeftPosMint()}}
                        type="button"
                        onClick={mint}
                        className={classnames(styles.mintBtn, styles?.[calculateMintButtonPosition()?.arrowPos])}
                    >Mint</button>
                )}
            </div>
        </div>
    )
};
