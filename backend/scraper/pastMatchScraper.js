const axios = require("axios");
const cheerio = require("cheerio");
const db = require("../config/firebaseConfig");

const seasons = ["spring", "summer"];
const years = Array.from({ length: 11 }, (_, i) => i + 2015);

const generateURL = (year, season) => {
  if (year === 2015 && season === "spring") {
    return `https://gol.gg/tournament/tournament-matchlist/Champions%20Spring%202015/`;
  } else if (year >= 2015 && year <= 2024) {
    return `https://gol.gg/tournament/tournament-matchlist/LCK%20${capitalize(
      season
    )}%20${year}/`;
  } else if (year === 2025 && season === "spring") {
    return `https://gol.gg/tournament/tournament-matchlist/LCK%20Cup%202025/`;
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
          const matchLink =
            $(element).find("td a").attr("href")?.trim() || "N/A";
          const matchSummary = $(element).find("td a").text().trim() || "N/A";

          const matchVictoryElement = $(element).find(
            "td.text_victory, td.text-right:not(.text_defeat)"
          );
          const matchDefeatElement = $(element).find(
            "td.text_defeat, td.text-right.text_defeat"
          );
          const matchVictory = matchVictoryElement.text().trim() || "N/A";
          const matchDefeat = matchDefeatElement.text().trim() || "N/A";

          const matchResult =
            $(element).find("td.text-center").eq(0).text().trim() || "N/A";
          const matchWeek =
            $(element).find("td.text-center").eq(1).text().trim() || "N/A";
          const matchPatch =
            $(element).find("td.text-center").eq(2).text().trim() || "N/A";
          const matchDate =
            $(element).find("td.text-center").eq(3).text().trim() || "N/A";

          if (matchSummary !== "N/A") {
            scrapedData.push({
              matchLink,
              matchSummary,
              matchVictory,
              matchDefeat,
              matchResult,
              matchWeek,
              matchPatch,
              matchDate,
            });
          }
        });

        const batch = db.batch();
        const rankingRef = db
          .collection("matches")
          .doc(String(year))
          .collection(season);

        for (const item of scrapedData) {
          const docRef = rankingRef.doc(item.matchSummary);
          batch.set(
            docRef,
            {
              matchLink: item.matchLink,
              matchSummary: item.matchSummary,
              matchVictory: item.matchVictory,
              matchDefeat: item.matchDefeat,
              matchResult: item.matchResult,
              matchWeek: item.matchWeek,
              matchPatch: item.matchPatch,
              matchDate: item.matchDate,
            },
            { merge: true }
          );
        }

        await batch.commit();
        console.log(
          `Match data for ${season} ${year} successfully scraped and saved.`
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
