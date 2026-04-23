const express = require("express");
const router = express.Router();

const { triggerScore, getScore } = require("../controllers/score.controller");
const { verifyToken } = require("../middleware/auth");

router.post("/score/trigger/:candidateId", verifyToken, triggerScore);
router.get("/score/:candidateId", verifyToken, getScore);

module.exports = router;