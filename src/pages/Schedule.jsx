import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Header from "../components/Home/Header";
import styles from "./Schedule.module.css";
import TeamFilters from "../components/Schedule/TeamFilters";

// Images
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
import MENU from "../assets/menu.png";
import leftArrow from "../assets/Home/leftArrow.png";
import rightArrow from "../assets/Home/rightArrow.png";
import calendar from "../assets/calendar.png";

const Schedule = () => {
  const [scheduleref, schedulelinView] = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  const [currentDate, setCurrentDate] = useState(new Date(2025, 0));
  const [selectedTeam, setSelectedTeam] = useState("전체");
  const teams = [
    { logo: MENU, name: "전체" },
    { logo: T1, name: "T1" },
    { logo: HLE, name: "HLE" },
    { logo: GEN, name: "GEN" },
    { logo: DK, name: "DK" },
    { logo: KT, name: "KT" },
    { logo: BFX, name: "BFX" },
    { logo: DNF, name: "DNF" },
    { logo: NS, name: "NS" },
    { logo: DRX, name: "DRX" },
    { logo: BRO, name: "BRO" },
  ];

  const calendarRef = useRef(null);

  const exampleEvents = [
    { year: 2025, month: 0, date: 8, time: "17:00", match: "T1 vs KT" },
    { year: 2025, month: 0, date: 9, time: "19:00", match: "HLE vs GEN" },
    { year: 2025, month: 0, date: 9, time: "21:00", match: "T1 vs BRO" },
    { year: 2025, month: 0, date: 12, time: "15:00", match: "T1 vs BFX" },
    { year: 2025, month: 1, date: 12, time: "15:00", match: "T1 vs BFX" },
  ];

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  useEffect(() => {
    generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
  }, [currentDate, selectedTeam]);

  const generateCalendar = (year, month) => {
    if (!calendarRef.current) return;
    const calendarBody = calendarRef.current;
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let html = "";
    let date = 1;

    for (let i = 0; i < 6; i++) {
      let row = "<tr>";
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          row += "<td></td>";
        } else if (date > daysInMonth) {
          break;
        } else {
          const today = new Date();
          const isToday =
            date === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();
          const todayIndicator = isToday
            ? `<span class="${styles.todayIndicator}"></span>`
            : "";
          row += `<td>${todayIndicator}${date}</td>`;
          date++;
        }
      }
      row += "</tr>";
      html += row;
      if (date > daysInMonth) break;
    }

    calendarBody.innerHTML = html;

    const filteredEvents = exampleEvents.filter((event) => {
      if (selectedTeam === "전체") return true;
      return event.match.includes(selectedTeam);
    });

    filteredEvents.forEach((event) => {
      const cells = calendarBody.querySelectorAll("td");
      cells.forEach((cell) => {
        const cellDate =
          cell.firstChild && parseInt(cell.firstChild.textContent);
        if (
          cellDate === event.date &&
          month === event.month &&
          year === event.year
        ) {
          const eventDiv = document.createElement("div");
          eventDiv.classList.add("event");

          const timeSpan = document.createElement("span");
          timeSpan.textContent = event.time;
          timeSpan.style.marginRight = "10px";

          const matchSpan = document.createElement("span");
          matchSpan.textContent = event.match;

          eventDiv.appendChild(timeSpan);
          eventDiv.appendChild(matchSpan);

          eventDiv.style.backgroundColor = "#8e69f4";
          eventDiv.style.color = "#ffffff";
          eventDiv.style.borderRadius = "8px";
          eventDiv.style.padding = "5px";
          eventDiv.style.textAlign = "center";
          eventDiv.style.fontWeight = "500";
          eventDiv.style.fontSize = "14px";

          let eventContainer = cell.querySelector(".event-container");
          if (!eventContainer) {
            eventContainer = document.createElement("div");
            eventContainer.classList.add("event-container");

            eventContainer.style.display = "flex";
            eventContainer.style.flexDirection = "column";
            eventContainer.style.gap = "4px";
            cell.appendChild(eventContainer);
          }

          eventContainer.appendChild(eventDiv);
        }
      });
    });
  };

  const scrollContainerRef = useRef(null);

  const handleMouseDown = (e) => {
    const container = scrollContainerRef.current;
    container.isDragging = true;
    container.startX = e.pageX - container.offsetLeft;
    container.scrollLeftStart = container.scrollLeft;
  };

  const handleMouseMove = (e) => {
    const container = scrollContainerRef.current;
    if (!container.isDragging) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const scrollDistance = container.startX - x;
    container.scrollLeft = container.scrollLeftStart + scrollDistance;
  };

  const handleMouseUp = () => {
    const container = scrollContainerRef.current;
    container.isDragging = false;
  };

  return (
    <div className={styles.ScheduleContainer}>
      <Header />
      {/* <div className={styles.ScheduleWrapper}> */}
      <motion.div
        className={styles.rankBox}
        ref={scheduleref}
        initial={{ opacity: 0, y: 50 }}
        animate={schedulelinView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <div className={styles.ScheduleHeader}>
          <img
            style={{ marginRight: "20px" }}
            src={leftArrow}
            className={styles.arrowImg}
            onClick={handlePrevMonth}
            alt="Previous Month"
          />
          <span className={styles.date}>
            {currentDate.getFullYear()}.{currentDate.getMonth() + 1}
          </span>
          <img
            src={calendar}
            className={styles.calendarImg}
            onClick={handleToday}
            alt="Today"
          />
          <img
            style={{ marginLeft: "20px" }}
            src={rightArrow}
            className={styles.arrowImg}
            onClick={handleNextMonth}
            alt="Next Month"
          />
        </div>
        <div className={styles.TeamFiltersWrapper}>
          <div
            className={styles.TeamFiltersScrollContainer}
            ref={scrollContainerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {teams.map((team) => (
              <TeamFilters
                key={team.name}
                teamLogo={team.logo}
                teamName={team.name}
                onFilterSelect={(teamName) => {
                  setSelectedTeam(teamName);
                }}
                isSelected={selectedTeam === team.name}
              />
            ))}
          </div>
        </div>
        <table className={styles.calendar}>
          <thead>
            <tr>
              <th>일</th>
              <th>월</th>
              <th>화</th>
              <th>수</th>
              <th>목</th>
              <th>금</th>
              <th>토</th>
            </tr>
          </thead>
          <tbody ref={calendarRef}></tbody>
        </table>
      </motion.div>
    </div>
  );
};

export default Schedule;
