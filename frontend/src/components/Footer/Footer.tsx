import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import classnames from "classnames";
import styles from './Footer.module.scss';

const Footer = () => {
    const [closeState, setCloseState] = useState(false);

    const handleClose = (close: any) => {
        setCloseState(true);

        setTimeout(() => {
            close();
            setCloseState(false);
        }, 210);
    }

    return (
        <footer className={styles.footer}>
            <div className={classnames("wrapper", styles.footerContainer)}>
                <p className={styles.copyright}>Copyright &copy; 2022 Nolandia. All Rights Reserved</p>
                <Popup
                    modal
                    nested
                    onClose={() => setCloseState(false)}
                    position='center center'
                    trigger={<button type="button" onClick={() => setCloseState(false)} className={styles.rulesBtn}>Rules</button>
                }>
                    {/*// @ts-ignore*/}
                    {(close: any) => (
                        <button className={styles.rules} onClick={() => handleClose(close)}>
                            <div className={classnames(styles.rulesContent, {
                                [styles.animationClose]: closeState
                            })}>
                                <h2>Nolandia Rules</h2>
                                <ol className={styles.rulesList}>
                                    <li>The map of Nolandia is a 128 x 128 parcel grid. Each parcel measures 8px x 8px.</li>
                                    <li>Plots of Nolandian No-land can be purchased that contain one or more parcels.</li>
                                    <li>You may select any unowned section of Nolandia when purchasing a plot.</li>
                                    <li>Each 8px by 8px parcel costs 0.064 ether.</li>
                                    <li>After purchasing you will receive an NFT granting you ownership of your plot.</li>
                                    <li>After purchasing, you may draw anything you want on plots that you own.</li>
                                    <li>Each plot gets sparkles, resources, megafauna, and land type psuedo-randomly generated at mint time. These have no use now but could eventually have great value.</li>
                                </ol>
                            </div>
                        </button>
                    )}
                </Popup>
            </div>
        </footer>
    )
}

export default Footer;
