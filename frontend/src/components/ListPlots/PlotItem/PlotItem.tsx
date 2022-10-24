import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
// @ts-ignore
import useCanvas from '../../../hooks/useCanvas';

import styles from './PlotItem.module.scss';

type PlotItemProps = {
    plotId: string;
    plotOwner: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    sparkles: string,
    resource: string,
    landType: string,
    megafaunaType: string,
    imageData: number[] | undefined;
}

const PlotItem: React.FC<PlotItemProps> = ({
    plotId,
    plotOwner,
    x1,
    y1,
    x2,
    y2,
    sparkles,
    resource,
    landType,
    megafaunaType,
    imageData
}) => {
    //const { canvasRef, initImage, error } = useCanvas();
    const canvasWidth = useMemo(() => x2 - x1, [x1, x2]);
    const canvasHeight = useMemo(() => y2 - y1, [y1, y2]);

   /*  useEffect(() => {
        if (!imageData) return;
        initImage(imageData, canvasWidth, canvasHeight);
    }, []); */

    return (
        <li className={styles.plotItem}>
            <div>
                <ul>
                    <li>Plot ID: {plotId}</li>
                    <li>Owner: {plotOwner}</li>
                    <li>Coordinates: ({x1}, {y1}), ({x2}, {y2})</li>
                    <li>Size: {canvasWidth}x{canvasHeight}</li>
                </ul>
                <Link to={`/draw/${plotId}`} className={styles.drawBtn}>Draw</Link>
            </div>
            <div>
                <ul>
                    <li>Sparkles: {sparkles}</li>
                    <li>Resource: {resource}</li>
                    <li>Land Type: {landType}</li>
                    <li>Megafauna: {megafaunaType}</li>
                </ul>
                <Link to={`/draw/${plotId}`} className={styles.drawBtn}>Draw</Link>
            </div>
        </li>
    );
};

export default PlotItem;
