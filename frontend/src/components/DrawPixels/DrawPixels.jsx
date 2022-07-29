import React, { useState, useRef, useEffect, useContext } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import NolandiaAbi from '../../contracts/Nolandia.json';
import contractAddress from "../../contracts/contract-address.json";
import PixelEditor from '@potch/pixeleditor/pixeleditor';
import { useParams } from "react-router-dom";

import styles from './DrawPixels.module.scss';
import {PlotDataContext} from "../App/App";

export const DrawPixels = () => {
    //const [plotId, setPlotId] = useState('');
    const { data, error, runContractFunction, isFetching, isLoading } =
        useWeb3Contract({
            abi: NolandiaAbi.abi,
            contractAddress: contractAddress.Nolandia,
            functionName: "setPixels"
        });

    const [numberOfPx, setNumberOfPx] = useState();

    const { isWeb3Enabled } = useMoralis();

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
            const x1=plot.x1; //get("x1")
            const y1=plot.y1
            const x2=plot.x2
            const y2=plot.y2

            // console.log({x1, x2, y1, y2})

            const height = (y2 - y1) * 8;
            const width = (x2 - x1) * 8;
            const minDim = Math.min(height, width);

            setNumberOfPx(height * width);


            const zoom = Math.floor(Math.max((minDim / 8) * 2));

            //console.log({x1, x2, y1, y2, zoom, height, width})

            pixEditorRef.current = new PixelEditor({
                width,
                height,
                zoom: 16,
                container: canvasRef.current
            });
        }
    }, [plotId]);




    const draw = () => {
        if (!isWeb3Enabled) return;
        //const pixels = Array(14336).fill(199);

        const imageData = pixEditorRef.current?.toImageData();
        //console.log(imageData)
        if (imageData?.data?.length) {
            //console.log(imageData.data)
            runContractFunction({ params: { params: { pixels: Array.from(imageData.data), plotId }, msgValue: `` } });
        }
    };

    return (
        <div style={{ padding: '10px', border: '1px solid black' }}>
            <h1>Draw on plot with default pixels {plotId}</h1>
            <div>plot to draw: {plotId}, Total Px: {numberOfPx}</div>
            <div><button disabled={isFetching || isLoading} onClick={() => draw()}>Draw some pixels!</button></div>
            <div>data: {JSON.stringify(data)}</div>
            <div>draw error: {JSON.stringify(error)}</div>
            <div className={styles.canvasContainer} ref={canvasRef} />
        </div>
    )
};