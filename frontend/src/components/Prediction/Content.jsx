import React, { useState } from "react";
import styles from "./Content.module.css"

import HLE from "../../assets/Team/HLE.png";
import GEN from "../../assets/Team/GEN.png";
import T1 from "../../assets/Team/T1.png";
import DK from "../../assets/Team/DK.png";
import KT from "../../assets/Team/KT.png";
import BFX from "../../assets/Team/BFX.png";
import NS from "../../assets/Team/NS.png";
import DNF from "../../assets/Team/DNF.png";
import DRX from "../../assets/Team/DRX.png";
import BRO from "../../assets/Team/BRO.png";
import HLE_off from "../../assets/Team/HLE_off.png";
import GEN_off from "../../assets/Team/GEN_off.png";
import T1_off from "../../assets/Team/T1_off.png";
import DK_off from "../../assets/Team/DK_off.png";
import KT_off from "../../assets/Team/KT_off.png";
import BFX_off from "../../assets/Team/BFX_off.png";
import NS_off from "../../assets/Team/NS_off.png";
import DNF_off from "../../assets/Team/DNF_off.png";
import DRX_off from "../../assets/Team/DRX_off.png";
import BRO_off from "../../assets/Team/BRO_off.png";

const Content = ({ weekNumber }) => {

    const initialGameData = {
        1: [
            {
                date: "2025-01-15",
                time: "17:00",
                teamA: ["BRO", BRO],
                teamB: ["DRX", DRX],
                percent: ["73", "27"],
                result: ["2", "1"],
                matchStatus: false,
                inVoted: null
            },
            {
                date: "2025-01-15",
                time: "19:00",
                teamA: ["DNF", DNF],
                teamB: ["NS", NS],
                percent: ["66", "34"],
                result: ["0", "2"],
                matchStatus: false,
                inVoted: "teamB"
            },
            {
                date: "2025-01-15",
                time: "19:00",
                teamA: ["HLE", HLE],
                teamB: ["GEN", GEN],
                percent: ["49", "51"],
                result: ["1", "2"],
                matchStatus: false,
                inVoted: "teamA"
            },
            {
                date: "2025-01-16",
                time: "17:00",
                teamA: ["BFX", BFX],
                teamB: ["KT", KT],
                percent: [73, 27],
                result: null,
                matchStatus: true,
                inVoted: "teamA"
            },
            {
                date: "2025-01-16",
                time: "19:00",
                teamA: ["T1", T1],
                teamB: ["DK", DK],
                percent: [73, 27],
                result: null,
                matchStatus: true,
                inVoted: null
            },
        ]
    }

    const [gameData, setGameData] = useState(initialGameData);

    const handleTeamClick = (week, gameIndex, team) => {
        setGameData((prevGameData) => {
            const updatedWeekData = [...prevGameData[week]];
            updatedWeekData[gameIndex] = {
                ...updatedWeekData[gameIndex],
                inVoted: team,
            };
            return {
                ...prevGameData,
                [week]: updatedWeekData,
            };
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

    const currentWeekData = gameData[weekNumber] || [];

    return (
        <div className={styles.contentContainer}>
            {currentWeekData.map((game, index) => {
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
                            <span className={styles.dateText}>{game.date}</span>
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