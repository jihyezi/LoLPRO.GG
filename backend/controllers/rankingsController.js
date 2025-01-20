// 특정 데이터 조회 가능하게 수정가능함
const db = require("../config/firebaseConfig");

const getRankings = async (req, res) => {
  try {
    const { year, season } = req.query;

    if (!year || !season) {
      return res.status(400).send("Missing year or season parameter");
    }

    const rankingsRef = db.collection("ranking").doc(year).collection(season);

    const snapshot = await rankingsRef.get();

    if (snapshot.empty) {
      return res
        .status(404)
        .send("No rankings found for the given year and season");
    }

    const rankings = [];
    snapshot.forEach((doc) => {
      rankings.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(rankings);
  } catch (error) {
    res.status(500).send("Error retrieving rankings: " + error.message);
  }
};

const addResult = async (req, res) => {
  try {
    const { year, season, ...rankingData } = req.body;
    if (!year || !season) {
      return res.status(400).send("Missing year or season parameter");
    }

    const rankingsRef = db.collection("ranking").doc(year).collection(season);

    const result = await rankingsRef.add(rankingData);
    res.status(201).json({ id: result.id });
  } catch (error) {
    res.status(500).send("Error adding ranking: " + error.message);
  }
};

module.exports = { getRankings, addResult };
