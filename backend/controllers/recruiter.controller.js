const Candidate = require('../models/Candidate');
const Recruiter = require('../models/Recruiter');
const User = require('../models/User');
const { emitNotification } = require('../services/notificationService');


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
    let query = Candidate.find(filter)
      .populate('user_id', 'username email')
      .sort(sortObj);

    // Apply limit if needed
    if (queryLimit) {
      query = query.limit(queryLimit);
    } else if (limit) {
      // Custom limit via parameter
      query = query.limit(Number(limit));
    }

    // Execute query - no need for separate select since we're using populate
    const candidates = await query;

    // Transform data: add 'name' field from user_id.username
    const transformedCandidates = candidates.map(candidate => {
      const candidateObj = candidate.toObject ? candidate.toObject() : candidate;
      return {
        ...candidateObj,
        name: candidateObj.user_id?.username || 'Unknown',
        university: candidateObj.education?.institution || 'N/A',
        score: candidateObj.total_score || 0,
        topSkills: candidateObj.skills?.slice(0, 5).map(s => s.name) || []
      };
    });

    res.json({
      success: true,
      count: transformedCandidates.length,
      message: 'Showing only verified candidates (GitHub verified)',
      filters_applied: {
        verified: 'MANDATORY - Only verified candidates shown',
        minScore: minScore ? Number(minScore) : null,
        skill: skill || null,
        sortBy: sortBy || 'desc',
        resultsShown: transformedCandidates.length,
        topLimit: queryLimit || limit || 'all'
      },
      data: transformedCandidates
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

      // ✅ UPDATE CANDIDATE PROFILE VIEWS
      await Candidate.findByIdAndUpdate(
        candidateId,
        { $inc: { profile_views: 1 } },
        { new: true }
      );

      // ✅ EMIT NOTIFICATION - Profile Viewed
      try {
        const recruiterUser = await User.findById(req.user.id).select('username');
        await emitNotification({
          recipient_id: candidateId,
          type: 'profile_viewed',
          recruiter_id: recruiter._id,
          recruiter_name: recruiterUser?.username || 'A recruiter',
          company_name: recruiter.company_name || 'Unknown Company'
        });
      } catch (notifError) {
        console.warn('[getCandidateById] Notification failed:', notifError.message);
        // Don't fail the endpoint if notification fails
      }
    }

    // Get candidate details with populated user info
    const candidate = await Candidate.findById(candidateId).populate('user_id', 'username email');
    
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found"
      });
    }

    // Get resume score details
    const ResumeScore = require('../models/ResumeScore');
    const resumeScore = await ResumeScore.findOne({ candidate_id: candidateId });

    // Get all projects for the candidate
    const Project = require('../models/Project');
    const projects = await Project.find({ candidate_id: candidateId });

    // Transform candidate data to include all required fields
    const candidateObj = candidate.toObject ? candidate.toObject() : candidate;
    const transformedCandidate = {
      ...candidateObj,
      name: candidateObj.user_id?.username || 'Unknown',
      university: candidateObj.education?.institution || 'N/A',
      score: candidateObj.total_score || 0,
      topSkills: candidateObj.skills?.slice(0, 5).map(s => s.name) || [],
      education: {
        ...candidateObj.education,
        graduation_year: candidateObj.education?.year || candidateObj.education?.graduation_year
      },
      scoreBreakdown: {
        resume: candidateObj.resume_score || 0,
        skills: candidateObj.skills_score || 0,
        projects: candidateObj.projects_score || 0
      },
      // Add resume score details
      resumeScoreDetails: resumeScore ? {
        final_score: resumeScore.final_score || 0,
        detected_role: resumeScore.detected_role || 'Unknown',
        dimensions: resumeScore.dimension_scores || {},
        penalties: resumeScore.penalties_applied || {}
      } : null,
      // Add projects
      projects: projects.map(p => ({
        _id: p._id,
        title: p.title,
        description: p.description,
        github_url: p.github_link,
        technologies: p.tech_stack || [],
        total_commits: p.total_commits || 0,
        your_commits: p.user_commits || 0,
        visibility: p.is_public ? 'Public' : 'Private',
        has_readme: p.has_readme,
        last_push: p.last_pushed_at ? new Date(p.last_pushed_at).toLocaleDateString() : 'Unknown',
        score: p.project_score || 0,
        score_breakdown: p.score_breakdown || {}
      }))
    };

    res.json({
      success: true,
      data: transformedCandidate,
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

      // ✅ UPDATE CANDIDATE PROFILE STARS
      await Candidate.findByIdAndUpdate(
        candidateId,
        { $inc: { profile_stars: 1 } },
        { new: true }
      );

      // ✅ EMIT NOTIFICATION - Profile Starred
      try {
        const recruiterUser = await User.findById(req.user.id).select('username');
        await emitNotification({
          recipient_id: candidateId,
          type: 'profile_starred',
          recruiter_id: recruiter._id,
          recruiter_name: recruiterUser?.username || 'A recruiter',
          company_name: recruiter.company_name || 'Unknown Company'
        });
      } catch (notifError) {
        console.warn('[starCandidate] Notification failed:', notifError.message);
        // Don't fail the endpoint if notification fails
      }

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
      message: error.message,
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
      (id) => id.toString() !== candidateId
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
      message: error.message,
    });
  }
};

// ===============================
// ⭐ 5. GET STARRED CANDIDATES
// ===============================
exports.getStarred = async (req, res) => {
  try {
    const recruiter = await Recruiter.findOne({ user_id: req.user.id })
      .populate({
        path: 'starred',
        populate: {
          path: 'user_id',
          select: 'username email'
        }
      });

    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter profile not found',
      });
    }

    // Transform starred candidates data
    const transformedStarred = recruiter.starred.map(candidate => {
      const candidateObj = candidate.toObject ? candidate.toObject() : candidate;
      return {
        ...candidateObj,
        name: candidateObj.user_id?.username || 'Unknown',
        university: candidateObj.education?.institution || 'N/A',
        score: candidateObj.total_score || 0,
        topSkills: candidateObj.skills?.slice(0, 5).map(s => s.name) || []
      };
    });

    res.json({
      success: true,
      count: transformedStarred.length,
      data: transformedStarred
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
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

    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter profile not found',
      });
    }

    // Get total candidates and github verified count
    const totalCandidates = await Candidate.countDocuments();
    const githubVerified = await Candidate.countDocuments({ github_verified: true });

    const stats = {
      profilesViewed: recruiter.profiles_viewed_count,
      profilesStarred: recruiter.profiles_starred_count,
      averageScore: Math.round(averageScore * 100) / 100,
      totalCandidates: totalCandidates,
      githubVerified: githubVerified
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

// ===============================
// 🕐 9. GET RECENT ACTIVITY
// ===============================
exports.getActivity = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const recruiter = await Recruiter.findOne({ user_id: req.user.id })
      .populate({
        path: 'viewed_profiles.candidate_id',
        populate: {
          path: 'user_id',
          select: 'username'
        }
      })
      .populate({
        path: 'starred',
        populate: {
          path: 'user_id',
          select: 'username'
        }
      });

    if (!recruiter) {
      return res.json({
        success: true,
        data: {
          recentViews: [],
          recentStars: [],
          totalActivity: 0
        }
      });
    }

    // Get recent views (sorted by date)
    const recentViews = recruiter.viewed_profiles
      .sort((a, b) => new Date(b.viewed_at) - new Date(a.viewed_at))
      .map(view => ({
        action: 'viewed',
        candidate: {
          _id: view.candidate_id._id,
          name: view.candidate_id.user_id?.username || 'Unknown',
          total_score: view.candidate_id.total_score,
          education: view.candidate_id.education
        },
        timestamp: view.viewed_at
      }));

    // Get recent stars (sorted by updatedAt)
    const recentStars = recruiter.starred
      .map(candidate => ({
        action: 'starred',
        candidate: {
          _id: candidate._id,
          name: candidate.user_id?.username || 'Unknown',
          total_score: candidate.total_score,
          education: candidate.education
        },
        timestamp: candidate.updatedAt || new Date()
      }));

    // Merge and sort all activities by timestamp (most recent first)
    const allActivities = [...recentViews, ...recentStars]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);

    res.json({
      success: true,
      data: allActivities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ===============================
// 📥 10. DOWNLOAD CANDIDATE RESUME (Latest only)
// ===============================
exports.downloadCandidateResume = async (req, res) => {
  try {
    const { candidateId } = req.params;
    const path = require('path');
    const fs = require('fs').promises;

    // Verify recruiter has access to this candidate
    const candidate = await Candidate.findById(candidateId);
    if (!candidate || !candidate.github_verified) {
      return res.status(403).json({
        success: false,
        message: 'Candidate not found or not verified'
      });
    }

    // ✅ Only serve the LATEST resume (single resume policy)
    if (!candidate.resume_url) {
      return res.status(404).json({
        success: false,
        message: 'No resume found for this candidate'
      });
    }

    const resumePath = path.join(__dirname, "../uploads/resumes", candidate.resume_url);

    // Check if file exists
    try {
      await fs.stat(resumePath);
    } catch (err) {
      return res.status(404).json({
        success: false,
        message: 'Resume file not found on server'
      });
    }

    // Set response headers for file download
    const fileName = `resume_${candidate.name || candidate._id}.${candidate.resume_url.split('.').pop()}`;
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'application/octet-stream');

    // Stream the file
    const fileStream = require('fs').createReadStream(resumePath);
    fileStream.pipe(res);

    // Log the download
    const recruiter = await Recruiter.findOne({ user_id: req.user.id });
    console.log(`[Resume Download] Recruiter ${recruiter?.name} downloaded resume for ${candidate.name} (${candidateId})`);

  } catch (error) {
    console.error('[Resume Download] Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error downloading resume: ' + error.message
    });
  }
};