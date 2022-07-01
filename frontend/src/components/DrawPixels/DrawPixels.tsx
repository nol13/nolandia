import { useState } from "react";
import { useWeb3Contract } from "react-moralis";
import NolandiaAbi from '../../contracts/Nolandia.json';
import contractAddress from "../../contracts/contract-address.json";


export const DrawPixels = () => {
    const [plotId, setPlotId] = useState<string | undefined>();
    const { data, error, runContractFunction, isFetching, isLoading } =
        useWeb3Contract({
            abi: NolandiaAbi.abi,
            contractAddress: contractAddress.Nolandia,
            functionName: "setPixels"
        });


    const draw = () => {
        const pixels = Array<number>(256);
        pixels.fill(169);
        runContractFunction({ params: {params: { pixels, plotId }} });
    };

    return (
        <div style={{ padding: '10px', border: '1px solid black' }}>
            <h1>Draw on plot with default pixels</h1>
            <div>plot to draw: <input value={plotId} onChange={e => setPlotId(e.target.value)} /></div>
            <div><button disabled={isFetching || isLoading} onClick={() => draw()}>Draw some pixels!</button></div>
            <div>data: {JSON.stringify(data)}</div>
            <div>draw error: {JSON.stringify(error)}</div>
        </div>
    )
};