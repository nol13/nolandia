import React from 'react';
import classnames from "classnames";

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
                {isAuth ? (
                    <button className="standard-btn" onClick={logout}>Logout</button>
                ) : (
                    <button className="standard-btn" onClick={login}>Connect Wallet</button>
                )}
            </div>
        </header>
    )
}

export default Header;
