import React, { useState, useCallback, useRef } from 'react';

function useCanvas() {
  const [error, setError] = useState(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [canvas, setCanvas] = useState(null);
  const [ctx, setCtx] = useState(null);
  const [imageData, setImageData] = useState(null);
  const canvasRef = useRef(null);

  const initCanvas = (width, height, imageData) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    setCanvas(canvas);
    setWidth(width);
    setHeight(height);
    setCtx(ctx);

    if (imageData) {
      setImage(imageData, ctx, width, height);
    }
  }

  const setImage = useCallback((
    localImageData = [],
    ctx = ctx,
    width = width,
    height = height
  ) => {
    if (!ctx || !width || !height) {
      setError({ message: 'Not passed all required args' });
      return;
    }

    const ctxImageData = ctx.createImageData(width, height);
    const length = ctxImageData?.data?.length || 0;
    const whiteColor = 0;

    for (let i = 0; i < length - 4; i += 4) {
      ctxImageData.data[i] = localImageData[i] || whiteColor;
      ctxImageData.data[i + 1] = localImageData[i + 1] || whiteColor;
      ctxImageData.data[i + 2] = localImageData[i + 2] || whiteColor;
      ctxImageData.data[i + 3] = localImageData[i + 3] || 255;
    }

    ctx.putImageData(ctxImageData, 0, 0);
    setImageData(ctxImageData);
  }, [ctx, width, height]);

  return {
    error,
    canvasRef,
    canvas,
    plotWidth: width,
    plotHeight: height,
    ctx,
    imageData,
    initCanvas,
    setImage
  };
}

export default useCanvas;
