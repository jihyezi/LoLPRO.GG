import React from "react";
import styles from "../../pages/Ranking.module.css";

const RankRow = ({ rank, change, teamLogo, teamName, setWins, setLosses }) => {
  const matchWins = Math.floor(setWins / 3) + (setWins % 3 > 0 ? 1 : 0);
  const matchLosses = Math.floor(setLosses / 3) + (setLosses % 3 > 0 ? 1 : 0);
  const teamPoints = parseInt(setWins) - parseInt(setLosses);
  return (
    <li className={styles.rankRow}>
      <div className={styles.rankNumber}>{rank}</div>
      <div className={styles.rankChange}>{change}</div>
      <div className={styles.rankTeamBox}>
        <img
          src={teamLogo}
          className={styles.rankTeam}
          alt={`${teamName} Logo`}
        />
        <div className={styles.teamName}>{teamName}</div>
      </div>
      <div className={styles.wlRecord}>
        {matchWins + "W " + matchLosses + "L"}
      </div>
      <div className={styles.teamPoints}>{teamPoints}</div>
    </li>
  );
};

export default RankRow;
