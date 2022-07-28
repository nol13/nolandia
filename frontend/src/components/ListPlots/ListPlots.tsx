import React, {useContext} from "react";
import classnames from "classnames";
import {PlotDataContext, PlotDataContextType} from "../App/App";
import PlotItem from './PlotItem/PlotItem';

import styles from './ListPlots.module.scss';

export const ListPlots = () => {
    const {
        mintData,
        mintError,
        mintsLoading,
        pixelError,
        pixelsLoading,
        combinedProcessedData
    } = useContext<PlotDataContextType>(PlotDataContext);

    if (mintError || pixelError) {
        return <span>🤯</span>;
    }

    if (mintsLoading || pixelsLoading || !combinedProcessedData) {
        return <span>🙄</span>;
    }
    return (
        <div className={classnames('wrapper', styles.plots)}>
            <h1>My Plots</h1>
            <ul className={styles.plotsList}>
                {mintData?.map((plot, idx) => (
                    <PlotItem
                        key={plot.get("plotId")}
                        plotId={plot.get("plotId")}
                        plotOwner={plot.get("plotOwner")}
                        x1={plot.get("x1")}
                        y1={plot.get("y1")}
                        x2={plot.get("x2")}
                        y2={plot.get("y2")}
                        // @ts-ignore
                        imageData={combinedProcessedData?.[plot.get("plotId")].imageData}
                    />
                ))}
            </ul>
        </div>
    );
};
