const Candidate = require('../models/Candidate');
const Recruiter = require('../models/Recruiter');


// ===============================
// 🔍 1. GET ALL CANDIDATES (SEARCH + FILTER)
// ===============================
exports.getCandidates = async (req, res) => {
  try {
    const { minScore, skill, verified } = req.query;

    let filter = {};

    // filter by minimum score
    if (minScore) {
      filter.total_score = { $gte: Number(minScore) };
    }

    // filter by skill
    if (skill) {
      filter.skills = { $elemMatch: { name: skill } };
    }

    // (optional) filter verified later if needed

    const candidates = await Candidate.find(filter)
      .sort({ total_score: -1 });

    res.json({
      success: true,
      data: candidates
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ===============================
// 👁️ 2. GET SINGLE CANDIDATE (TRACK VIEW)
// ===============================
exports.getCandidateById = async (req, res) => {
  try {
    const recruiter = await Recruiter.findOne({ user_id: req.user.id });

    // add view tracking
    recruiter.viewed_profiles.push({
      candidate_id: req.params.id
    });

    recruiter.profiles_viewed_count += 1;

    await recruiter.save();

    const candidate = await Candidate.findById(req.params.id);

    res.json({
      success: true,
      data: candidate
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ===============================
// ⭐ 3. STAR CANDIDATE
// ===============================
exports.starCandidate = async (req, res) => {
  try {
    const recruiter = await Recruiter.findOne({ user_id: req.user.id });
    const candidateId = req.params.candidateId;

    // avoid duplicate
    if (!recruiter.starred.includes(candidateId)) {
      recruiter.starred.push(candidateId);
      recruiter.profiles_starred_count += 1;
    }

    await recruiter.save();

    res.json({
      success: true,
      message: "Candidate starred successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ===============================
// ❌ 4. UNSTAR CANDIDATE
// ===============================
exports.unstarCandidate = async (req, res) => {
  try {
    const recruiter = await Recruiter.findOne({ user_id: req.user.id });
    const candidateId = req.params.candidateId;

    recruiter.starred = recruiter.starred.filter(
      id => id.toString() !== candidateId
    );

    recruiter.profiles_starred_count -= 1;

    await recruiter.save();

    res.json({
      success: true,
      message: "Candidate unstarred"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ===============================
// ⭐ 5. GET STARRED CANDIDATES
// ===============================
exports.getStarred = async (req, res) => {
  try {
    const recruiter = await Recruiter.findOne({ user_id: req.user.id })
      .populate("starred");

    res.json({
      success: true,
      data: recruiter.starred
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ===============================
// 📊 6. GET DASHBOARD STATS
// ===============================
exports.getStats = async (req, res) => {
  try {
    const recruiter = await Recruiter.findOne({ user_id: req.user.id });

    const stats = {
      profilesViewed: recruiter.profiles_viewed_count,
      profilesStarred: recruiter.profiles_starred_count
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};