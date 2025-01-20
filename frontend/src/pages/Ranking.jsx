import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { fetchRankings } from "../api/rankingApi";
import styles from "./Ranking.module.css";
import Header from "../components/Home/Header";
import RankRow from "../components/Ranking/RankRow";

// Images
import RankingHeader from "../assets/ranking.jpg";
import down from "../assets/down.png";
import up from "../assets/up.png";
import HLE from "../assets/Team/HLE.png";
import GEN from "../assets/Team/GEN.png";
import T1 from "../assets/Team/T1.png";
import DK from "../assets/Team/DK.png";
import KT from "../assets/Team/KT.png";
import BFX from "../assets/Team/BFX.png";
import NS from "../assets/Team/NS.png";
import DNF from "../assets/Team/DNF.png";
import DRX from "../assets/Team/DRX.png";
import BRO from "../assets/Team/BRO.png";

const Ranking = () => {
  const [rankref, ranlinView] = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState({
    year: 2025,
    season: "spring",
    name: "2025 LCK 스프링",
  });
  const [rankings, setRankings] = useState([]);

  const seasons = [
    { year: 2015, season: "spring", name: "2015 LCK 스프링" },
    { year: 2015, season: "summer", name: "2015 LCK 서머" },
    { year: 2016, season: "spring", name: "2016 LCK 스프링" },
    { year: 2016, season: "summer", name: "2016 LCK 서머" },
    { year: 2017, season: "spring", name: "2017 LCK 스프링" },
    { year: 2017, season: "summer", name: "2017 LCK 서머" },
    { year: 2018, season: "spring", name: "2018 LCK 스프링" },
    { year: 2018, season: "summer", name: "2018 LCK 서머" },
    { year: 2019, season: "spring", name: "2019 LCK 스프링" },
    { year: 2019, season: "summer", name: "2019 LCK 서머" },
    { year: 2020, season: "spring", name: "2020 LCK 스프링" },
    { year: 2020, season: "summer", name: "2020 LCK 서머" },
    { year: 2021, season: "spring", name: "2021 LCK 스프링" },
    { year: 2021, season: "summer", name: "2021 LCK 서머" },
    { year: 2022, season: "spring", name: "2022 LCK 스프링" },
    { year: 2022, season: "summer", name: "2022 LCK 서머" },
    { year: 2023, season: "spring", name: "2023 LCK 스프링" },
    { year: 2023, season: "summer", name: "2023 LCK 서머" },
    { year: 2024, season: "spring", name: "2024 LCK 스프링" },
    { year: 2024, season: "summer", name: "2024 LCK 서머" },
    { year: 2025, season: "spring", name: "2025 LCK 스프링" },
  ];

  useEffect(() => {
    const getRankingData = async () => {
      const data = await fetchRankings(
        selectedSeason.year,
        selectedSeason.season
      );
      data.sort((a, b) => a.rank - b.rank);
      setRankings(data);
    };

    getRankingData();
    console.log("rankings", rankings);
  }, [selectedSeason]);

  const handleBackgroundClick = () => {
    if (dropdownOpen) {
      setDropdownOpen(false);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleSeasonSelect = (season) => {
    setSelectedSeason(season);
    setDropdownOpen(false);
  };

  return (
    <div className={styles.RankingContainer} onClick={handleBackgroundClick}>
      <Header />
      {/* <img
        src={RankingHeader}
        className={styles.RankingHeader}
        alt="Ranking Header"
      /> */}
      <div className={styles.RankingWrapper}>
        <div className={styles.titleContainer}>
          <span className={styles.title}>LCK 순위</span>
          <br />
          <span className={styles.subtitle}>
            좋아하는 팀의 순위를 확인해보세요!
          </span>
        </div>
        <div className={styles.seasonContainer}>
          <div className={styles.seasonHeader}>
            <span className={styles.seasonTitle}>{selectedSeason.name}</span>
            <img
              src={dropdownOpen ? up : down}
              className={styles.downImg}
              alt="Dropdown"
              onClick={toggleDropdown}
            />
          </div>
          {dropdownOpen && (
            <div className={styles.dropdownMenu}>
              {seasons.map((season, index) => (
                <div
                  key={index}
                  className={styles.dropdownItem}
                  onClick={() => handleSeasonSelect(season)}
                >
                  {season.name}
                </div>
              ))}
            </div>
          )}
          <div className={styles.rankContainer}>
            <motion.div
              className={styles.rankBox}
              ref={rankref}
              initial={{ opacity: 0, y: 50 }}
              animate={ranlinView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <ul className={styles.rankList}>
                <li className={styles.rankHeader}>
                  <div className={styles.headerRank}>Rank</div>
                  <div className={styles.headerTeam}>Team</div>
                  <div className={styles.headerWL}>W-L</div>
                  <div className={styles.headerPoints}>Point</div>
                </li>
                {rankings.map((team) => (
                  <RankRow
                    key={team.rank}
                    rank={team.rank}
                    teamLogo={team.logo}
                    teamName={team.teamName}
                    setWins={team.wins}
                    setLosses={team.losses}
                  />
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ranking;
