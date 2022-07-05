import React, { useMemo } from "react";
import { useMoralisQuery } from "react-moralis";
import { combineAndProcessPlotData, getPlotImageData } from "../../utils/imageDataUtils";

const defaultImgData: object[] = [];

export const ListPlots = () => {
    const { data, error, isLoading } = useMoralisQuery("Mints3");
    const { data: pixData, error: pixError, isLoading: pixIsLoading } = useMoralisQuery("PixelsSet");


    const mappedData = useMemo(() => {
        if (!data) return;
        return data.map(d => ({
            plotId: d.get("plotId"),
            x1: d.get("x1"),
            y1: d.get("y1"),
            x2: d.get("x2"),
            y2: d.get("y2")
        }));
    }, [data]);

    const mappedPixData = useMemo(() => {
        if (!pixData) return;
        return pixData.map(p => ({ plotId: p.get("plotId"), imageData: p.get("imageData") }));
    }, [pixData]);

    const imageData = useMemo(() => {
        if (!mappedData || !mappedPixData) return defaultImgData;
        const combined = combineAndProcessPlotData(mappedData, mappedPixData);
        return getPlotImageData(Object.values(combined));
    }, [mappedPixData, mappedData]);



    if (error || pixError) {
        return <span>🤯</span>;
    }

    if (isLoading || pixIsLoading) {
        return <span>🙄</span>;
    }

    return (
        <div style={{ padding: "10px", border: "1px solid green", margin: "10px" }}>
            <h1>Purchased Plots</h1>
            {data.map(plot => {
                return (
                    <div key={plot.get("plotId")} style={{ padding: "10px", border: "1px solid green", margin: "10px" }}>
                        <div>Plot ID: {plot.get("plotId")}</div>
                        <div>Owner: {plot.get("plotOwner")}</div>
                        <div>x1: {plot.get("x1")}, y1: {plot.get("y1")}, x2: {plot.get("x2")}, y2: {plot.get("y2")} </div>
                    </div>
                );
            })}
            <h1>Image Data Set</h1>
            {pixData.map(plot => {
                return (
                    <div key={plot.get("plotId")} style={{ padding: "10px", border: "1px solid blue", margin: "10px" }}>
                        <div>Plot ID: {plot.get("plotId")}</div>
                        <div>Data: {plot.get("imageData")}</div>
                    </div>
                );
            })}
            <div style={{ padding: "10px", border: "1px solid green", margin: "10px", maxWidth: '100%' }}>{imageData.toString()}</div>
        </div>);
};