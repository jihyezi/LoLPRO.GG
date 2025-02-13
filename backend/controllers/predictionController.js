const db = require("../config/firebaseConfig");

const getPrediction = async (req, res) => {
    try {
        const { year, season, weekNumber } = req.query;

        if (!year || !season) {
            return res.status(400).send("Missing year or season parameter");
        }

        const predictionRef = db.collection("matches").doc(year).collection(season);

        if (weekNumber) {
            predictionRef = predictionRef.where("weekNumber", "==", parseInt(weekNumber, 10));
        }

        const snapshot = await predictionRef.get();

        if (snapshot.empty) {
            return res.status(404).json({ error: "No matches found" });
        }

        const predictions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        res.status(200).json(matches);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving matches: " + error.message });
    }
};

const addMatch = async (req, res) => {
    try {
        const { year, season, weekNumber, predictionData } = req.body;

        if (!year || !season || weekNumber === undefined || !predictionData) {
            return res.status(400).json({ error: "Missing required parameters" });
        }

        const predictionRef = db.collection("matches").doc(year).collection(season);

        // matchId 자동 증가 (match_01, match_02 ...)
        const snapshot = await predictionRef.get();
        let maxMatchNum = 0;

        snapshot.forEach((doc) => {
            const matchId = doc.id;
            const matchNum = parseInt(matchId.replace("match_", ""), 10);
            if (!isNaN(matchNum) && matchNum > maxMatchNum) {
                maxMatchNum = matchNum;
            }
        });

        const newMatchId = `match_${String(maxMatchNum + 1).padStart(2, "0")}`;

        // Firestore에 저장
        await predictionRef.doc(newMatchId).set({ ...predictionData, weekNumber });

        res.status(201).json({ message: "Match added successfully", matchId: newMatchId });
    } catch (error) {
        res.status(500).json({ error: "Error adding match: " + error.message });
    }
};

module.exports = { getPrediction, addMatch };