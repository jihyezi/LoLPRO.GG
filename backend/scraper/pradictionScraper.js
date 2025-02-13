const axios = require("axios");
const cheerio = require("cheerio");
const db = require("../config/firebaseConfig");

const seasons = ["lck cup"];
const years = [2025]; // 2025년만 실행하도록 설정

const generateURL = (year, season) => {
    if (year === 2025 && season === "lck cup") {
        return `https://gol.gg/tournament/tournament-matchlist/LCK%20Cup%202025/`;
    }
    return null;
};

const predictionScape = async () => {
    for (const year of years) {
        for (const season of seasons) {
            const url = generateURL(year, season);
            if (!url) {
                console.log(`No URL for ${year} ${season}`);
                continue;
            }
            console.log(`🔍 Scraping ${year} ${season}: ${url}`);

            try {
                const response = await axios.get(url);
                const html = response.data;
                const $ = cheerio.load(html);

                const scrapedData = [];
                $("table tbody tr").each((index, element) => {
                    // ✅ 팀 정보 가져오기
                    const teamsText = $(element).find("td.text-left a").text().trim();
                    const teams = teamsText.split(" vs ");

                    const teamA = teams[0].trim();
                    const teamB = teams[1].trim();

                    // ✅ 경기 결과 추출 (예: "2 - 1")
                    const scoreText = $(element).find("td.text-center").eq(0).text().trim();
                    const scores = scoreText.match(/\d+/g);

                    // ✅ 점수가 없으면 null, 있으면 숫자로 변환
                    const teamA_score =
                        scores && scores.length > 0
                            ? Number(scores[0]) !== 0 || Number(scores[1]) !== 0
                                ? Number(scores[0])
                                : null
                            : null;
                    const teamB_score =
                        scores && scores.length > 1
                            ? Number(scores[0]) !== 0 || Number(scores[1]) !== 0
                                ? Number(scores[1])
                                : null
                            : null;

                    // ✅ 주차 정보 (예: "WEEK2" → "week2")
                    const matchWeekText = $(element).find("td.text-center").eq(1).text().trim() || "N/A";
                    const matchWeek = matchWeekText ? matchWeekText.toLowerCase() : "unknown";

                    // ✅ 날짜 가져오기
                    const matchDate = $(element).find("td.text-center").eq(3).text().trim() || "N/A";

                    // ✅ Firestore 저장 데이터 구조
                    const matchData = {
                        date: matchDate, // 🔹 Firestore에 문자열 그대로 저장
                        teamA,
                        teamB,
                        result: {
                            teamA_score,
                            teamB_score,
                        },
                    };

                    // 경기 데이터를 scrapedData 배열에 저장
                    scrapedData.push({
                        date: matchDate, // 날짜로 정렬을 위한 데이터 저장
                        matchWeek, // 주차 정보 저장
                        matchData,
                    });

                    // 🛠 디버깅용 콘솔 출력
                    console.log(`📌 Match ${teamA} vs ${teamB}:`, matchData);
                });

                if (scrapedData.length === 0) {
                    console.log(`⚠️ No data scraped for ${year} ${season}`);
                    continue;
                }

                // ✅ 경기 날짜 기준 정렬 (오래된 경기부터 먼저)
                scrapedData.sort((a, b) => new Date(a.date) - new Date(b.date));

                // ✅ 첫 번째 경기 날짜 (2025년 1월 15일) 기준으로 주차 계산
                const firstMatchDate = new Date("2025-01-15");
                const matchesByWeek = {};

                // ✅ 날짜별 경기 그룹화
                scrapedData.forEach((match) => {
                    const matchDate = new Date(match.date);
                    const diffInTime = matchDate - firstMatchDate;  // 첫 경기와 현재 경기 간의 시간 차
                    let weekNumber = Math.floor(diffInTime / (1000 * 3600 * 24 * 7)) + 1;
                    if (weekNumber <= 0) weekNumber = 1;

                    const weekKey = `week${weekNumber}`;
                    if (!matchesByWeek[weekKey]) matchesByWeek[weekKey] = [];

                    matchesByWeek[weekKey].push(match);
                });

                // ✅ Firestore에 저장
                const batch = db.batch();
                let matchIndex = 1;

                const matchesByDate = {};

                // ✅ 날짜별 경기 그룹화
                scrapedData.forEach((match) => {
                    const matchDateStr = match.date;
                    if (!matchesByDate[matchDateStr]) {
                        matchesByDate[matchDateStr] = [];
                    }
                    matchesByDate[matchDateStr].push(match);
                });

                console.log("matchesByDate", matchesByDate); // 디버깅

                // 주차별, 날짜별로 경기 저장
                // 주차별, 날짜별로 경기 저장
                for (const [weekKey, matches] of Object.entries(matchesByWeek)) {
                    matches.forEach((match, i) => {
                        const matchDate = new Date(match.date);

                        // 날짜별로 matchIndex를 0과 1로 할당하여 시간 계산
                        const matchesOnDate = matchesByDate[match.date];
                        const matchIndexForDate = matchesOnDate.indexOf(match);

                        // 해당 날짜에 맞는 시간 계산 (0: 첫 번째 경기, 1: 두 번째 경기)
                        const matchTime = getTimeForMatch(matchIndexForDate, match.date);

                        const matchId = `match_${(matchIndex).toString().padStart(2, "0")}`;
                        const matchRef = db.doc(`prediction/lck_cup/${weekKey}/${matchId}`);
                        batch.set(
                            matchRef,
                            {
                                date: match.matchData.date,
                                time: matchTime,
                                teamA: match.matchData.teamA,
                                teamB: match.matchData.teamB,
                                result: match.matchData.result,
                                week: weekKey, // 주차 정보 포함
                            },
                            { merge: true }
                        );

                        matchIndex++;
                    });
                }


                // 디버깅 출력
                console.log("Final matchesByDate:", matchesByDate);

                await batch.commit();
            } catch (error) {
                console.error(
                    `❌ Error scraping and saving data ${year} ${season}:`,
                    error.message
                );
            }
        }
    }
};

// 주말/평일 시간 설정 함수
const getTimeForMatch = (matchIndex, date) => {
    const matchDate = new Date(date);
    const dayOfWeek = matchDate.getDay(); // 0: 일요일, 1: 월요일, ..., 6: 토요일

    // 주말, 평일에 따라 다른 시간 설정
    if (dayOfWeek === 0 || dayOfWeek === 6) { // 주말 (일요일, 토요일)
        return matchIndex === 0 ? "15:00" : "17:30"; // 첫 번째 경기 15시, 두 번째 경기 17시30분
    } else { // 평일 (월요일 ~ 금요일)
        return matchIndex === 0 ? "17:00" : "19:30"; // 첫 번째 경기 17시, 두 번째 경기 19시30분
    }
};

module.exports = predictionScape;
