const axios = require("axios");
const cheerio = require("cheerio");
const db = require("../config/firebaseConfig");

const seasons = ["spring", "summer"];
const years = Array.from({ length: 11 }, (_, i) => i + 2015); // 2015부터 2025까지

const generateURL = (year, season) => {
  if (year === 2015 && season === "spring") {
    return `https://gol.gg/tournament/tournament-ranking/Champions%20Spring%202015/`;
  } else if (year >= 2015 && year <= 2024) {
    return `https://gol.gg/tournament/tournament-ranking/LCK%20${capitalize(
      season
    )}%20${year}/`;
  } else if (year === 2025 && season === "spring") {
    return `https://gol.gg/tournament/tournament-ranking/LCK%20Cup%202025/`;
  }
  return null;
};

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const scrapeAndSave = async () => {
  for (const year of years) {
    for (const season of seasons) {
      const url = generateURL(year, season);
      if (!url) {
        console.log(`No URL for ${year} ${season}`);
        continue;
      }

      console.log(`Scraping ${year} ${season}: ${url}`);
      try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        const scrapedData = [];
        $("table tbody tr").each((index, element) => {
          const teamName = $(element).find("td a").text().trim();
          if (!teamName) return;

          const percentage = $(element)
            .find("td.text-center div.col-auto")
            .text()
            .trim();

          const wins = $(element).find("td.text-center").eq(1).text().trim();
          const losses = $(element).find("td.text-center").eq(2).text().trim();
          const game_duration = $(element)
            .find("td.text-center")
            .eq(3)
            .text()
            .trim();
          const gdm = $(element).find("td.text-center").eq(4).text().trim();

          scrapedData.push({
            teamName,
            percentage,
            wins,
            losses,
            game_duration,
            gdm,
          });
        });

        scrapedData.sort((a, b) => {
          const winRateA = parseFloat(a.percentage.replace("%", "")) || 0;
          const winRateB = parseFloat(b.percentage.replace("%", "")) || 0;

          if (winRateA !== winRateB) {
            return winRateB - winRateA;
          }

          if (a.losses !== b.losses) {
            return a.losses - b.losses;
          }

          return a.teamName.localeCompare(b.teamName);
        });

        let currentRank = 1;
        scrapedData.forEach((item, index) => {
          if (index > 0) {
            const prevItem = scrapedData[index - 1];
            if (
              parseFloat(item.percentage.replace("%", "")) !==
                parseFloat(prevItem.percentage.replace("%", "")) ||
              item.losses !== prevItem.losses
            ) {
              currentRank = index + 1;
            }
          }
          item.rank = currentRank;
        });
        const batch = db.batch();
        const rankingRef = db
          .collection("ranking")
          .doc(String(year))
          .collection(season);

        for (const item of scrapedData) {
          const docRef = rankingRef.doc(item.teamName);
          batch.set(
            docRef,
            {
              teamName: item.teamName,
              percentage: item.percentage,
              wins: item.wins,
              losses: item.losses,
              game_duration: item.game_duration,
              gdm: item.gdm,
              rank: item.rank,
            },
            { merge: true }
          );
        }

        await batch.commit();
        console.log(
          `Data for ${season} ${year} successfully scraped and saved.`
        );
      } catch (error) {
        console.error(
          `Error scraping and saving data ${year} ${season}:`,
          error.message
        );
      }
    }
  }
};

module.exports = scrapeAndSave;
