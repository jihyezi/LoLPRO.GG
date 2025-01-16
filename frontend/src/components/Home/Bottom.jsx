import React from "react";
import styles from "./Bottom.module.css";

import logo from "../../assets/Home/logo.png";
import git from "../../assets/Home/git.png";

const Bottom = () => {
    return (
        <div className={styles.bottomContainer}>
            <div className={styles.projectInfo}>
                <div className={styles.logoContainer}>
                    <img src={logo} className={styles.logoimg} />
                    <span className={styles.logotext}>LoLPRO.GG</span>
                </div>
                <span className={styles.description}>© 2025 LCK Project.</span>
            </div>
            <div className={styles.gitContainer}>
                <a href="https://github.com/jihyezi/LoLPRO.GG">
                    <img src={git} className={styles.gitImg} />
                </a>
            </div>
        </div>
    )
}

export default Bottom;