const axios = require("axios");
const cheerio = require("cheerio");
const db = require("../config/firebaseConfig");

const scrapeAndSave = async () => {
  try {
    const response = await axios.get(
      "https://gol.gg/tournament/tournament-ranking/LCK%20Cup%202025/"
    );
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

    scrapedData.sort((a, b) => b.wins - a.wins || a.losses - b.losses);
    let currentRank = 1;

    scrapedData.forEach((item, index) => {
      if (index > 0) {
        const prevItem = scrapedData[index - 1];
        if (item.wins !== prevItem.wins || item.losses !== prevItem.losses) {
          currentRank = index + 1;
        }
      }
      item.rank = currentRank;
    });

    console.log("Scraped Data with Ranks:", scrapedData);

    const batch = db.batch();
    const rankingRef = db.collection("ranking");

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
    console.log("Data successfully scraped and saved to Firebase");
  } catch (error) {
    console.error("Error scraping and saving data:", error.message);
  }
};

module.exports = scrapeAndSave;
