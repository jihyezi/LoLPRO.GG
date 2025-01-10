import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import styles from "./Ranking.module.css";
import Header from "../components/Home/Header";
import RankRow from "../components/Ranking/RankRow";

// Images
import RankingHeader from "../assets/ranking.png";
import down from "../assets/down.png";
import HLE from "../assets/Home/HLE.png";
import GEN from "../assets/Home/GEN.png";
import T1 from "../assets/Home/T1.png";
import DK from "../assets/Home/DK.png";
import KT from "../assets/Home/KT.png";
import BFX from "../assets/Home/BFX.png";
import NS from "../assets/Home/NS.png";
import DNF from "../assets/Home/DNF.png";
import DRX from "../assets/Home/DRX.png";
import BRO from "../assets/Home/BRO.png";

const Ranking = () => {
  const [rankref, ranlinView] = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  const teams = [
    { rank: 1, change: "-", logo: T1, name: "T1", wl: "17W 0L", points: 32 },
    { rank: 2, change: "-", logo: HLE, name: "HLE", wl: "14W 4L", points: 19 },
    { rank: 3, change: "-", logo: GEN, name: "GEN", wl: "11W 7L", points: 13 },
    { rank: 4, change: "-", logo: DK, name: "DK", wl: "9W 9L", points: 6 },
    { rank: 5, change: "-", logo: KT, name: "KT", wl: "8W 10L", points: -2 },
    { rank: 6, change: "-", logo: BFX, name: "BFX", wl: "11W 7L", points: 13 },
    { rank: 7, change: "-", logo: DNF, name: "DNF", wl: "11W 7L", points: 13 },
    { rank: 8, change: "-", logo: NS, name: "NS", wl: "11W 7L", points: 13 },
    { rank: 9, change: "-", logo: DRX, name: "DRX", wl: "11W 7L", points: 13 },
    { rank: 10, change: "-", logo: BRO, name: "BRO", wl: "11W 7L", points: 13 },
  ];

  return (
    <div className={styles.RankingContainer}>
      <Header />
      {/* <img src={RankingHeader} className={styles.RankingHeader} alt="Ranking Header" /> */}
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
            <span className={styles.seasonTitle}>2024 LCK 서머</span>
            <img src={down} className={styles.downImg} alt="Dropdown" />
          </div>
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
                {teams.map((team) => (
                  <RankRow
                    key={team.rank}
                    rank={team.rank}
                    change={team.change}
                    teamLogo={team.logo}
                    teamName={team.name}
                    wlRecord={team.wl}
                    teamPoints={team.points}
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
