import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { Dapp } from "./components/Dapp.tsx";


// Make sure that an instance is awoken before sending more
// requests or else it will wake multiple instances
const WokeDapp = () => {
  const [woke, setWoke] = useState(false);
  const [errorWaking, setWakingError] = useState(false);
  const [checkTimeout, setCheckTimeout] = useState(false);
  useEffect(() => {
    const checkWoke = async () => {
      // eslint-disable-next-line no-undef
      setTimeout(() => {
        setCheckTimeout(true);
      }, 350)
      try {
        // eslint-disable-next-line no-undef
        await fetch(`${process.env.REACT_APP_SERVER_URL}/checkwoke`);
        setWoke(true);
      } catch {
        setWakingError(true);
      }
    }
    checkWoke();
  }, []);

  if (errorWaking) return <div>error waking server</div>;
  else if (!woke && !checkTimeout) return "";
  else if (!woke) return <h3>Waking server, please wait..</h3>;
  else return <Dapp />
}

// eslint-disable-next-line no-undef
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <WokeDapp />
  </React.StrictMode>,
);
