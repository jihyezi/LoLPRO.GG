import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "./Header.module.css"

import logo from "../../assets/Home/logo.png"
import profile from "../../assets/Home/profile.png"

const Header = () => {
    const location = useLocation();
    const [selectedMenu, setSelcetedMenu] = useState("홈");

    const menuItems = [
        { name: "홈", href: "/" },
        { name: "일정", href: "/" },
        { name: "순위", href: "/" },
        { name: "승부예측", href: "/prediction" },
    ];

    useEffect(() => {
        const currentMenu = menuItems.find(item => item.href === location.pathname);
        if (currentMenu) {
            setSelcetedMenu(currentMenu.name);
        }
    }, [location.pathname])

    return (
        <div className={styles.headerContainer}>
            <div className={styles.logoContainer}>
                <img src={logo} className={styles.logoimg} />
                <p className={styles.logotext}>LoLPRO.GG</p>
            </div>
            <div>
                <ul className={styles.menuList}>
                    {menuItems.map((item, index) => (
                        <li key={index}>
                            <a
                                href={item.href}
                                className={styles.menutext}
                                data-selected={selectedMenu === item.name ? "true" : "false"}>
                                <span>{item.name}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
            <div className={styles.profileContainer}>
                <img src={profile} className={styles.profileimg} />
            </div>
        </div>
    )
}

export default Header;