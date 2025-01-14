import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Header from "../components/Home/Header";
import styles from "./Prediction.module.css";
import Content from "../components/Prediction/Content";

const Prediction = () => {
    const [lckTeamref, lckTeaminView] = useInView({ threshold: 0.5, triggerOnce: false });
    const currentDate = new Date();

    const calendarItems = [
        { weekNumber: 1, startDate: new Date("2025-01-05"), endDate: new Date("2025-01-19") },
        { weekNumber: 2, startDate: new Date("2025-01-20"), endDate: new Date("2025-01-26") },
        { weekNumber: 3, startDate: new Date("2025-01-27"), endDate: new Date("2025-02-02") },
        { weekNumber: 4, startDate: new Date("2025-02-03"), endDate: new Date("2025-02-09") },
        { weekNumber: 5, startDate: new Date("2025-02-10"), endDate: new Date("2025-02-16") },
        { weekNumber: 6, startDate: new Date("2025-02-17"), endDate: new Date("2025-02-23") },
    ];

    const initialWeek = calendarItems.find(
        (week) => currentDate >= week.startDate && currentDate <= week.endDate)?.weekNumber || 0;
    const [selectedWeek, setSelectedWeek] = useState(initialWeek);

    const getGameStatus = (week) => {
        const { startDate, endDate } = week;
        if (currentDate < startDate) return "예정";
        if (currentDate >= startDate && currentDate <= endDate) return "경기중";
        if (currentDate > endDate) return "경기종료";
    }

    const handleWeekClick = (weekNumber) => {
        setSelectedWeek(weekNumber);
    };

    return (
        <div className={styles.predictionContainer}>
            <Header />
            <div>
                <motion.div
                    className={styles.titleContainer}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2 }}
                >
                    <span className={styles.cupInfo}>2025 LCK CUP</span>
                    <span className={styles.title}>승부예측</span>
                </motion.div>
                <div className={styles.calendarContainer}>
                    <div className={styles.calendarWrapper}>
                        <ul className={styles.calendarList}>
                            {calendarItems.map((week) => (
                                <li
                                    key={week.weekNumber}
                                    className={styles.weekItem1}
                                    onClick={() => handleWeekClick(week.weekNumber)}
                                    data-selected={selectedWeek === week.weekNumber ? "true" : "false"}
                                    game-status={getGameStatus(week) === "경기중" ? "true" : "false"}
                                >
                                    <span
                                        className={styles.itemTitle}
                                        game-status={getGameStatus(week) === "경기중" ? "true" : "false"}>
                                        {getGameStatus(week)}
                                    </span>
                                    <div className={styles.calenderBox}>
                                        <span
                                            className={styles.weekNumber}
                                            data-selected={selectedWeek === week.weekNumber ? "true" : "false"}>
                                            {week.weekNumber}
                                        </span>
                                        <span className={styles.weekText}>주차</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
                <div className={styles.gameContainer}>
                    <Content weekNumber={selectedWeek} />
                </div>
            </div>
        </div>
    )
}

export default Prediction;