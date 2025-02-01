import React, { useEffect, useState } from "react";
import app from "../../firebase";
import { getFirestore, getDocs, collection } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import styles from "./Match.module.css";

// Images
import HLE from "assets/Team/HLE.png";
import GEN from "assets/Team/GEN.png";
import T1 from "assets/Team/T1.png";
import DK from "assets/Team/DK.png";
import KT from "assets/Team/KT.png";
import BFX from "assets/Team/BFX.png";
import NS from "assets/Team/NS.png";
import DNF from "assets/Team/DNF.png";
import DRX from "assets/Team/DRX.png";
import BRO from "assets/Team/BRO.png";

const Match = ({ weekNumber, startDate, endDate }) => {
    const db = getFirestore(app);
    const auth = getAuth();
    const [gameData, setGameData] = useState([]);

    console.log(auth);

    const teamLogos = {
        HLE, GEN, T1, DK, KT, BFX, NS, DNF, DRX, BRO
    };

    useEffect(() => {
        const fetchGameData = async () => {
            try {
                const weekRef = collection(db, "matchs", "lck_cup", `week${weekNumber}`);
                const querySnapshot = await getDocs(weekRef);

                const data = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setGameData(data);
                console.log(data);
            } catch (error) {
                console.error("Error fetching game data", error);
            }
        };
        fetchGameData();
    }, [weekNumber, db]);

    if (gameData.length === 0) {
        return <div>No games found for this week.</div>;
    }

    const getFormattedDate = (timestamp) => {
        const date = new Date(timestamp.seconds * 1000);

        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${month}월 ${day}일`;

        const dayNames = ['(일)', '(월)', '(화)', '(수)', '(목)', '(금)', '(토)'];
        const dayOfWeek = dayNames[date.getDay()];

        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const formattedTime = `${hours}:${minutes}`;

        return {
            date: formattedDate,
            dayOfWeek,
            time: formattedTime
        };
    };

    const gameStatus = (game) => {
        if (!game.result) {
            return "예측진행중";
        }
        return "예측종료";
    }

    return (
        <div className={styles.contentContainer}>
            {gameData.map((game, index) => {
                const { date, dayOfWeek, time } = getFormattedDate(game.date);
                const status = gameStatus(game);
                return (
                    <div key={index} className={styles.contenWrapper}>
                        <div className={styles.InfoBox}>
                            <span className={styles.dateText}>{date}</span>
                            <span className={styles.dateText}>{dayOfWeek}</span>
                            <span className={styles.dateText}>{time}</span>
                            <div
                                className={styles.voteText}
                                status={status === "예측진행중" ? "true" : "false"}
                            >
                                {status}
                            </div>
                        </div>
                        <div className={styles.predictionBox}>
                            <div className={styles.predictionLeft}>
                                <img src={teamLogos[game.teamA]} className={styles.logoImg1} alt="TeamA" />
                                <div className={styles.matchInfoBox}>
                                    <span
                                        className={styles.teamText1}
                                    >
                                        {game.teamA}
                                    </span>
                                </div>
                                {game.result && (
                                    <div
                                        className={styles.scoreText1}
                                    >
                                        {game.result?.teamA_score}
                                    </div>
                                )}
                            </div>
                            <div className={styles.predictionRight}>
                                {game.result && (
                                    <div
                                        className={styles.scoreText2}
                                    >
                                        {game.result?.teamB_score}
                                    </div>
                                )}
                                <div className={styles.matchInfoBox2}>
                                    <span className={styles.teamText2}>{game.teamB}</span>
                                </div>
                                <img src={teamLogos[game.teamB]} className={styles.logoImg2} alt="TeamB" />
                            </div>
                        </div>
                    </div>
                )

            })}

        </div>
    )
}

export default Match;