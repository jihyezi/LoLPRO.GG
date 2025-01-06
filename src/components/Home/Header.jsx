import React from "react";
import styles from "./Header.module.css"

import logo from "../../assets/Home/logo.png"
import profile from "../../assets/Home/profile.png"

const Header = () => {
    return (
        <div className={styles.HeaderContainer}>
            <div className={styles.LogoContainer}>
                <img src={logo} className={styles.logoimg} />
                <p className={styles.logotext}>LoLPRO.GG</p>
            </div>
            <div>
                <ul className={styles.menuList}>
                    <li>
                        <a>
                            <p className={styles.menutext}>홈</p>
                        </a>
                    </li>
                    <li>
                        <a>
                            <p className={styles.menutext}>일정</p>
                        </a>
                    </li>
                    <li>
                        <a>
                            <p className={styles.menutext}>순위</p>
                        </a>
                    </li>
                    <li>
                        <a>
                            <p className={styles.menutext}>승부예측</p>
                        </a>
                    </li>
                </ul>
            </div>
            <div className={styles.profileContainer}>
                <img src={profile} className={styles.profileimg} />
            </div>
        </div>
    )
}

export default Header;