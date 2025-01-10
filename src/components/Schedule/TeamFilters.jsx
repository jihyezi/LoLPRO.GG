import React from "react";
import styles from "./TeamFilters.module.css"; // CSS 파일을 따로 만들어 사용할 수 있습니다.

const TeamFilters = ({ teamLogo, teamName, onFilterSelect }) => {
  return (
    <div className={styles.TeamFilters}>
      <div
        className={styles.filterItem}
        onClick={() => onFilterSelect(teamName)}
      >
        <img
          src={teamLogo}
          alt={`${teamName} Icon`}
          className={styles.teamIcon}
        />
        <div className={styles.teamName}>{teamName}</div>
      </div>
    </div>
  );
};

export default TeamFilters;
