import { useMoralisQuery } from "react-moralis";

export const ListPlots = () => {
    const { data, error, isLoading } = useMoralisQuery("Mints2");

    if (error) {
        return <span>🤯</span>;
    }

    if (isLoading) {
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
        </div>);


};