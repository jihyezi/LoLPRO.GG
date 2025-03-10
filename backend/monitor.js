const axios = require("axios");
const fs = require("fs");
const crypto = require("crypto");

const url = "https://gol.gg/tournament/tournament-ranking/LCK%20Cup%202025/";
const hashFile = "lastHash.txt";

async function getSiteHash() {
  const { data } = await axios.get(url);
  return crypto.createHash("md5").update(data).digest("hex");
}

async function monitorSite() {
  const currentHash = await getSiteHash();

  let lastHash;
  if (fs.existsSync(hashFile)) {
    lastHash = fs.readFileSync(hashFile, "utf8");
  }

  if (currentHash !== lastHash) {
    console.log("Site updated!");
    fs.writeFileSync(hashFile, currentHash);

    await triggerGitHubActions();
  } else {
    console.log("No update detected.");
  }
}

async function triggerGitHubActions() {
  const githubToken = process.env.LOLPRO_TOKEN;
  const owner = "jihyezi";
  const repo = "LoLPRO.GG";
  const workflow = "update-rankings.yml";
  console.log(process.env.LOLPRO_TOKEN);
  console.log({ githubToken, owner, repo, workflow });
  try {
    await axios.post(
      `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflow}/dispatches`,
      { ref: "main" },
      {
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );
    console.log("GitHub Actions triggered successfully.");
  } catch (error) {
    console.error("Error triggering GitHub Actions:", error.message);
  }
}

setInterval(monitorSite, 5 * 1000); // 5초 간격
