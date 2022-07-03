import { useMoralisQuery } from "react-moralis";

export const ListPlots = () => {
    const { data, error, isLoading } = useMoralisQuery("Mints3");
    const { data: pixData, error: pixError, isLoading: pixIsLoading } = useMoralisQuery("PixelsSet");

    if (error || pixError) {
        return <span>🤯</span>;
    }

    if (isLoading || pixIsLoading) {
        return <span>🙄</span>;
    }

    return (
        <div style={{ padding: "10px", border: "1px solid green", margin: "10px" }}>
            <h1>Purchased Plots</h1>
            {data.map(plot => {
                return (
                    <div key={plot.get("plotId")} style={{ padding: "10px", border: "1px solid green", margin: "10px" }}>
                        <div>Plot ID: {plot.get("plotId")}</div>
                        <div>Owner: {plot.get("plotOwner")}</div>
                        <div>x1: {plot.get("x1")}, y1: {plot.get("y1")}, x2: {plot.get("x2")}, y2: {plot.get("y2")} </div>
                    </div>
                );
            })}
            <h1>Image Data Set</h1>
            {pixData.map(plot => {
                return (
                    <div key={plot.get("plotId")} style={{ padding: "10px", border: "1px solid blue", margin: "10px" }}>
                        <div>Plot ID: {plot.get("plotId")}</div>
                        <div>Data: {plot.get("imageData")}</div>
                    </div>
                );
            })}
        </div>);
};