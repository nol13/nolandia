import React, { useState, useEffect, useRef } from 'react';
import paper from 'paper'

function useCanvas() {
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!image) return;

    const raster = new paper.Raster({
      canvas: canvasRef.current,
      size: {
        width,
        height
      }
    });

    const ctxImageData = raster.createImageData(new paper.Size(width, height));
    const length = ctxImageData?.data?.length || 0;

    for (let i = 0; i < length - 4; i += 4) {
      if (image) {
        ctxImageData.data[i + 0] = image[i + 0];
        ctxImageData.data[i + 1] = image[i + 1];
        ctxImageData.data[i + 2] = image[i + 2];
        ctxImageData.data[i + 3] = image[i + 3];
      }
    }

    raster.setImageData(ctxImageData, new paper.Point(0, 0));
  }, [image]);

  const initImage = (imageData, width, height) => {
    setWidth(width);
    setHeight(height);
    setImage(imageData);
  }

  return { canvasRef, initImage, error };
}

export default useCanvas;
