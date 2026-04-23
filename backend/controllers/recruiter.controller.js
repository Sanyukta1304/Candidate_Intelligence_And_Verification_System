const Candidate = require('../models/Candidate');
const Recruiter = require('../models/Recruiter');
const { emitNotification } = require('../services/notificationService');

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

    const candidates = await Candidate.find(filter).sort({ total_score: -1 });

    res.json({
      success: true,
      data: candidates,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// 👁️ 2. GET SINGLE CANDIDATE (TRACK VIEW)
// ===============================
exports.getCandidateById = async (req, res) => {
  try {
    const recruiter = await Recruiter.findOne({ user_id: req.user.id });

    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter profile not found',
      });
    }

    // add view tracking
    recruiter.viewed_profiles.push({
      candidate_id: req.params.id,
    });

    recruiter.profiles_viewed_count += 1;
    await recruiter.save();

    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found',
      });
    }

    // 🔔 Trigger notification to candidate
    if (candidate.user_id) {
      await emitNotification({
        recipient_id: candidate.user_id,
        type: 'profile_viewed',
        recruiter_id: recruiter._id,
        recruiter_name: recruiter.name || recruiter.company_name || 'Recruiter',
        company_name: recruiter.company_name || '',
      });
    }

    res.json({
      success: true,
      data: candidate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
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

    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter profile not found',
      });
    }

    const candidate = await Candidate.findById(candidateId);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found',
      });
    }

    const alreadyStarred = recruiter.starred.some(
      (id) => id.toString() === candidateId
    );

    // avoid duplicate
    if (!alreadyStarred) {
      recruiter.starred.push(candidateId);
      recruiter.profiles_starred_count += 1;
      await recruiter.save();

      // 🔔 Trigger notification only when newly starred
      if (candidate.user_id) {
        await emitNotification({
          recipient_id: candidate.user_id,
          type: 'profile_starred',
          recruiter_id: recruiter._id,
          recruiter_name: recruiter.name || recruiter.company_name || 'Recruiter',
          company_name: recruiter.company_name || '',
        });
      }
    }

    res.json({
      success: true,
      message: 'Candidate starred successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
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

    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter profile not found',
      });
    }

    const beforeCount = recruiter.starred.length;

    recruiter.starred = recruiter.starred.filter(
      (id) => id.toString() !== candidateId
    );

    if (recruiter.starred.length < beforeCount && recruiter.profiles_starred_count > 0) {
      recruiter.profiles_starred_count -= 1;
    }

    await recruiter.save();

    res.json({
      success: true,
      message: 'Candidate unstarred',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// ⭐ 5. GET STARRED CANDIDATES
// ===============================
exports.getStarred = async (req, res) => {
  try {
    const recruiter = await Recruiter.findOne({ user_id: req.user.id }).populate('starred');

    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter profile not found',
      });
    }

    res.json({
      success: true,
      data: recruiter.starred,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// 📊 6. GET DASHBOARD STATS
// ===============================
exports.getStats = async (req, res) => {
  try {
    const recruiter = await Recruiter.findOne({ user_id: req.user.id });

    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter profile not found',
      });
    }

    const stats = {
      profilesViewed: recruiter.profiles_viewed_count,
      profilesStarred: recruiter.profiles_starred_count,
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};