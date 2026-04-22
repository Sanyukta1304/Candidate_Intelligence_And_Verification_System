const Candidate = require('../models/Candidate');
const Recruiter = require('../models/Recruiter');


// ===============================
// 🔍 1. GET ALL CANDIDATES (VERIFIED ONLY - SEARCH + FILTER + SORT)
// ===============================
exports.getCandidates = async (req, res) => {
  try {
    const { minScore, skill, sortBy, limit } = req.query;

    let filter = {};

    // ✅ MANDATORY: Only return VERIFIED candidates (github_verified = true)
    // Non-verified candidates will NEVER be returned
    filter.github_verified = true;

    // ✅ FILTER 1: Minimum Overall Score (ATS Score)
    if (minScore) {
      filter.total_score = { $gte: Number(minScore) };
    }

    // ✅ FILTER 2: Skill Match (if candidate has this skill)
    if (skill) {
      filter.skills = { $elemMatch: { name: { $regex: skill, $options: 'i' } } };
    }

    // Build sort object
    // Default: Descending by score (highest first)
    let sortObj = { total_score: -1 };
    let queryLimit = null;

    // ✅ SORT OPTIONS:
    if (sortBy === 'desc' || sortBy === 'descending') {
      // Descending by score (highest first)
      sortObj = { total_score: -1 };
    } else if (sortBy === 'asc' || sortBy === 'ascending') {
      // Ascending by score (lowest first)
      sortObj = { total_score: 1 };
    } else if (sortBy === 'top10') {
      // Top 10 candidates by score (descending)
      sortObj = { total_score: -1 };
      queryLimit = 10;
    } else if (sortBy === 'name') {
      // Sort by name (ascending)
      sortObj = { name: 1 };
    } else if (sortBy === 'recent') {
      // Sort by creation date (most recent first)
      sortObj = { createdAt: -1 };
    }

    // Build query
    let query = Candidate.find(filter).sort(sortObj);

    // Apply limit if needed
    if (queryLimit) {
      query = query.limit(queryLimit);
    } else if (limit) {
      // Custom limit via parameter
      query = query.limit(Number(limit));
    }

    // Select relevant fields to return
    const candidates = await query.select('name email total_score skills github_verified createdAt');

    res.json({
      success: true,
      count: candidates.length,
      message: 'Showing only verified candidates (GitHub verified)',
      filters_applied: {
        verified: 'MANDATORY - Only verified candidates shown',
        minScore: minScore ? Number(minScore) : null,
        skill: skill || null,
        sortBy: sortBy || 'desc',
        resultsShown: candidates.length,
        topLimit: queryLimit || limit || 'all'
      },
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
    const candidateId = req.params.id;

    // Validate candidate ID format
    if (!candidateId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid candidate ID format"
      });
    }

    // Get recruiter, create if doesn't exist
    let recruiter = await Recruiter.findOne({ user_id: req.user.id });
    if (!recruiter) {
      recruiter = new Recruiter({
        user_id: req.user.id
      });
    }

    // Check if candidate already viewed (avoid duplicate tracking)
    const alreadyViewed = recruiter.viewed_profiles.some(
      v => v.candidate_id.toString() === candidateId
    );

    if (!alreadyViewed) {
      recruiter.viewed_profiles.push({
        candidate_id: candidateId
      });
      recruiter.profiles_viewed_count += 1;
      await recruiter.save();
    }

    // Get candidate details
    const candidate = await Candidate.findById(candidateId);
    
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found"
      });
    }

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
    const candidateId = req.params.candidateId;

    // Validate candidate ID
    if (!candidateId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid candidate ID format"
      });
    }

    // Check if candidate exists
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found"
      });
    }

    let recruiter = await Recruiter.findOne({ user_id: req.user.id });
    
    // Create recruiter if doesn't exist
    if (!recruiter) {
      recruiter = new Recruiter({
        user_id: req.user.id
      });
    }

    // Avoid duplicate
    if (!recruiter.starred.includes(candidateId)) {
      recruiter.starred.push(candidateId);
      recruiter.profiles_starred_count += 1;
      await recruiter.save();

      return res.json({
        success: true,
        message: "Candidate starred successfully",
        data: { starred: true }
      });
    }

    res.json({
      success: true,
      message: "Candidate already starred",
      data: { starred: true }
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
    const candidateId = req.params.candidateId;

    // Validate candidate ID
    if (!candidateId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid candidate ID format"
      });
    }

    const recruiter = await Recruiter.findOne({ user_id: req.user.id });

    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: "Recruiter profile not found"
      });
    }

    const initialCount = recruiter.starred.length;
    recruiter.starred = recruiter.starred.filter(
      id => id.toString() !== candidateId
    );

    // Only update count if something was removed
    if (recruiter.starred.length < initialCount) {
      recruiter.profiles_starred_count = Math.max(0, recruiter.profiles_starred_count - 1);
      await recruiter.save();

      return res.json({
        success: true,
        message: "Candidate unstarred successfully",
        data: { starred: false }
      });
    }

    res.json({
      success: true,
      message: "Candidate was not starred",
      data: { starred: false }
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

    if (!recruiter) {
      return res.json({
        success: true,
        count: 0,
        data: []
      });
    }

    res.json({
      success: true,
      count: recruiter.starred.length,
      data: recruiter.starred || []
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ===============================
// 📊 6. GET DASHBOARD STATS (WITH AVERAGE SCORE)
// ===============================
exports.getStats = async (req, res) => {
  try {
    const recruiter = await Recruiter.findOne({ user_id: req.user.id })
      .populate('starred');

    // Calculate average score of starred candidates
    let averageScore = 0;
    if (recruiter.starred && recruiter.starred.length > 0) {
      const totalScore = recruiter.starred.reduce((sum, candidate) => sum + (candidate.total_score || 0), 0);
      averageScore = totalScore / recruiter.starred.length;
    }

    const stats = {
      profilesViewed: recruiter.profiles_viewed_count,
      profilesStarred: recruiter.profiles_starred_count,
      averageScore: Math.round(averageScore * 100) / 100
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


// ===============================
// 👤 7. GET RECRUITER PROFILE
// ===============================
exports.getProfile = async (req, res) => {
  try {
    let recruiter = await Recruiter.findOne({ user_id: req.user.id });

    // Auto-create recruiter profile if doesn't exist
    if (!recruiter) {
      recruiter = new Recruiter({
        user_id: req.user.id,
        company_name: '',
        company_email: '',
        about_company: '',
        address: '',
        logo_url: null
      });
      await recruiter.save();
    }

    res.json({
      success: true,
      data: recruiter
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ===============================
// ✏️ 8. UPDATE RECRUITER PROFILE
// ===============================
exports.updateProfile = async (req, res) => {
  try {
    const { company_name, company_email, about_company, address, logo_url } = req.body;

    let recruiter = await Recruiter.findOne({ user_id: req.user.id });

    // Create if doesn't exist
    if (!recruiter) {
      recruiter = new Recruiter({
        user_id: req.user.id
      });
    }

    // Update fields
    if (company_name !== undefined) recruiter.company_name = company_name;
    if (company_email !== undefined) recruiter.company_email = company_email;
    if (about_company !== undefined) recruiter.about_company = about_company;
    if (address !== undefined) recruiter.address = address;
    if (logo_url !== undefined) recruiter.logo_url = logo_url;

    await recruiter.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: recruiter
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};