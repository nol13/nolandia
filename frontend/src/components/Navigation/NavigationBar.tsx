import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";

import { Home } from "../Home/Home";
import { MintPlot } from "../MintPlot/MintPlot";
import { ListPlots } from "../ListPlots/ListPlots";

function NavigationBar() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home></Home>} />
        <Route path="/BuyPlot" element={<MintPlot></MintPlot>} />
        <Route path="/MyPlots" element={<ListPlots></ListPlots>} />
      </Routes>
    </BrowserRouter>
  );
}

export default NavigationBar;
