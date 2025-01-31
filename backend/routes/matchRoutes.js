const express = require("express");
const { getMatches, addResult } = require("../controllers/matchesController");

const router = express.Router();

router.get("/", getMatches);
router.post("/", addResult);

module.exports = router;
