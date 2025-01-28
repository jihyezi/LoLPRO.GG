const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

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

const downloadImage = async (url, filepath) => {
  try {
    const response = await axios({
      url,
      method: "GET",
      responseType: "stream",
    });
    const writer = fs.createWriteStream(filepath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  } catch (error) {
    console.error(`Error downloading image from ${url}:`, error.message);
  }
};

const scrapeAndDownloadLogos = async () => {
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

        const teamLinks = $("table tbody tr td a");
        for (const linkElement of teamLinks) {
          const teamName = $(linkElement).text().trim();
          let teamPageHref = $(linkElement).attr("href");

          if (!teamName || !teamPageHref) continue;

          if (teamPageHref.startsWith("..")) {
            teamPageHref = teamPageHref.replace(/^\.{2}/, "");
          }

          const teamPageURL = `https://gol.gg${teamPageHref}`;
          console.log(`Fetching logo for ${teamName} from ${teamPageURL}`);

          const teamPageResponse = await axios.get(teamPageURL);
          const teamPageHtml = teamPageResponse.data;
          const $$ = cheerio.load(teamPageHtml);

          let logoSrc = $$("figure img.team_icon").attr("src");
          if (!logoSrc) {
            console.log(`No logo found for ${teamName}`);
            continue;
          }

          if (logoSrc.startsWith("..")) {
            logoSrc = logoSrc.replace(/^\.{2}/, "");
          }

          const logoURL = `https://gol.gg${logoSrc}`;
          const filename = `${year}_${season}_${teamName.replace(
            /[^\w]/g,
            "_"
          )}.png`;
          const filepath = path.join(__dirname, "logos", filename);

          if (!fs.existsSync(path.join(__dirname, "logos"))) {
            fs.mkdirSync(path.join(__dirname, "logos"));
          }

          await downloadImage(logoURL, filepath);
          console.log(`Logo saved: ${filepath}`);
        }
      } catch (error) {
        console.error(
          `Error scraping and downloading logos for ${year} ${season}:`,
          error.message
        );
      }
    }
  }
};

scrapeAndDownloadLogos();
