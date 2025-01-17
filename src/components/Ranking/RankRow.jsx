import React from "react";
import styles from "pages/Ranking.module.css";

const RankRow = ({
  rank,
  change,
  teamLogo,
  teamName,
  wlRecord,
  teamPoints,
}) => {
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
      <div className={styles.wlRecord}>{wlRecord}</div>
      <div className={styles.teamPoints}>{teamPoints}</div>
    </li>
  );
};

export default RankRow;
