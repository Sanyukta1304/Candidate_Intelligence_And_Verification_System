const Candidate = require('../models/Candidate');
const ResumeScore = require('../models/ResumeScore');
const User = require('../models/User');
const pdfParse = require('pdf-parse');
const { scoreResume } = require('../services/resumeScorer');

// GET PROFILE
exports.getProfile = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ user_id: req.user.id });
    res.json({ success: true, data: candidate });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const { education, about, skills } = req.body;

    const updated = await Candidate.findOneAndUpdate(
      { user_id: req.user.id },
      {
        user_id: req.user.id,
        education,
        about,
        skills
      },
      { new: true, upsert: true }
    );

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GITHUB VERIFY
exports.verifyGithub = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || !user.github_access_token) {
      return res.status(400).json({
        success: false,
        message: "GitHub not connected"
      });
    }

    const candidate = await Candidate.findOneAndUpdate(
      { user_id: req.user.id },
      {
        user_id: req.user.id,
        github_username: user.github_username,
        github_access_token: user.github_access_token,
        github_verified: true
      },
      { new: true, upsert: true }
    );

    res.json({ success: true, data: candidate });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPLOAD RESUME
exports.uploadResume = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ user_id: req.user.id });

    if (!candidate || !candidate.github_verified) {
      return res.status(403).json({
        success: false,
        message: "Verify GitHub first"
      });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const data = await pdfParse(file.buffer);
    const text = data.text;

    const score = scoreResume(text);

    candidate.resume_text = text;
    candidate.resume_score = score.total_ats_score;
    await candidate.save();

    await ResumeScore.findOneAndUpdate(
      { candidate_id: candidate._id },
      score,
      { upsert: true }
    );

    res.json({ success: true, data: score });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET SCORE
exports.getResumeScore = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ user_id: req.user.id });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found"
      });
    }

    const score = await ResumeScore.findOne({ candidate_id: candidate._id });

    res.json({ success: true, data: score });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};