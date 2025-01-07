import React from "react";
import Header from "../components/Home/Header";
import styles from "./Home.module.css";

import lcklogo from "../assets/Home/lcklogo.png";
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
import leftArrow from "../assets/Home/leftArrow.png"
import rightArrow from "../assets/Home/rightArrow.png"

const Home = () => {
    return (
        <div className={styles.HomeContainer}>
            <Header className={styles.Header} />
            <div className={styles.OnBoarding1}>
                <div className={styles.MainContainer}>
                    <span className={styles.Keyword}>LCK 승부예측</span>
                    <div className={styles.ContentContainer}>
                        <span className={styles.Content}>LCK 경기, 당신의 예측이 맞을까요? <br /> 지금 바로 도전해보세요!</span>
                        <div className={styles.PageButton}>승부예측 보러가기</div>
                    </div>
                </div>
            </div>
            <div className={styles.OnBoarding2}>
                <div className={styles.LckTeam}>
                    <div className={styles.lckContainer}>
                        <img src={lcklogo} className={styles.lcklogoimg} />
                        <span className={styles.lcktext}>2025 LCK</span>
                    </div>
                    <div className={styles.allTeamContainer}>
                        <div className={styles.teamContainer}>
                            <img src={HLE} className={styles.teamimg} />
                        </div>
                        <div className={styles.teamContainer}>
                            <img src={GEN} className={styles.teamimg} />
                        </div>
                        <div className={styles.teamContainer}>
                            <img src={T1} className={styles.teamimg} />
                        </div>
                        <div className={styles.teamContainer}>
                            <img src={DK} className={styles.teamimg} />
                        </div>
                        <div className={styles.teamContainer}>
                            <img src={KT} className={styles.teamimg} />
                        </div>
                        <div className={styles.teamContainer}>
                            <img src={BFX} className={styles.teamimg} />
                        </div>
                        <div className={styles.teamContainer}>
                            <img src={NS} className={styles.teamimg} />
                        </div>
                        <div className={styles.teamContainer}>
                            <img src={DNF} className={styles.teamimg} />
                        </div>
                        <div className={styles.teamContainer}>
                            <img src={DRX} className={styles.teamimg} />
                        </div>
                        <div className={styles.teamContainer}>
                            <img src={BRO} className={styles.teamimg} />
                        </div>
                    </div>
                </div>
                <div className={styles.ScheduleContainer}>
                    <div className={styles.MainContainer2} >
                        <span className={styles.Keyword}>LCK 일정</span>
                        <div className={styles.ContentContainer}>
                            <span className={styles.Content}>각 팀의 일정과 경기를 확인하며<br />승부의 순간을 함께하세요!</span>
                            <div className={styles.PageButton}>일정 확인하기</div>
                        </div>
                    </div>
                    <div className={styles.TodayMatchContainer}>
                        <span className={styles.todaytext}>Today Match 🔥</span>
                        <div className={styles.MatchContainer}>
                            <img src={leftArrow} className={styles.arrowImg} />
                            <div className={styles.MatchTeam}>
                                <img src={T1} className={styles.teamImg} />
                                <span className={styles.teamName}>T1</span>
                            </div>
                            <div className={styles.centerContainer}>
                                <div className={styles.timeContainer}>
                                    <span className={styles.timeText}>17:00</span>
                                </div>
                                <span className={styles.vsText}>VS</span>
                            </div>
                            <div className={styles.MatchTeam}>
                                <img src={KT} className={styles.teamImg} />
                                <span className={styles.teamName}>KT</span>
                            </div>
                            <img src={rightArrow} className={styles.arrowImg} />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Home;