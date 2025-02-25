import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import app from "../firebase";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { motion } from "framer-motion";
import styles from "./SignUp.module.css";

// Images
import logo from "assets/Home/logo.png";
import eyeOn from "assets/Login/eye_on.png";
import eyeOff from "assets/Login/eye_off.png";
import google from "assets/Login/googleLogo.png";
import errorIcon from "assets/Login/error.png";
import check from "assets/Login/check.png";

const SignUp = () => {
    const navigate = useNavigate();
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    const firestore = getFirestore(app);
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [checkPW, setCheckPW] = useState('');
    const [emailError, setEmailError] = useState('');
    const [emailSuccess, setEmailSuccess] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [checkPWError, setCheckPWError] = useState('');
    const [checkPWSuccess, setCheckPWSuccess] = useState('');
    const [showPW, setShowPW] = useState(false);
    const [showPW2, setShowPW2] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            await setDoc(doc(firestore, "users", user.uid), {
                nickname: user.email.split("@")[0],
                email: user.email,
                createdAt: new Date(),
            });

            navigate('/');
        } catch (error) {
            alert("구글 로그인 실패. 다시 시도해주세요.")
        }
    };

    const handlerShowPW = () => {
        setShowPW(!showPW);
    };

    const handlerShowPW2 = () => {
        setShowPW2(!showPW2);
    };

    const handleEmailValidation = (e) => {
        const value = e.target.value;
        setEmail(value);
        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
            setEmailError("이메일 형식이 잘못되었습니다.");
            setEmailSuccess("");
        } else {
            setEmailError("");
            setEmailSuccess("올바른 이메일 형식입니다.");
        }
    };

    const handlePasswordValidation = (e) => {
        const value = e.target.value;
        setPassword(value);
        if (value.length < 6) {
            setPasswordError("비밀번호는 6자 이상이어야 합니다.");
        } else {
            setPasswordError("");
        }
    }

    const handleCheckPasswordValidation = (e) => {
        const value = e.target.value;
        setCheckPW(value);
        if (value !== password) {
            setCheckPWError("비밀번호가 일치하지 않습니다.");
            setCheckPWSuccess("");
        } else {
            setCheckPWError("");
            setCheckPWSuccess("비밀번호가 일치합니다.");
        }
    }

    useEffect(() => {
        const isValid = nickname && email && password && checkPW && !emailError && !passwordError && !checkPWError;
        setIsFormValid(isValid);
    }, [nickname, email, password, checkPW]);

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(firestore, "users", user.uid), {
                nickname: nickname,
                email: email,
                createdAt: new Date(),
            });

            navigate('/login');
            console.log("회원가입 성공");
        } catch (error) {
            console.error("회원가입 실패:", error.message);
        }
    }

    return (
        <div className={styles.signupContainer}>
            <div className={styles.logoContainer}>
                <img src={logo} className={styles.logoimg} />
                <p className={styles.logotext}>LoLPRO.GG</p>
            </div>
            <div className={styles.signupWrapper}>
                <div className={styles.signupBox}>
                    <div className={styles.signupText}>
                        회원가입
                    </div>
                    <div className={styles.nameWrapper}>
                        <input
                            name="nickname"
                            type="text"
                            className={styles.nameBox}
                            placeholder="닉네임"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            data-status={nickname ? "true" : "false"} />
                    </div>
                    <div className={styles.emailWrapper}>
                        <input
                            name="email"
                            type="email"
                            className={styles.emailBox}
                            placeholder="이메일"
                            value={email}
                            onChange={handleEmailValidation}
                            data-status={email ? "true" : "false"} />
                    </div>
                    {emailError && (
                        <div className={styles.errorBox}>
                            <img src={errorIcon} className={styles.errorIcon} alt="Error" />
                            <div className={styles.errorText}>{emailError}</div>
                        </div>
                    )}
                    {emailSuccess && (
                        <div className={styles.errorBox}>
                            <img src={check} className={styles.errorIcon} alt="Success" />
                            <div className={styles.successText}>{emailSuccess}</div>
                        </div>
                    )}
                    <div className={styles.passwordWrapper}>
                        <input
                            name="password"
                            type={showPW ? "text" : "password"}
                            className={styles.passwordBox}
                            placeholder="비밀번호"
                            value={password}
                            onChange={handlePasswordValidation}
                            data-status={password ? "true" : "false"} />
                        <div onClick={handlerShowPW} className={styles.showPW}>
                            <img
                                src={showPW ? eyeOn : eyeOff}
                                alt="비밀번호 보기/감추기"
                                style={{ width: "18px", height: "18px" }}
                            />
                        </div>
                    </div>
                    {passwordError && (
                        <div className={styles.errorBox}>
                            <img src={errorIcon} className={styles.errorIcon} alt="Error" />
                            <div className={styles.errorText}>{passwordError}</div>
                        </div>
                    )}
                    <div className={styles.passwordWrapper}>
                        <input
                            name="password"
                            type={showPW2 ? "text" : "password"}
                            className={styles.passwordBox}
                            placeholder="비밀번호 확인"
                            value={checkPW}
                            onChange={handleCheckPasswordValidation}
                            data-status={checkPW ? "true" : "false"} />
                        <div onClick={handlerShowPW2} className={styles.showPW}>
                            <img
                                src={showPW2 ? eyeOn : eyeOff}
                                alt="비밀번호 보기/감추기"
                                style={{ width: "18px", height: "18px" }}
                            />
                        </div>
                    </div>
                    {checkPWError && (
                        <div className={styles.errorBox}>
                            <img src={errorIcon} className={styles.errorIcon} alt="Error" />
                            <div className={styles.errorText}>{checkPWError}</div>
                        </div>
                    )}
                    {checkPWSuccess && (
                        <div className={styles.errorBox}>
                            <img src={check} className={styles.errorIcon} alt="Success" />
                            <div className={styles.successText}>{checkPWSuccess}</div>
                        </div>
                    )}
                    <motion.div
                        className={isFormValid ? styles.signupButton : styles.disabledButton}
                        initial={{ scale: 1 }}
                        whileTap={isFormValid ? { scale: 0.9 } : {}}
                        onClick={isFormValid ? handleSignUp : null}
                    >
                        회원가입
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
                        <span className={styles.googleText}>Google로 시작하기</span>
                    </motion.div>
                </div>
            </div>

        </div>
    )
}

export default SignUp;