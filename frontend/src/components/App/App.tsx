import { Routes, Route, Link } from "react-router-dom";
import { Home } from "../Home/Home";
import { ListPlots } from "../ListPlots/ListPlots";
import { MintPlot } from "../MintPlot/MintPlot";
import { DrawPixels } from "../DrawPixels/DrawPixels";


export const App = () => {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="buyplot" element={<MintPlot />} />
                <Route path="yourplots" element={<ListPlots />} />
                <Route path="draw" element={<DrawPixels />} />
            </Routes>
        </div>
    );
};