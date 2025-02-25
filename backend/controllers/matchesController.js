const db = require("../config/firebaseConfig");

const getMatches = async (req, res) => {
  try {
    const { year } = req.query;

    if (!year) {
      return res.status(400).send("Missing year parameter");
    }

    const matchesRef = db.collection("matches").doc(year);
    const seasonRefs = await matchesRef.listCollections();

    const matches = [];

    for (const seasonRef of seasonRefs) {
      const snapshot = await seasonRef.get();

      if (snapshot.empty) {
        continue;
      }

      snapshot.forEach((doc) => {
        matches.push({ id: doc.id, ...doc.data() });
      });
    }

    if (matches.length === 0) {
      return res.status(404).send("No matches found for the given year");
    }

    res.status(200).json(matches);
  } catch (error) {
    res.status(500).send("Error retrieving matches: " + error.message);
  }
};

const addResult = async (req, res) => {
  try {
    const { year, season, ...matchData } = req.body;
    if (!year || !season) {
      return res.status(400).send("Missing year or season parameter");
    }

    const matchesRef = db.collection("matches").doc(year).collection(season);

    const result = await matchesRef.add(matchData);
    res.status(201).json({ id: result.id });
  } catch (error) {
    res.status(500).send("Error adding match: " + error.message);
  }
};

module.exports = { getMatches, addResult };
