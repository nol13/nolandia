import React, { useState, useRef, useEffect, useMemo, useContext } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import NolandiaAbi from '../../contracts/Nolandia.json';
import contractAddress from "../../contracts/contract-address.json";
import { useParams } from "react-router-dom";
import useCanvas from '../../hooks/useCanvas'

import styles from './DrawPixels.module.scss';
import { PlotDataContext } from "../App/App";

export const DrawPixels = () => {
    const { data, error, runContractFunction, isFetching, isLoading } =
        useWeb3Contract({
            abi: NolandiaAbi.abi,
            contractAddress: contractAddress.Nolandia,
            functionName: "setPixels"
        });
    const { isWeb3Enabled } = useMoralis();
    const [numberOfPx, setNumberOfPx] = useState();
    const [xScale, setXScale] = useState(1);
    const [yScale, setYScale] = useState(1);
    const [rect, setRect] = useState();
    const { plotId } = useParams();
    const { combinedProcessedData } = useContext(PlotDataContext);
    const {
        error: canvasError,
        canvasRef,
        canvas,
        plotWidth,
        plotHeight,
        ctx,
        imageData,
        initCanvas,
    } = useCanvas();
    const plot = useMemo(() => combinedProcessedData[plotId], [plotId]);

    useEffect(() => {
        if (!plot) return;
        const { x1, x2, y1, y2, imageData = [] } = plot;
        const plotWidth = (x2 - x1) * 8;
        const plotHeight = (y2 - y1) * 8;

        initCanvas(plotWidth, plotHeight, imageData);

    }, [plotId]);

    useEffect(() => {
        if (!ctx || !canvas || !imageData) return;
        const rect = canvas.getBoundingClientRect();
        const { width: canvasWidth, height: canvasHeight } = rect;
        const xScale = canvasWidth / plotWidth;
        const yScale = canvasHeight / plotHeight;

        setRect(rect);
        setXScale(xScale);
        setYScale(yScale);

        ctx.drawImage(canvas, 0, 0, canvasWidth, canvasHeight);
    }, [canvas, ctx, imageData]);

    const getEventPosition = (event) => {
        const x = Math.round((event.clientX - rect.left) / xScale);
        const y = Math.round((event.clientY - rect.top) / yScale);
        return { x, y }
    }

    const handleClick = (event) => {
        const { x, y } = getEventPosition(event);
    }

    // const draw = () => {
    //     if (!isWeb3Enabled) return;
    //     //const pixels = Array(14336).fill(199);
    //
    //     const imageData = pixEditorRef.current?.toImageData();
    //     //console.log(imageData)
    //     if (imageData?.data?.length) {
    //         //console.log(imageData.data)
    //         runContractFunction({ params: { params: { pixels: Array.from(imageData.data), plotId }, msgValue: `` } });
    //     }
    // };

    if (canvasError) {
        return (
            <div className="wrapper">
                <h2 className={styles.oops}>Oops something goes wrong😔</h2>
            </div>
        );
    }

    return (
        <div className="wrapper">
            {/*<div><button disabled={isFetching || isLoading} onClick={() => draw()}>Draw some pixels!</button></div>*/}
            {/*<div>data: {JSON.stringify(data)}</div>*/}
            {/*<div>draw error: {JSON.stringify(error)}</div>*/}

            <canvas onClick={handleClick} ref={canvasRef} className={styles.canvas} />
        </div>
    )
};
