import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";

import Home from "../Home/Home.tsx";
import BuyPlot from "../MintPlot/MintPlot.tsx";
import YourPlots from "../ListPlots/ListPlots";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home></Home>} />
        <Route path="/BuyPlot" element={<BuyPlot></BuyPlot>} />
        <Route path="/YourPlots" element={<YourPlots></YourPlots>} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
