import React, { useState, useRef, useEffect, useContext } from "react";
import { useMoralisCloudFunction } from "react-moralis";
import PixelEditor from './pixeleditor';
import { useParams } from "react-router-dom";

import styles from './DrawPixels.module.scss';
import { PlotDataContext } from "../App/App";

const colors = [
    [255, 255, 255], // white
    [0, 0, 0],       // black
    [255, 0, 0],     // red
    [255, 255, 0],   // yellow
    [0, 255, 0],     // green
    [0, 255, 255],   // cyan
    [0, 0, 255],     // blue
    [24, 77, 255],     // blue
    [24, 77, 0],     // blue
    [102, 51, 0],     // brown
    [64, 64, 64],     // grey
    [204, 102, 0],     // orange
    [255, 0, 255],    // magenta
    [51, 0, 102],    // purple
    [151, 0, 0]    // dark red
];

export const DrawPixels = () => {
    const { fetch: drawPx, isLoading, isFetching } = useMoralisCloudFunction("SetDrawnPixels",);
    const [numberOfPx, setNumberOfPx] = useState();

    const pixEditorRef = useRef();
    const canvasRef = useRef();
    const { plotId } = useParams();

    const {
        combinedProcessedData
    } = useContext(PlotDataContext);

    useEffect(() => {
        if (pixEditorRef.current) return;
        const plot = combinedProcessedData[plotId];
        if (plot) {
            const x1 = plot.x1;
            const y1 = plot.y1;
            const x2 = plot.x2;
            const y2 = plot.y2;

            const height = (y2 - y1) * 8;
            const width = (x2 - x1) * 8;
            setNumberOfPx(height * width);

            const minDim = Math.min(height, width);
            const zoom = Math.floor(Math.max(18, (minDim / 8) * 2));

            pixEditorRef.current = new PixelEditor({
                width,
                height,
                zoom, //: 16,
                container: canvasRef.current,
                colors,
                currentColor: 1
            });
        }
    }, [plotId, combinedProcessedData]);




    const draw = () => {
        const imageData = pixEditorRef.current?.toImageData();
        if (imageData?.data?.length) {
            drawPx({ params: {
                plotId, imageData: Array.from(imageData.data),
                // eslint-disable-next-line no-undef
                prefix: process.env.REACT_APP_DATA_PREFIX,
                // eslint-disable-next-line no-undef
                chain: process.env.REACT_APP_NETWORK_ID
            } });
        }
    };

    const colorClicked = (idx) => {
        pixEditorRef.current?.setColor(idx);
    }

    return (
        <div className={styles.container}>
            <h1>Draw on plot #{plotId}</h1>
            <div>Total Px: {numberOfPx}</div>
            <div><button className={styles.drawButton} disabled={isFetching || isLoading} onClick={() => draw()}>Save Drawing!</button></div>
            <p>Colors:</p>
            {colors.map((color, idx) => (
                <button className={styles.colorBtn} onClick={() => colorClicked(idx)} style={{ background: `rgb(${color.join(', ')})` }} />
            ))}
            <div className={styles.canvasContainer} ref={canvasRef} />
        </div>
    )
};
