
import React, { useEffect, useState } from "react";
import { useMoralis, useChain } from "react-moralis";
import { Routes, Route } from "react-router-dom";
import { Home } from "../Home/Home";
import { ListPlots } from "../ListPlots/ListPlots";
import { MintPlot } from "../MintPlot/MintPlot";
import { DrawPixels } from "../DrawPixels/DrawPixels";



export const App = () => {
    const { isWeb3Enabled, enableWeb3, isAuthenticated, isWeb3EnableLoading } = useMoralis();
    const { chain } = useChain();

    useEffect(() => {
        if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) enableWeb3();
    }, [isAuthenticated, isWeb3Enabled]);

    const ready = isAuthenticated && chain?.shortName === "maticmum";

    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Home />} />
                {ready && (<>
                    <Route path="buyplot" element={<MintPlot />} />
                    <Route path="yourplots" element={<ListPlots />} />
                    <Route path="draw" element={<DrawPixels />} />
                </>
                )}
                <Route path="*" element={<Home />} />

            </Routes>
        </div>
    );
};