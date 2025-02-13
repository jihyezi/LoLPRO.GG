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

    const teamNameMapping = {
        "Dplus KIA": "DK",
        "Hanwha Life Esports": "HLE",
        "Gen.G": "GEN",
        "T1": "T1",
        "KT Rolster": "KT",
        "OK BRION": "BRO",
        "Nongshim RedForce": "NS",
        "DRX": "DRX",
        "BNK FearX": "BFX",
        "DRX": "DRX",
        "DN Freecs": "DNF",
    };

    const getShortTeamName = (fullName) => teamNameMapping[fullName] || fullName;

    const calculateVotePercentages = async (weekNumber, matchId) => {
        const votesRef = collection(db, "prediction", "lck_cup", `week${weekNumber}`, matchId, "votes");
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
        const weekRef = collection(db, "prediction", "lck_cup", `week${weekNumber}`);

        const unsubscribeGames = onSnapshot(weekRef, async (querySnapshot) => {
            console.log("실행됨");
            const data = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setGameData(data);
            console.log("Firestore에서 가져온 경기 데이터:", data);

            // 경기 데이터 가져오고, 투표 퍼센트도 함께 업데이트
            const percentageData = {};
            for (const game of data) {
                const percentages = await calculateVotePercentages(weekNumber, game.id);
                percentageData[game.id] = percentages;
            }
            setVotePercentages(percentageData);
        });

        return () => unsubscribeGames();
    }, [db, weekNumber]);

    // 유저가 로그인했을 때만 투표 데이터 구독
    useEffect(() => {
        if (!user || !user.uid || gameData.length === 0) return;

        const unsubscribeVotes = gameData.map((game) => {
            const voteRef = doc(collection(db, "prediction", "lck_cup", `week${weekNumber}`, game.id, "votes"), user.uid);
            return onSnapshot(voteRef, (voteSnapshot) => {
                setUserVotes((prevVotes) => ({
                    ...prevVotes,
                    [game.id]: voteSnapshot.exists() ? voteSnapshot.data() : null,
                }));
            });
        });

        return () => unsubscribeVotes.forEach((unsubscribe) => unsubscribe());
    }, [db, user, weekNumber, gameData]);


    if (gameData.length === 0) {
        return <div> </div>;
    }

    const updateVote = async (weekNumber, matchId, selectedTeam) => {
        try {
            const matchRef = doc(db, "prediction", "lck_cup", `week${weekNumber}`, matchId);
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


    const getFormattedDate = (dateString) => {
        if (!dateString) return { date: "", dayOfWeek: "" };

        const formattedDateString = dateString.replace(/-/g, "/");
        const dateObj = new Date(formattedDateString);

        const month = `${dateObj.getMonth() + 1}월`;
        const day = `${dateObj.getDate()}일`;

        const dayNames = ['(일)', '(월)', '(화)', '(수)', '(목)', '(금)', '(토)'];
        const dayOfWeek = dayNames[dateObj.getDay()];

        return {
            date: `${month} ${day}`,
            dayOfWeek,
        };
    };

    const gameStatus = (game) => {
        const formattedDateString = game.date.replace(/-/g, "/");
        const matchDate = new Date(`${formattedDateString} ${game.time}`); // 시간을 포함한 Date 객체 생성
        const currentDate = new Date();
        const userVote = userVotes[game.id];
        const oneHourBeforeMatch = new Date(matchDate.getTime() - 60 * 60 * 1000);

        const isResultEmpty = (result) => {
            return (
                !result || // result가 null 또는 undefined
                (result.teamA_score == null && result.teamB_score == null) // 점수가 없는 경우
            );
        };

        if (isResultEmpty(game.result) && currentDate > matchDate && !userVote) {
            return "미참여";
        } else if (currentDate >= oneHourBeforeMatch && currentDate < matchDate && isResultEmpty(game.result)) {
            return "예측종료";
        } else if (isResultEmpty(game.result) && currentDate < oneHourBeforeMatch) {
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
                const shortTeamA = getShortTeamName(game.teamA);
                const shortTeamB = getShortTeamName(game.teamB);
                const { date, dayOfWeek, time } = getFormattedDate(game.date);
                const voteStatus = gameStatus(game);
                const userVote = userVotes[game.id];
                const votedTeam = userVote ? userVote.teamA_vote ? "teamA" : "teamB" : null;
                const showPercent = userVote || game.result || voteStatus === "미참여";
                const showResult = game.result || voteStatus === "미참여"
                const winningTeam = game.result ? game.result.teamA_score > game.result.teamB_score ? "teamA" : "teamB" : null;
                const voteData = votePercentages[game.id] || { teamApercent: 0, teamBpercent: 0 };
                const getAStatus = () => {
                    if (!game.result || (game.result.teamA_score == null && game.result.teamB_score == null)) {
                        if (votedTeam === "teamA") {
                            return showPercent ? "voted" : "notVoted";
                        }
                        return "noVoteResult";
                    }
                    if (game.result || !(game.result.teamA_score == null && game.result.teamB_score == null)) {
                        if (userVote && winningTeam === "teamA") {
                            return voteStatus === "예측성공" ? "success" : "noVoteResult";
                        } else if (userVote && winningTeam === "teamB") {
                            return voteStatus === "예측실패" ? "fail" : "noVoteResult"
                        }
                    }
                    return "noVoteResult";
                }
                const getBStatus = () => {
                    if (!game.result || (game.result.teamA_score == null && game.result.teamB_score == null)) {
                        if (votedTeam === "teamB") {
                            return showPercent ? "voted" : "notVoted";
                        }
                        return "noVoteResult";
                    }
                    if (game.result || !(game.result.teamA_score == null && game.result.teamB_score == null)) {
                        if (userVote && winningTeam === "teamB") {
                            return voteStatus === "예측성공" ? "success" : "noVoteResult";
                        } else if (userVote && winningTeam === "teamA") {
                            return voteStatus === "예측실패" ? "fail" : "noVoteResult"
                        }
                    }
                    return "noVoteResult";
                }

                return (
                    <div key={index} className={styles.contenWrapper}>
                        <div className={styles.InfoBox}>
                            <span className={styles.dateText}>{date}</span>
                            <span className={styles.dateText}>{dayOfWeek}</span>
                            <span className={styles.dateText}>{game.time}</span>
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
                                onClick={() => {
                                    if (voteStatus === "예측진행중" && user) {
                                        updateVote(weekNumber, game.id, "teamA");
                                    } else {
                                        alert("로그인이 필요한 서비스입니다.");
                                    }
                                }}
                                status={getAStatus()}
                                style={{ pointerEvents: voteStatus === "예측진행중" ? "auto" : "none" }}
                            >
                                <img src={teamLogos[shortTeamA]} className={styles.logoImg1} alt="TeamA" />
                                <div className={styles.matchInfoBox}>
                                    <span
                                        className={styles.teamText1}
                                        status={getAStatus()}
                                    >
                                        {shortTeamA}
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
                                onClick={() => {
                                    if (voteStatus === "예측진행중" && user) {
                                        updateVote(weekNumber, game.id, "teamB");
                                    } else {
                                        alert("로그인이 필요한 서비스입니다.");
                                    }
                                }}
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
                                        {shortTeamB}
                                    </span>
                                    {showPercent &&
                                        <span
                                            className={styles.percent2}
                                            status={getBStatus()}
                                        >
                                            {voteData.teamBpercent}%
                                        </span>}
                                </div>
                                <img src={teamLogos[shortTeamB]} className={styles.logoImg2} alt="TeamB" />
                            </div>
                        </div>
                    </div>
                )

            })}

        </div >
    )
}

export default Match;