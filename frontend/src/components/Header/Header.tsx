import React from 'react';
import classnames from "classnames";
import { Link } from "react-router-dom";

import styles from './Header.module.scss';

const Header = ({
    login = () => { },
    logout = () => { },
    isAuth = false,
}) => {

    return (
        <header className={styles.header}>
            <div className={classnames("wrapper", styles.container)}>
                <h1><a href="/" className={styles.logo}><span className={styles.letter}>n</span>olandia</a></h1>
                <div className={styles.rightSection}>
                    <div className={styles.linkContainer}>
                        <Link className={styles.headerLink} to={`/`}>Home</Link>
                        <Link className={classnames(styles.headerLink, !isAuth && styles.disabled)} to={isAuth ? `/myplots` : '#'}>
                            My Plots
                        </Link>
                        <Link className={classnames(styles.headerLink, !isAuth && styles.disabled)} to={isAuth ? `/buyplot` : '#'}>
                            Purchase Plot
                        </Link>
                    </div>
                    <div className={styles.buttonContainer}>
                        {isAuth ?
                            <button className="standard-btn" onClick={logout}>Logout</button> :
                            <button className="standard-btn" onClick={login}>Connect to Metamask</button>
                        }
                    </div>
                </div>

            </div>
            <div className={styles.linkContainerMobile}>
                <Link className={styles.headerLink} to={`/`}>Home</Link>
                <Link className={classnames(styles.headerLink, !isAuth && styles.disabled)} to={isAuth ? `/myplots` : '#'}>
                    My Plots
                </Link>
                <Link className={classnames(styles.headerLink, !isAuth && styles.disabled)} to={isAuth ? `/buyplot` : '#'}>
                    Purchase Plot
                </Link>
            </div>
        </header>
    )
}

export default Header;
