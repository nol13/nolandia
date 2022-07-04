const pxPerRow = 1024;
const valsPerPx = 4;

export interface plotImageDataDto {
    plotData: number[],
    rowStartingPositions: number[],
    plotWidthInPx: number
}

export interface plot {
    plotId: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    owner?: string
}
export interface plotImgData {
    plotId: number,
    imageData: number[]
}

export interface combinedPlot {
    plotId: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    owner?: string,
    imageData?: number[],
    plotWidthInPx: number,
    rowStartingPositions: number[]
}

export interface combinedPlotData {
    [key: string]: combinedPlot
}

const getArrayPos = (x: number, y: number): number => {
    const pxFromRowsAbove = pxPerRow * y;
    const pxFromSameRow = pxPerRow - (pxPerRow - x);
    return (pxFromRowsAbove + pxFromSameRow) * valsPerPx;
}

const getPositionsForRowStart = (x1: number, y1: number, x2: number, y2: number): Array<number> => {
    const startX = x1 * 8;
    const startY = y1 * 8;
    const height = (y2 - y1) * 8;
    const positions: number[] = [];

    for (let i = 0; i < height; i++) {
        positions[i] = getArrayPos(startX, startY + i)
    }

    return positions;
}

export const combineAndProcessPlotData = (plots: plot[], plotImageData: plotImgData[]) => {
    const plotData = plots.reduce((prev: combinedPlotData, cur: plot) => {
        const { plotId, x1, y1, x2, y2 } = cur;
        prev[plotId] = {
            plotId,
            x1,
            y1,
            x2,
            y2,
            plotWidthInPx: (x2 - x1) * 8,
            rowStartingPositions: getPositionsForRowStart(x1, y1, x2, y2)
        };
        return prev;
    }, {});

    for (const plotImgObj of plotImageData) {
        if (plotData[plotImgObj.plotId]) plotData[plotImgObj.plotId].imageData = plotImgObj.imageData;
    }

    return plotData;
};

export const getPlotImageData = (
    plots: combinedPlot[]
) => {
    const fullImageData: number[] = Array(pxPerRow * pxPerRow * valsPerPx).fill(0);

    for (let i = 0; i < plots.length; i++) {
        const { imageData, rowStartingPositions, plotWidthInPx } = plots[i];
        for (let j = 0; j < rowStartingPositions.length; j++) {
            const start1 = j * plotWidthInPx * valsPerPx;
            const end = (j + 1) * plotWidthInPx * valsPerPx;
            const row = imageData?.slice(start1, end) || [];
            const start = rowStartingPositions[j];
            fullImageData.splice(start, 0, ...row);
        }
    }
    return fullImageData;
};