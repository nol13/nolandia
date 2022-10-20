
import React, { useEffect, useMemo, useState } from "react";
import { useMoralis, useChain, useMoralisQuery /* , useMoralisCloudFunction */ } from "react-moralis";
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
    const { Moralis, isWeb3Enabled, enableWeb3, isAuthenticated, isWeb3EnableLoading, /* logout, /*isAuthenticating,*/ authenticate, logout } = useMoralis();
    const { chain } = useChain();

    const [authError, setAuthError] = useState<string>();
    // const [isAuthenticating, setIsAuthenticating] = useState(false);
    const { data: mintData, error: mintError, isLoading: mintsLoading } = useMoralisQuery("Mints3", q => q, [], {live: true});
    const { data: pixelData, error: pixelError, isLoading: pixelsLoading } = useMoralisQuery("PlotData", q => q, [], {live: true});

    useEffect(() => {
        if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) enableWeb3();
    }, [enableWeb3, isAuthenticated, isWeb3EnableLoading, isWeb3Enabled]);

    const mappedPlotData = useMemo(() => {
        if (!mintData) return;
        return mintData.map(d => ({
            plotId: d.get("plotId_string"),
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
    }, [combinedProcessedData, mappedPixelData, mappedPlotData]);

    const ready = isAuthenticated && chain?.shortName === "maticmum";

    const handleAuth = async (provider: Moralis.Web3ProviderType) => {
        try {
            setAuthError(undefined);
            //setIsAuthenticating(true);

            // Enable web3 to get user address and chain
            await enableWeb3({ throwOnError: true, provider });
            const { account, chainId } = Moralis;

            // console.log({account, chainId})

            if (!account) {
                throw new Error('Connecting to chain failed, as no connected account was found');
            }
            if (!chainId) {
                throw new Error('Connecting to chain failed, as no connected chain was found');
            }

            // Get message to sign from the auth api
            const { message } = await Moralis.Cloud.run('requestMessage', {
                address: account,
                chain: parseInt(chainId, 16),
                network: 'evm',
            });

            // Authenticate and login via parse
            await authenticate({
                signingMessage: message,
                throwOnError: true,
            });
        } catch (error) {
            setAuthError("auth error");
        } finally {
            //setIsAuthenticating(false);
        }
    };

    /* const login = async () => {
        if (!isAuthenticated && !isAuthenticating) {
            try {
                await authenticate({ signingMessage: "Log into nolandia!" })
            } catch (error) {
                console.log(1, error);
            }
        }
    } */

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
                    <Header login={() => handleAuth("metamask")} logout={logOut} isAuth={isAuthenticated} />
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
