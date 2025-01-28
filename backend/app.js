const express = require("express");
const cors = require("cors");
const rankingsRouter = require("./routes/rankingRoutes");
const matchesRouter = require("./routes/matchRoutes");
// const scrapeAndSave = require("./scraper/scraper");
const scrapeAndSave = require("./scraper/pastMatchScraper");

const app = express();
const PORT = 3000;

app.use(cors());

app.use(express.json());

app.use("/api/rankings", rankingsRouter);
app.use("/api/matches", matchesRouter);

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.get("/scrape", async (req, res) => {
  try {
    await scrapeAndSave();
    res.send("Data scraped and saved successfully!");
  } catch (error) {
    res.status(500).send("Error during scraping: " + error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
