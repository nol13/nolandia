import React, { useContext, useEffect, useRef } from 'react';
import paper from 'paper';

import { PlotDataContextType, PlotDataContext } from '../App/App';

import styles from './Nolandia.module.scss';

export const Nolandia = () => {
    const { imageData, mintsLoading, pixelsLoading } = useContext<PlotDataContextType>(PlotDataContext);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!imageData?.length || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        paper.setup(canvas);

        if (ctx === null) return;

        initCanvas(ctx);
    }, [imageData])

    function initCanvas(ctx: CanvasRenderingContext2D) {
        const tool = new paper.Tool();
        const raster = new paper.Raster({
            size: {
                width: 1024,
                height: 1024
            }
        });

        const ctxImageData = raster.createImageData(new paper.Size(1024, 1024));

        const length = ctxImageData?.data?.length || 0;
        for (let i = 0; i < length - 4; i += 4) {
            if (imageData) {
                ctxImageData.data[i] = imageData[i];
                ctxImageData.data[i + 1] = imageData[i + 1];
                ctxImageData.data[i + 2] = imageData[i + 2];
                ctxImageData.data[i + 3] = imageData[i + 3];
            }
        }
        raster.setImageData(ctxImageData, new paper.Point(0, 0));
        //raster.position = paper.view.center;
        //paper.view.zoom = 0.8;
        raster.fitBounds(paper.view.bounds)

        tool.onMouseDrag = function(event: any) {
            const pan_offset = event.point.subtract(event.downPoint);
            paper.view.center = paper.view.center.subtract(pan_offset);
        }
    }

    const resetZoom = () => {
        paper.view.zoom = 1;
    }

    const handleWheel = (event: React.WheelEvent) => {
        const oldZoom = paper.view.zoom;
        let newZoom = paper.view.zoom;

        if (event.deltaY < 0) {
            newZoom = paper.view.zoom * 1.05;
        } else {
            newZoom = paper.view.zoom * 0.95;
        }

        const beta = oldZoom / newZoom;
        const mousePosition = new paper.Point(event.nativeEvent.offsetX, event.nativeEvent.offsetY);

        const viewPosition = paper.view.viewToProject(mousePosition);

        const mpos = viewPosition;
        const ctr = paper.view.center;

        const pc = mpos.subtract(ctr);
        const offset = mpos.subtract(pc.multiply(beta)).subtract(ctr);

        paper.view.zoom = newZoom;
        paper.view.center = paper.view.center.add(offset);
    }

    //console.log(process.env.REACT_APP_DATA_PREFIX)

    // if (!imageData?.length) return (<div className={styles.loading}>Loading Nolandia Please Wait...</div>);
    if (mintsLoading || pixelsLoading) return (<div className={styles.loading}>Loading Nolandia Please Wait...</div>);

    return (
        <div>
            <button className={styles.resetButton} onClick={resetZoom}>Reset Zoom</button>
            <canvas data-paper-hidpi="off" data-paper-resize="true" onWheel={handleWheel} ref={canvasRef} id={styles.canvas} />
        </div>
    )

}
