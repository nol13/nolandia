import React, { useContext, useMemo } from "react";
import classnames from "classnames";
import { Link } from 'react-router-dom';
import { PlotDataContext, PlotDataContextType } from "../App/App";
import PlotItem from './PlotItem/PlotItem';
import { useMoralis } from "react-moralis";

import styles from './ListPlots.module.scss';

export const ListPlots = () => {
    const {
        mintData,
        mintError,
        mintsLoading,
        //pixelError,
        //pixelsLoading,
        combinedProcessedData
    } = useContext<PlotDataContextType>(PlotDataContext);

    const { user } = useMoralis();
    const address = user?.get("ethAddress");
    const myPlots = useMemo(() => mintData?.filter(plot => plot.get("plotOwner")?.toLowerCase() === address), [address, mintData]);


    if (mintError) {
        return <span>🤯</span>;
    }

    if (mintsLoading || !combinedProcessedData) {
        return <span>🙄</span>;
    }

    return (
        <div className={classnames('wrapper', styles.plots)}>
            <h1>My Plots</h1>
            <ul className={styles.plotsList}>
                {myPlots?.length ? (
                    myPlots?.map((plot) => (
                        <PlotItem
                            key={plot.get("plotId_string")}
                            plotId={plot.get("plotId_string")}
                            plotOwner={plot.get("plotOwner")}
                            x1={plot.get("x1")}
                            y1={plot.get("y1")}
                            x2={plot.get("x2")}
                            y2={plot.get("y2")}
                            sparkles = {plot.get('sparkles_string')}
                            resource = {plot.get('resources')}
                            landType = {plot.get('landType')}
                            megafaunaType = {plot.get('megafaunaType')}
                            imageData={combinedProcessedData?.[plot.get("plotId_string")].imageData}
                        />
                    ))
                ) : (
                    <li className={styles.emptyList}>
                        <h2>We couldn't find plots😔</h2>
                        <Link to="/buyplot" className={classnames("standard-btn", styles.buyBtn)}>Buy</Link>
                    </li>
                )}
            </ul>
        </div>
    );
};
