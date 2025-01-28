import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { fetchMatches } from "../api/matchApi";
import Header from "../components/Home/Header";
import styles from "./Match.module.css";
import TeamFilters from "../components/Schedule/TeamFilters";

// Images
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
import MENU from "../assets/menu.png";
import leftArrow from "../assets/Home/leftArrow.png";
import rightArrow from "../assets/Home/rightArrow.png";
import calendar from "../assets/calendar.png";

const Match = () => {
  const [matchRef, matchInView] = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  const [currentDate, setCurrentDate] = useState(new Date(2025, 0));
  const [selectedTeam, setSelectedTeam] = useState("전체");
  const [activeEvent, setActiveEvent] = useState(null);
  const teams = [
    { logo: MENU, name: "전체" },
    { logo: T1, name: "T1" },
    { logo: HLE, name: "HLE" },
    { logo: GEN, name: "GEN" },
    { logo: DK, name: "Dplus KIA" },
    { logo: KT, name: "KT Rolster" },
    { logo: BFX, name: "BNK FearX" },
    { logo: DNF, name: "DN Freecs" },
    { logo: NS, name: "NS" },
    { logo: DRX, name: "DRX" },
    { logo: BRO, name: "OK BRION" },
  ];

  const calendarRef = useRef(null);

  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const getMatchData = async () => {
      setMatches([]);
      const year = currentDate.getFullYear();
      const data = await fetchMatches(year);
      setMatches(data);
    };
    getMatchData();
  }, [currentDate.getFullYear()]);

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
  }, [selectedTeam, matches, currentDate]);

  const filteredMatches = matches.filter((match) => {
    if (selectedTeam === "전체") {
      return true;
    }
    const teamsInMatch = match.id.split(" vs ");
    return teamsInMatch.some((team) => team.includes(selectedTeam));
  });

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

    filteredMatches.forEach((match) => {
      const matchDate = new Date(match.matchDate);
      const matchDay = matchDate.getDate();

      const cells = calendarBody.querySelectorAll("td");
      cells.forEach((cell) => {
        const cellDate =
          cell.firstChild && parseInt(cell.firstChild.textContent);
        if (
          cellDate === matchDay &&
          month === matchDate.getMonth() &&
          year === matchDate.getFullYear()
        ) {
          const eventDiv = document.createElement("div");
          eventDiv.classList.add("event");
          eventDiv.style.cursor = "pointer";

          // const timeSpan = document.createElement("span");
          // timeSpan.textContent = event.time;
          // timeSpan.style.marginRight = "10px";

          const matchSpan = document.createElement("span");
          matchSpan.textContent = match.matchSummary;

          // eventDiv.appendChild(timeSpan);
          eventDiv.appendChild(matchSpan);

          eventDiv.style.backgroundColor = "#8e69f4";
          eventDiv.style.color = "#ffffff";
          eventDiv.style.borderRadius = "8px";
          eventDiv.style.padding = "5px";
          eventDiv.style.textAlign = "center";
          eventDiv.style.fontWeight = "500";
          eventDiv.style.fontSize = "14px";
          eventDiv.onclick = () => handleEventClick(match, eventDiv);

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

  const handleEventClick = (match, eventDiv) => {
    const matchSummary = match.matchSummary;
    const teams = matchSummary.split(" vs ");

    const matchResult = match.matchResult;
    const results = matchResult.split(" - ");

    const eventId = match.matchSummary;

    const currentActiveEvent = activeEvent;
    const isActive = currentActiveEvent === eventId;

    if (isActive) {
      eventDiv.style.backgroundColor = "#8e69f4";
      eventDiv.innerHTML = `<span style="color: white;">${matchSummary}</span>`;
      setActiveEvent(null);
    } else {
      eventDiv.style.backgroundColor = "white";
      eventDiv.style.fontWeight = "600";
      const baronTeam = teams[0];
      const baronResult = parseInt(results[0], 10);
      const elderDragonTeam = teams[1];
      const elderDragonResult = parseInt(results[1], 10);

      const baronColor =
        baronResult > elderDragonResult ? "#00920E" : "#BC4247";
      const elderDragonColor =
        elderDragonResult > baronResult ? "#00920E" : "#BC4247";

      eventDiv.innerHTML = `
        <span style="color: ${baronColor};">${baronTeam} ${baronResult}</span>
        <span style="color: #3C3C41;"> / </span>
        <span style="color: ${elderDragonColor};">${elderDragonResult} ${elderDragonTeam}</span>`;

      setActiveEvent(eventId);
    }
  };

  const handleTeamSelect = (teamName) => {
    setSelectedTeam(teamName);
    generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
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
    <div className={styles.matchContainer}>
      <Header />
      {/* <div className={styles.matchWrapper}> */}
      <motion.div
        className={styles.rankBox}
        ref={matchRef}
        initial={{ opacity: 0, y: 50 }}
        animate={matchInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <div className={styles.matchHeader}>
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
                onFilterSelect={handleTeamSelect}
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

export default Match;
