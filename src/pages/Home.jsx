import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import styles from "./Home.module.css";
import Header from "../components/Home/Header";
import Bottom from "../components/Home/Bottom";
import ScrollAnimation from "../components/Home/ScrollAnimation";

// Images
import lcklogo from "../assets/Home/lcklogo.png";
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
import leftArrow from "../assets/Home/leftArrow.png"
import rightArrow from "../assets/Home/rightArrow.png"


const Home = () => {
    const [lckTeamref, lckTeaminView] = useInView({ threshold: 0.5, triggerOnce: false });
    const [matchref, matchinView] = useInView({ threshold: 0.5, triggerOnce: false });
    const [rankref, ranlinView] = useInView({ threshold: 0.5, triggerOnce: false });

    return (
        <div className={styles.homeContainer}>
            <Header />
            <div className={styles.onBoarding1} >
                <motion.div
                    className={styles.wrapper}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2 }}
                >
                    <span className={styles.title}>LCK 승부예측</span>
                    <div className={styles.contentBox}>
                        <span className={styles.description}>LCK 경기, 당신의 예측이 맞을까요? <br /> 지금 바로 도전해보세요!</span>
                        <div className={styles.ctaButton}>승부예측 보러가기</div>
                    </div>
                </motion.div>
            </div>
            <div className={styles.onBoarding2}>
                <motion.div
                    className={styles.lckTeamContainer}
                    ref={lckTeamref}
                    initial={{ opacity: 0, y: 50 }}
                    animate={lckTeaminView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}>
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
                    <ScrollAnimation title={"LCK 일정"} description={`각 팀의 일정과 경기를 확인하며<br />승부의 순간을 함께하세요!`} button={"일정 확인하기"} />
                    <motion.div
                        className={styles.todayMatchContainer}
                        ref={matchref}
                        initial={{ opacity: 0, y: 50 }}
                        animate={matchinView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8 }}>
                        <span className={styles.todaytext}>Today Match 🔥</span>
                        <div className={styles.matchBox}>
                            <img src={leftArrow} className={styles.arrowImg} />
                            <div className={styles.matchTeam}>
                                <img src={T1} className={styles.teamImg} />
                                <span className={styles.teamName}>T1</span>
                            </div>
                            <div className={styles.centerContainer}>
                                <div className={styles.timeBox}>
                                    <span className={styles.timeText}>17:00</span>
                                </div>
                                <span className={styles.vsText}>VS</span>
                            </div>
                            <div className={styles.matchTeam}>
                                <img src={KT} className={styles.teamImg} />
                                <span className={styles.teamName}>KT</span>
                            </div>
                            <img src={rightArrow} className={styles.arrowImg} />
                        </div>
                    </motion.div>
                </div>
            </div>
            <div className={styles.OnBoarding3}>
                <div className={styles.rankContainer}>
                    <ScrollAnimation title={"LCK 순위"} description={"LCK 팀들의 치열한 순위 경쟁<br />내 팀의 위치를 확인해보세요!"} button={"순위 보러가기"} />
                    <motion.div
                        className={styles.rankBox}
                        ref={rankref}
                        initial={{ opacity: 0, y: 50 }}
                        animate={ranlinView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8 }}>
                        <ul className={styles.rankList}>
                            <li className={styles.rankHeader}>
                                <div className={styles.headerRank}>Rank</div>
                                <div className={styles.headerTeam}>Team</div>
                                <div className={styles.headerWL}>W-L</div>
                                <div className={styles.headerPoints}>Point</div>
                            </li>
                            <li className={styles.rankRow}>
                                <div className={styles.rankNumber}>1</div>
                                <div className={styles.rankChange}>-</div>
                                <div className={styles.rankTeamBox}>
                                    <img src={T1} className={styles.rankTeam} />
                                    <div className={styles.teamName}>T1</div>
                                </div>
                                <div className={styles.wlRecord}>17W 0L</div>
                                <div className={styles.teamPoints}>32</div>
                            </li>
                            <li className={styles.rankRow}>
                                <div className={styles.rankNumber}>2</div>
                                <div className={styles.rankChange}>-</div>
                                <div className={styles.rankTeamBox}>
                                    <img src={HLE} className={styles.rankTeam} />
                                    <div className={styles.teamName}>HLE</div>
                                </div>
                                <div className={styles.wlRecord}>14W 4L</div>
                                <div className={styles.teamPoints}>19</div>
                            </li>
                            <li className={styles.rankRow}>
                                <div className={styles.rankNumber}>3</div>
                                <div className={styles.rankChange}>-</div>
                                <div className={styles.rankTeamBox}>
                                    <img src={GEN} className={styles.rankTeam} />
                                    <div className={styles.teamName}>GEN</div>
                                </div>
                                <div className={styles.wlRecord}>11W 7L</div>
                                <div className={styles.teamPoints}>13</div>
                            </li>
                        </ul>
                    </motion.div>
                </div>
            </div>
            <Bottom />
        </div>
    )
}

export default Home;