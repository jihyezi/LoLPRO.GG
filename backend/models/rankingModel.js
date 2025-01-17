const db = require("../config/firebaseConfig");

const getRankings = async () => {
  const rankingsRef = db.collection("ranking");
  const snapshot = await rankingsRef.get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

const addRanking = async (rankingData) => {
  const rankingsRef = db.collection("ranking");
  const result = await rankingsRef.add(rankingData);
  return result.id;
};

module.exports = { getRankings, addRanking };
