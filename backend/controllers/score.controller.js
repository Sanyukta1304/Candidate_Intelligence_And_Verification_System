const Candidate = require("../models/Candidate");
const { orchestrate } = require("../services/scoreOrchestrator");

const triggerScore = async (req, res) => {
  try {
    const { candidateId } = req.params;

    const result = await orchestrate(candidateId);

    res.status(200).json({
      message: "Scoring completed successfully",
      scores: result,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getScore = async (req, res) => {
  try {
    const { candidateId } = req.params;

    const candidate = await Candidate.findById(candidateId).select(
      "resume_score skills_score projects_score total_score tier last_scored skills"
    );

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    res.status(200).json(candidate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  triggerScore,
  getScore,
};