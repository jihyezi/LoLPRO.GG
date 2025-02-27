const express = require("express");
const cors = require("cors");

const rankingsRouter = require("./routes/rankingRoutes");
const matchesRouter = require("./routes/matchRoutes");
const predictionRouter = require("./routes/predictionRoutes");

const scrapeAndSave = require("./scraper/pastMatchScraper");
const predictionScape = require("./scraper/pradictionScraper");

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  "http://localhost:3000",
  "https://lolpro-gg.vercel.app",
];

// app.use(cors());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());

app.use("/api/rankings", rankingsRouter);
app.use("/api/matches", matchesRouter);
app.use("/api/prediction", predictionRouter);

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.get("/scrape", async (req, res) => {
  try {
    res.send("Scraping started...");
    setTimeout(async () => {
      await predictionScape();
      await scrapeAndSave();
      console.log("Data scraped and saved successfully!");
    }, 1000);
  } catch (error) {
    console.error("Scraping error:", error);
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
