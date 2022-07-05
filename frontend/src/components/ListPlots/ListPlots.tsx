import React, { useContext } from "react";
import { PlotDataContext, PlotDataContextType } from "../App/App";



export const ListPlots = () => {
    const {
        mintData,
        pixelData,
        imageData,
        mintError,
        mintsLoading,
        pixelError,
        pixelsLoading,
        //combinedProcessedData
    } = useContext<PlotDataContextType>(PlotDataContext);




    if (mintError || pixelError) {
        return <span>🤯</span>;
    }

    if (mintsLoading || pixelsLoading) {
        return <span>🙄</span>;
    }

    return (
        <div style={{ padding: "10px", border: "1px solid green", margin: "10px" }}>
            <h1>Purchased Plots</h1>
            {mintData?.map(plot => {
                return (
                    <div key={plot.get("plotId")} style={{ padding: "10px", border: "1px solid green", margin: "10px" }}>
                        <div>Plot ID: {plot.get("plotId")}</div>
                        <div>Owner: {plot.get("plotOwner")}</div>
                        <div>x1: {plot.get("x1")}, y1: {plot.get("y1")}, x2: {plot.get("x2")}, y2: {plot.get("y2")} </div>
                    </div>
                );
            })}
            <h1>Image Data Set</h1>
            {pixelData?.map(plot => {
                return (
                    <div key={plot.get("plotId")} style={{ padding: "10px", border: "1px solid blue", margin: "10px" }}>
                        <div>Plot ID: {plot.get("plotId")}</div>
                        <div>Data: {plot.get("imageData")}</div>
                    </div>
                );
            })}
            <div style={{ padding: "10px", border: "1px solid green", margin: "10px", maxWidth: '100%' }}>{imageData?.toString()}</div>
        </div>);
};