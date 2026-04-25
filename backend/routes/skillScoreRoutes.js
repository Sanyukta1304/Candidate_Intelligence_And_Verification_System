const express = require("express");
const router = express.Router();

router.post("/skill-score", async (req, res) => {
  try {
    const { candidateSkills, requiredSkills } = req.body;

    if (!candidateSkills || !requiredSkills) {
      return res.status(400).json({
        message: "candidateSkills and requiredSkills are required",
      });
    }

    if (!Array.isArray(candidateSkills) || !Array.isArray(requiredSkills)) {
      return res.status(400).json({
        message: "Both candidateSkills and requiredSkills must be arrays",
      });
    }

    if (requiredSkills.length === 0) {
      return res.status(400).json({
        message: "requiredSkills cannot be empty",
      });
    }

    const normalizedCandidateSkills = candidateSkills.map((skill) =>
      skill.toLowerCase().trim()
    );

    const normalizedRequiredSkills = requiredSkills.map((skill) =>
      skill.toLowerCase().trim()
    );

    const matchedSkills = normalizedRequiredSkills.filter((skill) =>
      normalizedCandidateSkills.includes(skill)
    );

    const skillScore = Math.round(
      (matchedSkills.length / normalizedRequiredSkills.length) * 100
    );

    res.status(200).json({
      skillScore,
      matchedSkills,
      totalMatched: matchedSkills.length,
      totalRequired: normalizedRequiredSkills.length,
      message: "Skill score calculated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error calculating skill score",
      error: error.message,
    });
  }
});

module.exports = router;