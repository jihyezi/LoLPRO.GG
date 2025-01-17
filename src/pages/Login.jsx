import React, { useState } from "react";
import { useNavigate } from "react-router";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import app from "../firebase";
import { motion } from "framer-motion";
import styles from "./Login.module.css"

// Images
import logo from "assets/Home/logo.png";
import google from "assets/Login/googleLogo.png";
import errorIcon from "assets/Login/error.png";

const Login = () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email) {
            setError("이메일을 입력해주세요.");
            return;
        }
        if (!password) {
            setError("비밀번호를 입력해주세요.");
            return;
        }
        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("로그인 성공");
            setError("");
        } catch (error) {
            setError("이메일 또는 비밀번호가 올바르지 않습니다.");
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
        } catch (error) {
            setError("구글 로그인 실패. 다시 시도해주세요.")
        }
    };

    const handleSignUp = () => {
        navigate('/signup');
    };

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
                        <input
                            name="email"
                            type="email"
                            className={styles.emailBox}
                            placeholder="이메일"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            data-status={email ? "true" : "false"} />
                    </div>
                    <div className={styles.passwordWrapper}>
                        <input
                            name="password"
                            type="password"
                            className={styles.passwordBox}
                            placeholder="비밀번호"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            data-status={password ? "true" : "false"} />
                    </div>
                    {error && (
                        <div className={styles.errorBox}>
                            <img src={errorIcon} className={styles.errorIcon} alt="Error" />
                            <div className={styles.errorText}>{error}</div>
                        </div>
                    )}
                    <motion.div
                        className={styles.loginButton}
                        onClick={handleLogin}
                        initial={{ scale: 1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        로그인
                    </motion.div>
                    <div className={styles.orBox}>
                        <div style={{ backgroundColor: "#ffffff", height: "1px", flexGrow: 1 }} />
                        <div style={{ flexGrow: 0, color: "#ffffff", fontSize: "12px" }}>OR</div>
                        <div style={{ backgroundColor: "#ffffff", height: "1px", flexGrow: 1 }} />
                    </div>
                    <motion.div
                        className={styles.googleButton}
                        initial={{ scale: 1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleGoogleLogin}>
                        <img src={google} style={{ width: "20px", height: "20px" }} />
                        <span className={styles.googleText}>Google 로그인</span>
                    </motion.div>
                    <div className={styles.signUpBox}>
                        <span className={styles.description}>아직 LoLPRO.GG Member가 아니신가요?</span>
                        <motion.div
                            className={styles.signUpText}
                            initial={{ scale: 1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleSignUp}
                        >
                            가입하기
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Login;