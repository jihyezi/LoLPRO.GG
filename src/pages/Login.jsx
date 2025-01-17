import React from "react";
import styles from "./Login.module.css"

import logo from "../assets/Home/logo.png";
import google from "../assets/Login/googleLogo.png"

const Login = () => {
    return (
        <div className={styles.LoginContainer}>
            <div className={styles.logoContainer}>
                <img src={logo} className={styles.logoimg} />
                <p className={styles.logotext}>LoLPRO.GG</p>
            </div>
            <div className={styles.loginWrapper}>
                <div className={styles.loginBox}>
                    <div className={styles.loginText}>
                        로그인
                    </div>
                    <div className={styles.emailWrapper}>
                        <input type="email" className={styles.emailBox} placeholder="이메일" />
                    </div>
                    <div className={styles.passwordWrapper}>
                        <input type="password" className={styles.passwordBox} placeholder="비밀번호" />
                    </div>
                    <div className={styles.loginButton}>
                        로그인
                    </div>
                    <div className={styles.orBox}>
                        <div style={{ backgroundColor: "#ffffff", height: "1px", flexGrow: 1 }} />
                        <div style={{ flexGrow: 0, color: "#ffffff", fontSize: "12px" }}>OR</div>
                        <div style={{ backgroundColor: "#ffffff", height: "1px", flexGrow: 1 }} />
                    </div>
                    <div className={styles.googleButton}>
                        <img src={google} style={{ width: "20px", height: "20px" }} />
                        <span className={styles.googleText}>Google 로그인</span>
                    </div>
                    <div className={styles.signUpBox}>
                        <span className={styles.description}>아직 LoLPRO.GG Member가 아니신가요?</span>
                        <span className={styles.signUpText}>가입하기</span>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Login;