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
        resizeImageData
    } = useCanvas();
    const plot = useMemo(() => combinedProcessedData[plotId], [plotId]);
    const mousePressed = useRef(false);

    useEffect(() => {
        if (!plot || isLoading || isFetching) return;
        const { x1, x2, y1, y2, imageData = [] } = plot;
        const plotWidth = (x2 - x1) * 8;
        const plotHeight = (y2 - y1) * 8;

        initCanvas(plotWidth, plotHeight, imageData);

    }, [plotId, isLoading, isFetching]);

    useEffect( () => {
        if (!ctx || !canvas || !imageData) return;
        const rect = canvas.getBoundingClientRect();
        const { width: canvasWidth, height: canvasHeight } = rect;
        const xScale = canvasWidth / plotWidth;
        const yScale = canvasHeight / plotHeight;

        setRect(rect);
        setXScale(xScale);
        setYScale(yScale);

        resizeImageData(imageData, canvasWidth, canvasHeight);
    }, [canvas, ctx, imageData]);

    const getCanvasEventPosition = (event) => {
        const x = Math.floor((Math.floor(event.clientX - rect.left)) / xScale);
        const y = Math.floor((Math.floor(event.clientY - rect.top)) / yScale);
        return { x, y }
    }

   const drawHighlight = (x, y) => {
       ctx.clearRect(0, 0, canvas.width, canvas.height);

       ctx.fillRect(x, y, 1, .1);
       ctx.fillRect(x, y, .1, 1);
       ctx.fillRect(x + 1, y, .1, 1);
       ctx.fillRect(x, y + 1, 1, .1);

       ctx.fill();
   }

   const drawPixel = (x, y, color) => {
       if (!mousePressed.current) return;
       ctx.fillStyle = color;
       ctx.rect(x, y, 1, 1);
       ctx.fill();
   }

    const handleMove = (event) => {
        const { x, y } = getCanvasEventPosition(event);

        drawHighlight(x, y);
        drawPixel(x, y, '#ff0000');
    }

    const handleMouseDown = (event) => {
        const { x, y } = getCanvasEventPosition(event);
        mousePressed.current = true;
        drawPixel(x, y, '#ff0000');
    };
    const handleMouseUp = () => mousePressed.current = false;
    const handleMouseLeave = () => mousePressed.current = false;

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

    if (canvasError || error) {
        return (
            <div className="wrapper">
                <h2 className={styles.oops}>Oops something goes wrong😔</h2>
            </div>
        );
    }

    return (
        <div className="wrapper">
            {isFetching || isLoading ? (
              <div>
                <h2 className={styles.oops}>Loading...</h2>
              </div>
            ) : (
              <div className={styles.canvasContainer}>
                  <canvas
                    // onClick={handleClick}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMove}
                    onMouseLeave={handleMouseLeave}
                    ref={canvasRef}
                    className={styles.canvas}
                  />
              </div>
            )}
        </div>
    )
};
