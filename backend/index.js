const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cron = require("node-cron");
const scrapeAndSave = require("./scraper");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const rankingRoutes = require("./routes/rankingRoutes");
app.use("/api/rankings", rankingRoutes);

// 24시간마다 스크래핑 실행
cron.schedule("0 0 * * *", scrapeAndSave);

// 서버 시작
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
