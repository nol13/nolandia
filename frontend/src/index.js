import React from "react";
import ReactDOM from "react-dom/client";
import { Dapp } from "./components/Dapp.tsx";

// eslint-disable-next-line no-undef
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Dapp />
  </React.StrictMode>,
);
