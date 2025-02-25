import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import Header from "components/Home/Header";
import Bottom from "components/Home/Bottom";
import ScrollAnimation from "components/Home/ScrollAnimation";
import { fetchRankings } from "api/rankingApi";
import { fetchMatches } from "api/matchApi";

// Images
import lcklogo from "assets/Home/lcklogo.png";
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
import leftArrow from "assets/Home/leftArrow.png";
import rightArrow from "assets/Home/rightArrow.png";

const teamAbbreviations = {
  "Gen.G eSports": "GEN",
  "Hanwha Life eSports": "HLE",
  "Nongshim RedForce": "NS",
};

const teamAbbreviationss = {
  GEN: "Gen.G eSports",
  HLE: "Hanwha Life eSports",
  NS: "Nongshim RedForce",
};

const Home = () => {
  const [lckTeamref, lckTeaminView] = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });
  const [matchref, matchinView] = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });
  const [rankref, ranlinView] = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  const [rankings, setRankings] = useState([]);

  const [currentDate, setCurrentDate] = useState(new Date(2025, 1, 1));
  const [currentMatch, setCurrentMatch] = useState(0);
  const [direction, setDirection] = useState(0);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const getRankingData = async () => {
      setRankings([]);
      const data = await fetchRankings(2025, "spring");
      data.sort((a, b) => a.rank - b.rank);
      setRankings(data);
    };

    getRankingData();
  }, []);

  useEffect(() => {
    const getMatchData = async () => {
      setMatches([]);
      const year = currentDate.getFullYear();
      const data = await fetchMatches(year);

      data.sort((a, b) => {
        const matchIdA = parseInt(a.matchLink.match(/(\d+)/)[0], 10);
        const matchIdB = parseInt(b.matchLink.match(/(\d+)/)[0], 10);
        return matchIdA - matchIdB;
      });

      setMatches(data);
    };
    getMatchData();
  }, [currentDate]);

  const getTeamLogo = (teamName) => {
    const formattedName = teamName.replace(/[\s.]/g, "_");
    return require(`assets/logos/2025_spring_${formattedName}.png`);
  };

  const todayMatches = matches.filter(
    (match) => match.matchDate === currentDate.toISOString().split("T")[0]
  );

  const getMatchTime = (index) => {
    const matchDate = new Date(todayMatches[index].matchDate);
    const day = matchDate.getDay();

    if (day === 0 || day === 6) {
      return index === 0 ? "15:00" : "17:30";
    } else {
      return index === 0 ? "17:00" : "19:30";
    }
  };

  const handleNextMatch = () => {
    console.log(todayMatches);
    setDirection(1);
    setCurrentMatch((prev) => (prev + 1) % todayMatches.length);
  };

  const handlePrevMatch = () => {
    setDirection(-1);
    setCurrentMatch(
      (prev) => (prev - 1 + todayMatches.length) % todayMatches.length
    );
  };

  return (
    <div className={styles.homeContainer}>
      <Header />
      <div className={styles.onBoarding1}>
        <motion.div
          className={styles.wrapper}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          <span className={styles.title}>LCK 승부예측</span>
          <div className={styles.contentBox}>
            <span className={styles.description}>
              LCK 경기, 당신의 예측이 맞을까요? <br /> 지금 바로 도전해보세요!
            </span>
            <Link
              to="/prediction"
              className={styles.ctaButton}
              style={{ textDecoration: "none" }}
              target="_blank"
            >
              승부예측 보러가기
            </Link>
          </div>
        </motion.div>
      </div>
      <div className={styles.onBoarding2}>
        <motion.div
          className={styles.lckTeamContainer}
          ref={lckTeamref}
          initial={{ opacity: 0, y: 50 }}
          animate={lckTeaminView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className={styles.lckContainer}>
            <img src={lcklogo} className={styles.lcklogoimg} />
            <span className={styles.lcktext}>2025 LCK</span>
          </div>
          <div className={styles.allTeamContainer}>
            <div className={styles.teamBox}>
              <img src={HLE} className={styles.teamLogo} />
            </div>
            <div className={styles.teamBox}>
              <img src={GEN} className={styles.teamLogo} />
            </div>
            <div className={styles.teamBox}>
              <img src={T1} className={styles.teamLogo} />
            </div>
            <div className={styles.teamBox}>
              <img src={DK} className={styles.teamLogo} />
            </div>
            <div className={styles.teamBox}>
              <img src={KT} className={styles.teamLogo} />
            </div>
            <div className={styles.teamBox}>
              <img src={BFX} className={styles.teamLogo} />
            </div>
            <div className={styles.teamBox}>
              <img src={NS} className={styles.teamLogo} />
            </div>
            <div className={styles.teamBox}>
              <img src={DNF} className={styles.teamLogo} />
            </div>
            <div className={styles.teamBox}>
              <img src={DRX} className={styles.teamLogo} />
            </div>
            <div className={styles.teamBox}>
              <img src={BRO} className={styles.teamLogo} />
            </div>
          </div>
        </motion.div>
        <div className={styles.scheduleContainer}>
          <ScrollAnimation
            title={"LCK 일정"}
            description={`각 팀의 일정과 경기를 확인하며<br />승부의 순간을 함께하세요!`}
            button={"일정 확인하기"}
          />

          <motion.div
            className={styles.todayMatchContainer}
            ref={matchref}
            initial={{ opacity: 0, y: 50 }}
            animate={matchinView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            {todayMatches.length > 0 ? (
              <>
                <span className={styles.todaytext}>Today Match 🔥</span>
                <div className={styles.matchBox}>
                  {todayMatches.length > 1 && (
                    <img
                      src={leftArrow}
                      className={styles.arrowImg}
                      onClick={handlePrevMatch}
                      style={{ cursor: "pointer" }}
                      alt="이전 경기"
                    />
                  )}
                  <motion.div
                    key={currentMatch}
                    initial={{ x: direction === 1 ? 100 : -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: direction === 1 ? -100 : 100, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ display: "flex", flexDirection: "row" }}
                  >
                    {(() => {
                      const [teamA, teamB] =
                        todayMatches[currentMatch].matchSummary.split(" vs ");
                      const teamALogo = getTeamLogo(
                        teamAbbreviationss[teamA] || teamA
                      );
                      const teamBLogo = getTeamLogo(
                        teamAbbreviationss[teamB] || teamB
                      );

                      return (
                        <>
                          <div className={styles.matchTeam}>
                            <img src={teamALogo} className={styles.teamImg} />
                            <span className={styles.teamName}>{teamA}</span>
                          </div>
                          <div className={styles.centerContainer}>
                            <div className={styles.timeBox}>
                              <span className={styles.timeText}>
                                {getMatchTime(currentMatch)}
                              </span>
                            </div>
                            <span className={styles.vsText}>VS</span>
                          </div>
                          <div className={styles.matchTeam}>
                            <img src={teamBLogo} className={styles.teamImg} />
                            <span className={styles.teamName}>{teamB}</span>
                          </div>
                        </>
                      );
                    })()}
                  </motion.div>
                  {todayMatches.length > 1 && (
                    <img
                      src={rightArrow}
                      className={styles.arrowImg}
                      onClick={handleNextMatch}
                      style={{ cursor: "pointer" }}
                      alt="다음 경기"
                    />
                  )}
                </div>
              </>
            ) : (
              <div className={styles.noMatchText}>오늘 경기가 없습니다</div>
            )}
          </motion.div>
        </div>
      </div>
      <div className={styles.OnBoarding3}>
        <div className={styles.rankContainer}>
          <ScrollAnimation
            title={"LCK 순위"}
            description={
              "LCK 팀들의 치열한 순위 경쟁<br />내 팀의 위치를 확인해보세요!"
            }
            button={"순위 보러가기"}
          />
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
              {rankings.slice(0, 3).map((team, index) => {
                const matchWins =
                  Math.floor(team.wins / 3) + (team.wins % 3 > 0 ? 1 : 0);
                const matchLosses =
                  Math.floor(team.losses / 3) + (team.losses % 3 > 0 ? 1 : 0);
                const teamPoints = team.wins - team.losses;
                const teamName =
                  teamAbbreviations[team.teamName] || team.teamName;
                const teamLogo = getTeamLogo(team.teamName);

                return (
                  <li key={index} className={styles.rankRow}>
                    <div className={styles.rankNumber}>{index + 1}</div>
                    <div className={styles.rankChange}>-</div>
                    <div className={styles.rankTeamBox}>
                      <img src={teamLogo} className={styles.rankTeam} />
                      <div className={styles.teamName}>{teamName}</div>
                    </div>
                    <div className={styles.wlRecord}>
                      {matchWins}W {matchLosses}L
                    </div>
                    <div className={styles.teamPoints}>{teamPoints}</div>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </div>
      </div>
      <Bottom />
    </div>
  );
};

export default Home;
