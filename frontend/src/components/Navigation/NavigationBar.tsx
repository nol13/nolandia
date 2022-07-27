import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";

import Home from "../Home/Home";
import BuyPlot from "../MintPlot/MintPlot";
import YourPlots from "../ListPlots/ListPlots";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

function NavigationBar() {
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

export default NavigationBar;
