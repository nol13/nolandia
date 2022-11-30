
import React, { useEffect, useMemo } from "react";
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

export const PlotDataContext = React.createContext<PlotDataContextType>({ mintError: null, pixelError: null });

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
    const {
        Moralis,
        isWeb3Enabled,
        enableWeb3,
        isAuthenticated,
        isWeb3EnableLoading,
        user,
        authenticate,
        logout,
        account
    } = useMoralis();
    const { chain } = useChain();

    // const [authError, setAuthError] = useState<string>();
    // const [isAuthenticating, setIsAuthenticating] = useState(false);
    const prefix = process.env.REACT_APP_DATA_PREFIX ? process.env.REACT_APP_DATA_PREFIX : '';
    const { data: mintData, error: mintError, isLoading: mintsLoading } = useMoralisQuery(prefix + "Mints3", q => q, [], { live: true });
    const { data: pixelData, error: pixelError, isLoading: pixelsLoading } = useMoralisQuery(prefix + "PlotData", q => q, [], { live: true });

    useEffect(() => {
        if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) enableWeb3();
    }, [enableWeb3, isAuthenticated, isWeb3EnableLoading, isWeb3Enabled]);

    useEffect(() => {
        if (account && user && account !== user?.get("ethAddress")) {
            logout?.();
        }
    }, [account, logout, user])

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
        if (!mappedPlotData?.length || !mappedPixelData?.length) return defaultImgData;
        return getPlotImageData(Object.values(combinedProcessedData));
    }, [combinedProcessedData, mappedPixelData, mappedPlotData]);

    const ready = isAuthenticated && chain?.shortName === process.env.REACT_APP_NETWORK_SHORT_NAME;

    const handleAuth = async (provider: Moralis.Web3ProviderType) => {
        try {
            // setAuthError(undefined);
            // setIsAuthenticating(true);

            // Enable web3 to get user address and chain
            await enableWeb3({ throwOnError: true, provider });
            const { account, chainId } = Moralis;

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
            // setAuthError("auth error");
        } finally {
            //setIsAuthenticating(false);
        }
    };

    const logOut = async () => {
        await logout();
    }

    return (
        <div className="App">
            <PlotDataContext.Provider value={{
                mintData,
                pixelData,
                imageData,
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
