import React, { useState, useRef, useEffect, useMemo, useContext } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import NolandiaAbi from '../../contracts/Nolandia.json';
import contractAddress from "../../contracts/contract-address.json";
import { useParams } from "react-router-dom";
import useCanvas from '../../hooks/useCanvas'

import styles from './DrawPixels.module.scss';
import { PlotDataContext } from "../App/App";

const LEFT_MOUSE_BUTTON = 1;
const RIGHT_MOUSE_BUTTON = 3;
const DRAW_TOOL = 'draw';
const ERASE_TOOL = 'erase';
const LIST_TOOLS = [DRAW_TOOL, ERASE_TOOL];

const DEFAULT_COLOR = '#000000';
const DEFAULT_COLOR_HIGHLIGHT = '#7B3FE4';

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
    const [color, setColor] = useState(DEFAULT_COLOR);
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
    const mousePosition = useRef({ x: 0, y: 0 });
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

    const checkIfCanvasAndCtxAreReady = () => ctx && canvas;

    const setCurrentEventPosition = (event) => {
        if (!rect) return;
        const x = Math.floor((Math.floor(event.clientX - rect.left)) / xScale);
        const y = Math.floor((Math.floor(event.clientY - rect.top)) / yScale);
        mousePosition.current = { x, y };
    }

    const checkMouseButton = (event) => {
        const { which } = event.nativeEvent;
        let tool = DRAW_TOOL;

        if (which === RIGHT_MOUSE_BUTTON) {
            tool = ERASE_TOOL;
        }
        return tool;
    }

   const drawHighlight = () => {
        if (!checkIfCanvasAndCtxAreReady()) return;
       // const { x, y } = mousePosition.current;
       // ctx.beginPath();
       // ctx.fillStyle = DEFAULT_COLOR_HIGHLIGHT;
       // ctx.fillRect(x, y, 1, .1);
       // ctx.fillRect(x, y, .1, 1);
       // ctx.fillRect(x + 1, y, .1, 1);
       // ctx.fillRect(x, y + 1, 1, .1);
   }

   const drawTool = () => {
       if (!checkIfCanvasAndCtxAreReady()) return;
       const { x, y } = mousePosition.current;
       ctx.beginPath();
       ctx.fillStyle = color;
       ctx.rect(x, y, 1, 1);
       ctx.fill();
   }

   const eraseTool = () => {
       if (!checkIfCanvasAndCtxAreReady()) return;
       const { x, y } = mousePosition.current;
       ctx.clearRect(x, y, 1, 1);
   }

   const handleCurrentTool = (tool) => {
       if (!mousePressed.current) return;

       if (tool === DRAW_TOOL) {
           drawTool();
           return;
       }

       if (tool === ERASE_TOOL) {
           eraseTool();
           return;
       }
   }

    const handleMove = (event) => {
        setCurrentEventPosition(event);
        const tool = checkMouseButton(event);

        drawHighlight();
        handleCurrentTool(tool);
    }

    const handleMouseDown = (event) => {
        setCurrentEventPosition(event);
        const tool = checkMouseButton(event);

        mousePressed.current = true;
        handleCurrentTool(tool);
    };
    const handleMouseUp = () => {
        mousePressed.current = false;

    };
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
                    onContextMenu={(e) => e.preventDefault()}
                    ref={canvasRef}
                    className={styles.canvas}
                  />
              </div>
            )}
        </div>
    )
};
