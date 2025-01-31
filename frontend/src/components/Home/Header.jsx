import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import styles from "./Header.module.css";

import logo from "assets/Home/logo.png";
import profile from "assets/Home/profile.png";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();
  const [selectedMenu, setSelcetedMenu] = useState("홈");
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [nickname, setNickname] = useState("");

  const menuItems = [
    { name: "홈", href: "/" },
    { name: "일정", href: "/match" },
    { name: "순위", href: "/ranking" },
    { name: "승부예측", href: "/prediction" },
  ];

  useEffect(() => {
    const currentMenu = menuItems.find(
      (item) => item.href === location.pathname
    );
    if (currentMenu) {
      setSelcetedMenu(currentMenu.name);
    }
  }, [location.pathname]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDoc = doc(db, "users", currentUser.uid);
        const userShapshot = await getDoc(userDoc);
        if (userShapshot.exists()) {
          setNickname(userShapshot.data().nickname);
        } else {
          console.log("사용자 데이터가 존재하지 않습니다.");
        }
      }
    });
    return () => unsubscribe();
  }, [auth, db]);

  const handleLogin = () => {
    if (!user) {
      navigate("/login");
    } else {
      setDropdownOpen((prev) => !prev);
    }
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        setDropdownOpen(false);
        navigate("/login");
      })
      .catch((error) => {
        console.log("로그아웃 실패", error);
      });
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  return (
    <div className={styles.headerContainer}>
      <div className={styles.logoContainer} onClick={() => navigate("/")}>
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
                data-selected={selectedMenu === item.name ? "true" : "false"}
              >
                <span>{item.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div
        className={styles.profileContainer}
        onClick={handleLogin}
        onMouseEnter={() => setDropdownOpen(true)}
      >
        <img src={profile} className={styles.profileimg} />
        {dropdownOpen && user && (
          <div className={styles.dropdownMenu} onMouseLeave={closeDropdown}>
            <div className={styles.dropdownNickname}>{nickname}</div>
            <div
              className={styles.dropdownItem}
              onClick={() => navigate("/profile")}
            >
              프로필
            </div>
            <div className={styles.dropdownItem} onClick={handleLogout}>
              로그아웃
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
