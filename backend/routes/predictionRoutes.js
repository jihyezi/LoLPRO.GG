const express = require("express");
const { getPrediction, addMatch } = require("../controllers/predictionController");

const router = express.Router();

router.get("/", getPrediction);
router.post("/", addMatch);

module.exports = router;
