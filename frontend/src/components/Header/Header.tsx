import React from "react";
import classnames from "classnames";
import Navigation from "../Navigation/NavigationBar";
import { Link } from "react-router-dom";

import styles from "./Header.module.scss";

const Header = ({ login = () => {}, logout = () => {}, isAuth = false }) => {
  return (
    <header className={styles.header}>
      <div className={classnames("wrapper", styles.container)}>
        <h1>
          <a href="/" className={styles.logo}>
            <span className={styles.letter}>n</span>olandia
          </a>
        </h1>
        {isAuth ? (
          <div>
            <Link className={styles.headerLink} to={`/`}>
              Home
            </Link>
            <Link className={styles.headerLink} to={`/myplots`}>
              My Plots
            </Link>
            <Link className={styles.headerLink} to={`/buyplot`}>
              Purchase Plot
            </Link>
            <button className="standard-btn" onClick={logout}>
              Logout
            </button>
          </div>
        ) : (
          <button className="standard-btn" onClick={login}>
            Connect Wallet
          </button>
        )}
      </div>
      {/* <img src={logo} className="App-Logo" alt="logo"></img> */}
      <a className="App-link" href="">
        Home
      </a>
      <a className="App-link" href="">
        Buy Plot
      </a>
      <a className="App-link" href="">
        Your Plots
      </a>

      <Navigation />
    </header>
  );
};

export default Header;
