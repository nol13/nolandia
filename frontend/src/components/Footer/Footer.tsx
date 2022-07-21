import React from 'react';

import styles from './Footer.module.scss';

const Footer = () => {

    return (
        <footer className={styles.footer}>
            <div className="wrapper">
                <p>Copyright &copy; 2022 Nolandia. All Rights Reserved</p>
            </div>
        </footer>
    )
}

export default Footer;
