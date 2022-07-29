import React from 'react';
import classnames from "classnames";
import {Link} from "react-router-dom";

import styles from './Header.module.scss';

const Header = ({
    login = () => {},
    logout = () => {},
    isAuth = false,
}) => {

    return (
        <header className={styles.header}>
            <div className={classnames("wrapper", styles.container)}>
                <h1><a href="/" className={styles.logo}>nolandia</a></h1>
                {isAuth ? (<div>
                        <Link className={styles.headerLink} to={`/`}>Home</Link>
                        <Link className={styles.headerLink} to={`/myplots`}>My Plots</Link>
                        <Link className={styles.headerLink} to={`/buyplot`}>Purchase Plot</Link>
                        <button className="standard-btn" onClick={logout}>Logout</button>
                    </div>
                ) : (
                    <button className="standard-btn" onClick={login}>Connect Wallet</button>
                )}
            </div>
        </header>
    )
}

export default Header;
