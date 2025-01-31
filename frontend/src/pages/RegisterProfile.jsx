import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { getAuth } from "firebase/auth";
import app from "../firebase";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { motion } from "framer-motion";
import styles from "./RegisterProfile.module.css";

// Images
import logo from "assets/Home/logo.png";
import default_profile from "assets/Login/register_profile.png";
import add_profile from "assets/Login/addProfile.png";

const RegisterProfile = () => {
    const { state } = useLocation();
    const { uid, email } = state || {};
    const navigate = useNavigate();
    const auth = getAuth(app);
    const firestore = getFirestore(app);
    const storage = getStorage(app);
    const [profileFile, setProfileFile] = useState(null);
    const [profilePreview, setProfilePreview] = useState(default_profile);
    const [nickname, setNickname] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (profileFile) {
            const objectUrl = URL.createObjectURL(profileFile);
            setProfilePreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [profileFile]);

    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileFile(file);
        }
    };

    const handleSaveProfile = async () => {
        if (!nickname) {
            setError("닉네임을 입력해주세요.");
            return;
        }

        setIsSaving(true);

        try {
            let profileImageUrl = "";

            // 프로필 이미지 업로드
            if (profileFile) {
                const storageRef = ref(storage, `profileImages/${uid}`);
                await uploadBytes(storageRef, profileFile);
                profileImageUrl = await getDownloadURL(storageRef);
            }

            // Firestore에 닉네임 및 프로필 이미지 저장
            const userRef = doc(firestore, "users", uid);
            await setDoc(userRef, {
                email: email,
                nickname: nickname,
                profileImage: profileImageUrl || "",
            });

            // 저장 완료 후 로그인 페이지로 이동
            navigate("/login");
        } catch (err) {
            console.error("프로필 저장 오류:", err);
            setError("프로필 저장에 실패했습니다. 다시 시도해주세요.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className={styles.registerContainer}>
            <div className={styles.logoContainer}>
                <img src={logo} className={styles.logoimg} />
                <p className={styles.logotext}>LoLPRO.GG</p>
            </div>
            <div className={styles.registerWrapper}>
                <div className={styles.registerBox}>
                    <div className={styles.registerText}>
                        프로필
                    </div>
                    <div
                        className={styles.profileBox}
                        onClick={() => document.getElementById("fileInput").click()}
                    >
                        <img src={add_profile} className={styles.addProfile} />
                        <img src={profilePreview} className={styles.profileImg} alt="Profile Preview" />
                        <input
                            id="fileInput"
                            type="file"
                            accept="image/*"
                            className={styles.profileFile}
                            style={{ display: "none" }}
                            onChange={handleProfileImageChange}
                        />
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
                    <motion.div
                        className={nickname ? styles.registerButton : styles.disabledButton}
                        initial={{ scale: 1 }}
                        whileTap={nickname ? { scale: 0.9 } : {}}
                        onClick={handleSaveProfile}
                    >
                        저장
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default RegisterProfile;
