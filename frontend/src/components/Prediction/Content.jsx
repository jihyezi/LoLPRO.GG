import React, { useEffect, useState } from "react";
import app from "../../firebase";
import { getFirestore, getDocs, doc, collection } from "firebase/firestore";
import styles from "./Content.module.css"

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

const Content = ({ weekNumber }) => {
    const db = getFirestore(app);

    const teamLogos = {
        HLE, GEN, T1, DK, KT, BFX, NS, DNF, DRX, BRO,
    };

    const [gameData, setGameData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGameData = async () => {
            try {
                const weekRef = collection(db, "matchs", "lck_cup", `week${weekNumber}`);
                const querySnapshot = await getDocs(weekRef);

                // 모든 match 데이터를 배열로 변환
                const data = querySnapshot.docs.map((doc) => ({
                    id: doc.id, // match01, match02 같은 ID
                    ...doc.data(),
                }));
                setGameData(data); // 상태에 저장
                console.log(data); // 데이터 확인
                console.log(weekNumber); // 데이터 확인
                console.log(gameData)
            } catch (error) {
                console.error("Error fetching game data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGameData();
    }, [weekNumber, db]);

    if (gameData.length === 0) {
        return <div>No games found for this week.</div>;
    }

    const handleTeamClick = (gameIndex, team) => {
        setGameData(prevGameData => {
            const updatedGames = [...prevGameData];
            updatedGames[gameIndex] = {
                ...updatedGames[gameIndex],
                inVoted: team,
            };
            return updatedGames;
        });
    };
    const getVoteStatus = (game) => {
        if (!game.result) {
            return "예측진행중";
        }

        if (game.inVoted) {
            return game.result[0] > game.result[1] && game.inVoted === "teamA" ||
                game.result[1] > game.result[0] && game.inVoted === "teamB"
                ? "예측성공" : "예측실패";
        }
        return "미참여";
    };

    return (
        <div className={styles.contentContainer}>
            {gameData.map((game, index) => {
                const voteStatus = getVoteStatus(game);
                const showPercent = game.inVoted || game.result;
                const initialState = !game.inVoted && !game.result;

                const winningTeam = game.result
                    ? game.result[0] > game.result[1]
                        ? "teamA"
                        : "teamB"
                    : null;

                const getAStatus = () => {
                    if (!game.result) {
                        return game.inVoted === "teamA" ? "voted" : null;
                    }
                    if (game.result) {
                        if (game.inVoted) {
                            return voteStatus === "예측성공" && winningTeam === "teamA" ? "success" : "fail";
                        }
                        return null;
                    }
                };

                const getBStatus = () => {
                    if (!game.result) {
                        return game.inVoted === "teamB" ? "voted" : null;
                    }
                    if (game.result) {
                        if (game.inVoted) {
                            return voteStatus === "예측성공" && winningTeam === "teamB" ? "success" : "fail";
                        }
                        return null;
                    }
                };



                return (
                    <div key={index} className={styles.contentWrapper}>
                        <div className={styles.InfoBox}>
                            <span className={styles.dateText}>{game.date ? new Date(game.date.seconds * 1000).toLocaleDateString() : "N/A"}</span>
                            <span className={styles.dateText}>(수)</span>
                            <span className={styles.dateText}>{game.time}</span>
                            <div
                                className={styles.voteText}
                                ing={voteStatus === "예측진행중" ? "true" : "false"}
                                success={voteStatus === "예측성공" ? "true" : "false"}
                            >
                                {voteStatus}
                            </div>
                        </div>
                        <div className={styles.predictionBox}>
                            <div
                                className={styles.predictionLeft}
                                onClick={() => handleTeamClick(weekNumber, index, "teamA")}
                                game-invote={game.inVoted === "teamA" ? "true" : "false"}
                            >
                                <img src={game.teamA[1]} className={styles.logoImg1} alt="Team 1" />
                                <div className={styles.matchInfoBox}>
                                    <span
                                        className={styles.teamText1}
                                        status={getAStatus()}
                                        initial={initialState ? "true" : "false"}
                                        win={game.result && winningTeam === "teamA" ? "true" : "false"}
                                    >
                                        {game.teamA[0]}
                                    </span>
                                    {showPercent &&
                                        <span
                                            className={styles.percent}
                                            status={getAStatus()}
                                            win={game.result && winningTeam === "teamA" ? "true" : "false"}
                                        >
                                            {game.percent[0]}%
                                        </span>}
                                </div>
                                {(voteStatus !== "예측진행중" || game.result) && (
                                    <div
                                        className={styles.scoreText1}
                                        status={getAStatus()}
                                        win={game.result && winningTeam === "teamA" ? "true" : "false"}
                                    >
                                        {game.result?.[0]}
                                    </div>
                                )}

                            </div>
                            <div
                                className={styles.predictionRight}
                                onClick={() => handleTeamClick(weekNumber, index, "teamB")}
                                game-invote={game.inVoted === "teamB" ? "true" : "false"}>
                                {(voteStatus !== "예측진행중" || game.result) && (
                                    <div
                                        className={styles.scoreText2}
                                        status={getBStatus()}
                                        win={game.result && winningTeam === "teamB" ? "true" : "false"}
                                    >
                                        {game.result?.[1]}
                                    </div>
                                )}
                                <div className={styles.matchInfoBox2}>
                                    <span
                                        className={styles.teamText2}
                                        status={getBStatus()}
                                        initial={initialState ? "true" : "false"}
                                        win={game.result && winningTeam === "teamB" ? "true" : "false"}
                                    >
                                        {game.teamB[0]}
                                    </span>
                                    {showPercent &&
                                        <span
                                            className={styles.percent}
                                            status={getBStatus()}
                                            win={game.result && winningTeam === "teamB" ? "true" : "false"}
                                        >
                                            {game.percent[1]}%
                                        </span>}
                                </div>
                                <img src={game.teamB[1]} className={styles.logoImg2} alt="Team 2" />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    )
}

export default Content;