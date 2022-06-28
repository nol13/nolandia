import { useState } from "react";
//import { useWeb3Contract } from "react-moralis";
//0x4A5B2494CBae765766684dC7F58fF381f2C756B4


export const MintPlot = () => {
    const mint = () => {};
    const [x1, setX1] = useState<string>();
    const [y1, setY1] = useState<string>();
    const [x2, setX2] = useState<string>();
    const [y2, setY2] = useState<string>();
    return (
        <div>
            <h1>Mint New Plot</h1>
            <div>x1: <input value={x1} onChange={e => setX1(e.target.value)} /></div>
            <div>y1: <input value={y1} onChange={e => setY1(e.target.value)} /></div>
            <div>x2: <input value={x2} onChange={e => setX2(e.target.value)} /></div>
            <div>x2: <input value={y2} onChange={e => setY2(e.target.value)} /></div>
            <div><button onClick={mint}>Mint!</button></div>
        </div>
    )
};