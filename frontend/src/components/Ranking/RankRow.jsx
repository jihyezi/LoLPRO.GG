import React from "react";
import styles from "pages/Ranking.module.css";
import logo from "assets/logos/2025_spring_T1.png";

const RankRow = ({
  rank,
  change,
  teamName,
  setWins,
  setLosses,
  year,
  season,
}) => {
  const matchWins = Math.floor(setWins / 3) + (setWins % 3 > 0 ? 1 : 0);
  const matchLosses = Math.floor(setLosses / 3) + (setLosses % 3 > 0 ? 1 : 0);
  const teamPoints = parseInt(setWins) - parseInt(setLosses);

  const images = require.context("assets/logos", false, /\.png$/);
  const logoPath = `./${year}_${season}_${teamName.replace(/[^\w]/g, "_")}.png`;
  let displayedLogo = logo;

  try {
    displayedLogo = images(logoPath);
  } catch (error) {
    console.warn(`Image not found: ${logoPath}. Using default logo instead.`);
  }

  return (
    <li className={styles.rankRow}>
      <div className={styles.rankNumber}>{rank}</div>
      <div className={styles.rankChange}>{change}</div>
      <div className={styles.rankTeamBox}>
        <img
          src={displayedLogo}
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
