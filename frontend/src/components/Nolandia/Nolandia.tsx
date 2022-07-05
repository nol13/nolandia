import React, {useContext, useMemo, useRef} from 'react';
import { PlotDataContextType, PlotDataContext } from '../App/App';

export const Nolandia = () => {
    const { imageData } = useContext<PlotDataContextType>(PlotDataContext);
    const nolandiaRef = useRef<HTMLCanvasElement>(null);

    const img = useMemo(() => {
        if (!imageData?.length || !nolandiaRef.current) return;
        const canvas = nolandiaRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx === null) return;
        const ctxImageData = ctx.createImageData(1024, 1024);
        //ctxImageData.data = Uint8ClampedArray.from(imageData)
        const length = ctxImageData?.data?.length || 0;
        console.log(length)
        for (let i = 0; i < length; i += 4) {
            ctxImageData.data[i + 0] = imageData[i + 0];
            ctxImageData.data[i + 1] = imageData[i + 1];
            ctxImageData.data[i + 2] = imageData[i + 2];
            ctxImageData.data[i + 3] = imageData[i + 3];
            
        }
        ctx.putImageData(ctxImageData, 0, 0);


    }, [imageData])

    if (!imageData?.length) return (<div>Loading Nolandia...</div>);
    return (
    <div style={{border: '1px solid black', display: 'inline-block'}}>
        <div>Nolandia!</div>
        <hr />
        {!imageData?.length && (<div>Loading Nolandia...</div>)}
        <canvas style={{width: "1024px", height: "1024px"}} ref={nolandiaRef} id="nolandiaCanvas"/>
        </div>)

}