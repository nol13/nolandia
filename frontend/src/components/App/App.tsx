
import React, { useEffect, useMemo } from "react";
import { useMoralis, useChain, useMoralisQuery, useMoralisCloudFunction } from "react-moralis";
import type { Moralis } from 'moralis';
import { Routes, Route } from "react-router-dom";
import { Home } from "../Home/Home";
import { ListPlots } from "../ListPlots/ListPlots";
import { MintPlot } from "../MintPlot/MintPlot";
import { DrawPixels } from "../DrawPixels/DrawPixels";
import { combineAndProcessPlotData, combinedPlotData, getPlotImageData, plot, plotImgData } from "../../utils/imageDataUtils";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";

export const PlotDataContext = React.createContext<PlotDataContextType>({mintError: null, pixelError: null});

const defaultImgData: number[] = [];

export interface PlotDataContextType {
    mintData?: Moralis.Object<Moralis.Attributes>[],
    pixelData?: Moralis.Object<Moralis.Attributes>[],
    imageData?: number[],
    mappedPixelData?: plotImgData[],
    mappedPlotData?: plot[],
    mintError: Error | null,
    mintsLoading?: boolean,
    pixelError: Error | null,
    pixelsLoading?: boolean,
    combinedProcessedData?: combinedPlotData
}

export const App = () => {
    const { isWeb3Enabled, enableWeb3, isAuthenticated, isWeb3EnableLoading, logout, isAuthenticating, authenticate } = useMoralis();
    const { chain } = useChain();

    const { data: mintData, error: mintError, isLoading: mintsLoading } = useMoralisQuery("Mints3");
    const { data: pixelData, error: pixelError, isLoading: pixelsLoading } = useMoralisQuery("PlotData");

    useEffect(() => {
        if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) enableWeb3();
    }, [isAuthenticated, isWeb3Enabled]);

    const mappedPlotData = useMemo(() => {
        if (!mintData) return;
        return mintData.map(d => ({
            plotId: d.get("plotId"),
            x1: d.get("x1"),
            y1: d.get("y1"),
            x2: d.get("x2"),
            y2: d.get("y2")
        }));
    }, [mintData]);

    const mappedPixelData = useMemo(() => {
        if (!pixelData) return;
        return pixelData.map(p => ({ plotId: p.get("plotId"), imageData: p.get("imageData"), updatedTime: p.get("updatedAt")?.getTime }));
    }, [pixelData]);

    const combinedProcessedData = useMemo(() => {
        if (!mappedPlotData || !mappedPixelData) return {};
        return combineAndProcessPlotData(mappedPlotData, mappedPixelData);
    }, [mappedPixelData, mappedPlotData]);

    const imageData = useMemo(() => {
        if (!mappedPlotData || !mappedPixelData) return defaultImgData;
        return getPlotImageData(Object.values(combinedProcessedData));
    }, [combinedProcessedData]);

    const ready = isAuthenticated && chain?.shortName === "maticmum";

    const login = async () => {
        if (!isAuthenticated && !isAuthenticating) {
            try {
                await authenticate({ signingMessage: "Log into nolandia!" })
            } catch (error) {
                console.log(error);
            }
        }
    }

    const logOut = async () => {
        await logout();
    }

    return (
        <div className="App">
            <PlotDataContext.Provider value={{
                mintData,
                pixelData,
                imageData,
                //mappedPixelData,
                mappedPlotData,
                mintError,
                mintsLoading,
                pixelError,
                pixelsLoading,
                combinedProcessedData
                }}>
                <div className="container">
                    <Header login={login} logout={logOut} isAuth={isAuthenticated || isAuthenticating} />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        {ready && (<>
                            <Route path="buyplot" element={<MintPlot />} />
                            <Route path="myplots" element={<ListPlots />} />
                                <Route path="draw" element={<DrawPixels />}>
                                    <Route path=":plotId" element={<DrawPixels />} />
                                </Route>
                        </>
                        )}
                        <Route path="*" element={<Home />} />
                    </Routes>
                </div>
                <Footer />
            </PlotDataContext.Provider>
        </div>
    );
};
