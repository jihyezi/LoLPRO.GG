import React, { useEffect, useState } from "react";
import app from "../../firebase";
import { getFirestore, getDocs, collection, getDoc, setDoc, doc, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useUser } from "context/UserContext";
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

const Match = ({ weekNumber }) => {
    const db = getFirestore(app);
    const auth = getAuth();
    const { user, nickname } = useUser();
    const [gameData, setGameData] = useState([]);
    const [userVotes, setUserVotes] = useState({});
    const [votePercentages, setVotePercentages] = useState({});

    const teamLogos = { HLE, GEN, T1, DK, KT, BFX, NS, DNF, DRX, BRO };

    const calculateVotePercentages = async (weekNumber, matchId) => {
        const votesRef = collection(db, "matchs", "lck_cup", `week${weekNumber}`, matchId, "votes");
        const querySnapshot = await getDocs(votesRef);

        let teamAcount = 0;
        let teamBcount = 0;

        querySnapshot.forEach((doc) => {
            const vote = doc.data();
            if (vote.teamA_vote) teamAcount++;
            if (vote.teamB_vote) teamBcount++;
        });

        const totalVotes = teamAcount + teamBcount;

        const teamApercent = totalVotes > 0 ? Math.floor((teamAcount / totalVotes) * 100) : 0;
        const teamBpercent = totalVotes > 0 ? Math.floor((teamBcount / totalVotes) * 100) : 0;

        return { teamApercent, teamBpercent };
    };

    useEffect(() => {
        if (!user || !user.uid) return;

        const weekRef = collection(db, "matchs", "lck_cup", `week${weekNumber}`);

        const unsubscribeGames = onSnapshot(weekRef, async (querySnapshot) => {
            const data = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setGameData(data);

            const percentageData = {};
            for (const game of data) {
                const percentages = await calculateVotePercentages(weekNumber, game.id);
                percentageData[game.id] = percentages;
            }
            setVotePercentages(percentageData);

            data.forEach((game) => {
                const matchRef = doc(db, "matchs", "lck_cup", `week${weekNumber}`, game.id);
                const voteRef = doc(collection(matchRef, "votes"), user.uid);

                onSnapshot(voteRef, (voteSnapshot) => {
                    setUserVotes((prevVotes) => ({
                        ...prevVotes,
                        [game.id]: voteSnapshot.exists() ? voteSnapshot.data() : null,
                    }));
                });
            });
        });

        return () => unsubscribeGames();
    }, [db, user, weekNumber]);


    if (gameData.length === 0) {
        return <div> </div>;
    }

    const updateVote = async (weekNumber, matchId, selectedTeam) => {
        try {
            const matchRef = doc(db, "matchs", "lck_cup", `week${weekNumber}`, matchId);
            const voteRef = doc(collection(matchRef, "votes"), user.uid);

            await setDoc(voteRef, {
                userId: user.uid,
                teamA_vote: selectedTeam === "teamA",
                teamB_vote: selectedTeam === "teamB",
            });

            // 투표 후 상태 업데이트
            setUserVotes((prevVotes) => ({
                ...prevVotes,
                [matchId]: {
                    teamA_vote: selectedTeam === "teamA",
                    teamB_vote: selectedTeam === "teamB",
                },
            }));

            // 투표 퍼센트 다시 계산
            const percentages = await calculateVotePercentages(weekNumber, matchId);
            setVotePercentages((prev) => ({
                ...prev,
                [matchId]: percentages,
            }));

            console.log(`Vote updated for match: ${matchId}`);
        } catch (error) {
            console.error("Error updating vote:", error);
        }
    };


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
        const matchDate = new Date(game.date.seconds * 1000);
        const currentDate = new Date();
        const userVote = userVotes[game.id];
        const oneHourBeforeMatch = new Date(matchDate.getTime() - 60 * 60 * 1000);

        if (!game.result && currentDate > matchDate && !userVote) {
            return "미참여";
        } else if (currentDate >= oneHourBeforeMatch && currentDate < matchDate && !game.result) {
            return "예측종료";
        } else if (!game.result && currentDate < oneHourBeforeMatch) {
            return "예측진행중";
        }

        if (game.result && userVote) {
            const { teamA_score, teamB_score } = game.result;

            if (userVote.teamA_vote) {
                return teamA_score > teamB_score ? "예측성공" : "예측실패";
            }

            if (userVote.teamB_vote) {
                return teamB_score > teamA_score ? "예측성공" : "예측실패";
            }
        }
        return "미참여";
    }

    return (
        <div className={styles.contentContainer}>
            {gameData.map((game, index) => {
                const { date, dayOfWeek, time } = getFormattedDate(game.date);
                const voteStatus = gameStatus(game);
                const userVote = userVotes[game.id];
                const votedTeam = userVote ? userVote.teamA_vote ? "teamA" : "teamB" : null;
                const showPercent = userVote || game.result || voteStatus === "미참여";
                const showResult = game.result || voteStatus === "미참여"
                const winningTeam = game.result ? game.result.teamA_score > game.result.teamB_score ? "teamA" : "teamB" : null;
                const voteData = votePercentages[game.id] || { teamApercent: 0, teamBpercent: 0 };
                const getAStatus = () => {
                    if (!game.result) {
                        if (votedTeam === "teamA") {
                            return showPercent ? "voted" : "notVoted";
                        }
                        return "noVoteResult";
                    }
                    if (game.result) {
                        if (userVote && winningTeam === "teamA") {
                            return voteStatus === "예측성공" ? "success" : "noVoteResult";
                        } else if (userVote && winningTeam === "teamB") {
                            return voteStatus === "예측실패" ? "fail" : "noVoteResult"
                        }
                    }
                    return "noVoteResult";
                }

                console.log(getAStatus())
                const getBStatus = () => {
                    if (!game.result) {
                        if (votedTeam === "teamB") {
                            return showPercent ? "voted" : "notVoted";
                        }
                        return "noVoteResult";
                    }
                    if (game.result) {
                        if (userVote && winningTeam === "teamB") {
                            return voteStatus === "예측성공" ? "success" : "noVoteResult";
                        } else if (userVote && winningTeam === "teamA") {
                            return voteStatus === "예측실패" ? "fail" : "noVoteResult"
                        }
                    }
                    return "noVoteResult";
                }
                console.log(getBStatus())

                return (
                    <div key={index} className={styles.contenWrapper}>
                        <div className={styles.InfoBox}>
                            <span className={styles.dateText}>{date}</span>
                            <span className={styles.dateText}>{dayOfWeek}</span>
                            <span className={styles.dateText}>{time}</span>
                            <div
                                className={styles.voteText}
                                status={voteStatus}
                            >
                                {voteStatus}
                            </div>
                        </div>
                        <div className={styles.predictionBox}>
                            <div
                                className={styles.predictionLeft}
                                onClick={voteStatus === "예측진행중" ? () => updateVote(weekNumber, game.id, "teamA") : null}
                                status={getAStatus()}
                                style={{ pointerEvents: voteStatus === "예측진행중" ? "auto" : "none" }}
                            >
                                <img src={teamLogos[game.teamA]} className={styles.logoImg1} alt="TeamA" />
                                <div className={styles.matchInfoBox}>
                                    <span
                                        className={styles.teamText1}
                                        status={getAStatus()}
                                    >
                                        {game.teamA}
                                    </span>
                                    {showPercent &&
                                        <span
                                            className={styles.percent1}
                                            status={getAStatus()}
                                        >
                                            {voteData.teamApercent}%
                                        </span>}
                                </div>
                                {showResult && (
                                    <div
                                        className={styles.scoreText1}
                                        status={getAStatus()}
                                    >
                                        {game.result?.teamA_score}
                                    </div>
                                )}
                            </div>
                            <div
                                className={styles.predictionRight}
                                onClick={voteStatus === "예측진행중" ? () => updateVote(weekNumber, game.id, "teamB") : null}
                                status={getBStatus()}
                                style={{ pointerEvents: voteStatus === "예측진행중" ? "auto" : "none" }}
                            >
                                {showResult && (
                                    <div
                                        className={styles.scoreText2}
                                        status={getBStatus()}
                                    >
                                        {game.result?.teamB_score}
                                    </div>
                                )}
                                <div className={styles.matchInfoBox2}>
                                    <span
                                        className={styles.teamText2}
                                        status={getBStatus()}
                                    >
                                        {game.teamB}
                                    </span>
                                    {showPercent &&
                                        <span
                                            className={styles.percent2}
                                            status={getBStatus()}
                                        >
                                            {voteData.teamBpercent}%
                                        </span>}
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