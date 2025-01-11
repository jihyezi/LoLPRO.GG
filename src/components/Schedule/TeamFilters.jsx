import React from "react";
import styles from "./TeamFilters.module.css";

const TeamFilters = ({ teamLogo, teamName, onFilterSelect, isSelected }) => {
  return (
    <div className={styles.TeamFilters}>
      <div
        className={styles.filterItem}
        onClick={() => onFilterSelect(teamName)}
        style={{
          border: isSelected ? "5px solid #ffffff" : "2px solid #ffffff",
        }}
      >
        <img
          src={teamLogo}
          alt={`${teamName} Icon`}
          className={styles.teamIcon}
        />
        <div
          className={styles.teamName}
          style={{ fontWeight: isSelected ? 700 : 500 }}
        >
          {teamName}
        </div>
      </div>
    </div>
  );
};

export default TeamFilters;
