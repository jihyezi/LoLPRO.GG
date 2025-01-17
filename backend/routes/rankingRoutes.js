const express = require("express");
const { getRankings, addResult } = require("../controllers/rankingsController");

const router = express.Router();

router.get("/", getRankings);
router.post("/", addResult);

module.exports = router;
