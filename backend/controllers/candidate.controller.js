const Candidate = require('../models/Candidate');
const ResumeScore = require('../models/ResumeScore');
const { scoreResume } = require('../services/atsScorer');
const fs = require('fs').promises;
const path = require('path');

// GET PROFILE
exports.getProfile = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ user_id: req.user._id });
    
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate profile not found'
      });
    }

    res.json({ success: true, data: candidate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const { education, about, skills } = req.body;

    // Validate input
    if (about && about.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'About section must be 500 characters or less'
      });
    }

    // Get existing candidate to check GitHub verification lock
    const candidate = await Candidate.findOne({ user_id: req.user._id });
    
    // Prevent modification of GitHub-related fields if locked
    if (candidate && candidate.github_verification_locked) {
      // Ensure GitHub fields cannot be modified once locked
      if (req.body.github_verified !== undefined || 
          req.body.github_username !== undefined || 
          req.body.github_access_token !== undefined ||
          req.body.github_verification_locked !== undefined) {
        return res.status(403).json({
          success: false,
          message: 'GitHub verification is locked and cannot be modified'
        });
      }
    }

    const updated = await Candidate.findOneAndUpdate(
      { user_id: req.user._id },
      { education, about, skills, last_scored: new Date() },
      { new: true, upsert: true }
    );

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GITHUB VERIFY
 * Verifies GitHub connection through OAuth and locks the verification
 * After one successful verification, user cannot re-verify
 */
exports.verifyGithub = async (req, res) => {
  try {
    const user = req.user;

    // Check if user has authenticated with GitHub via OAuth
    if (!user.github_verified || !user.github_access_token) {
      return res.status(403).json({
        success: false,
        message: 'GitHub OAuth not completed. Please authenticate with GitHub first.',
        help: 'Use /api/auth/github to authenticate with your GitHub account'
      });
    }

    // Get or create candidate profile
    let candidate = await Candidate.findOne({ user_id: user._id });

    if (!candidate) {
      // Create new candidate profile with GitHub verification
      candidate = await Candidate.create({
        user_id: user._id,
        github_username: user.github_username,
        github_access_token: user.github_access_token,
        github_verified: true,
        github_verified_at: new Date(),
        github_verification_locked: true
      });
    } else if (candidate.github_verification_locked) {
      // GitHub verification already completed and locked
      return res.status(403).json({
        success: false,
        message: 'GitHub verification already completed and locked. Cannot re-verify.',
        data: {
          github_verified: candidate.github_verified,
          github_verified_at: candidate.github_verified_at,
          locked: true
        }
      });
    } else {
      // Update candidate with GitHub verification and lock it
      candidate.github_username = user.github_username;
      candidate.github_access_token = user.github_access_token;
      candidate.github_verified = true;
      candidate.github_verified_at = new Date();
      candidate.github_verification_locked = true;
      await candidate.save();
    }

    res.json({
      success: true,
      message: 'GitHub verified and locked successfully',
      data: {
        github_verified: candidate.github_verified,
        github_username: candidate.github_username,
        github_verified_at: candidate.github_verified_at,
        locked: candidate.github_verification_locked
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// UPLOAD RESUME
exports.uploadResume = async (req, res, next) => {
  let filePath = null;
  
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No resume file uploaded'
      });
    }

    filePath = req.file.path;

    // Verify candidate exists and GitHub is verified AND locked
    let candidate = await Candidate.findOne({ user_id: req.user._id });

    if (!candidate) {
      // Clean up file before returning error
      await fs.unlink(filePath).catch(() => {});
      return res.status(403).json({
        success: false,
        message: 'Candidate profile not found. Please verify your GitHub account first.',
        help: 'Visit POST /api/candidate/github/verify to lock GitHub verification'
      });
    }

    if (!candidate.github_verified) {
      // Clean up file before returning error
      await fs.unlink(filePath).catch(() => {});
      return res.status(403).json({
        success: false,
        message: 'GitHub account not verified. Please authenticate with GitHub first.',
        help: 'Use /api/auth/github to authenticate, then POST /api/candidate/github/verify'
      });
    }

    if (!candidate.github_verification_locked) {
      // Clean up file before returning error
      await fs.unlink(filePath).catch(() => {});
      return res.status(403).json({
        success: false,
        message: 'GitHub verification not locked. Please complete verification first.',
        help: 'Visit POST /api/candidate/github/verify to lock GitHub verification'
      });
    }

    // Score the resume using ATS Engine
    console.log(`[Resume Upload] Scoring resume for user ${req.user._id}`);
    const scoreResult = await scoreResume(filePath);

    // Save score to ResumeScore collection
    const resumeScore = await ResumeScore.findOneAndUpdate(
      { candidate_id: candidate._id },
      {
        ...scoreResult,
        candidate_id: candidate._id,
        parse_success: scoreResult.parse_success !== false
      },
      { new: true, upsert: true }
    );

    // Update candidate with resume metadata
    await Candidate.findByIdAndUpdate(candidate._id, {
      resume_text: scoreResult.raw_text || '',
      resume_score: scoreResult.final_score || 0,
      resume_url: req.file.filename,
      last_scored: new Date(),
      total_score: scoreResult.final_score || 0
    });

    // Clean up uploaded file after processing
    try {
      await fs.unlink(filePath);
    } catch (unlinkError) {
      console.warn(`[Resume Upload] Could not delete file ${filePath}:`, unlinkError.message);
    }

    // Return score result
    res.status(200).json({
      success: true,
      message: 'Resume scored successfully',
      data: {
        final_score: scoreResult.final_score,
        detected_role: scoreResult.detected_role,
        dimension_scores: scoreResult.dimension_scores,
        skills_detected: scoreResult.skills_detected,
        section_presence: scoreResult.section_presence,
        improvement_suggestions: scoreResult.improvement_suggestions,
        meta: scoreResult.meta
      }
    });
  } catch (error) {
    console.error('[Resume Upload] Error:', error.message);
    
    // Clean up file on error
    if (filePath) {
      await fs.unlink(filePath).catch(() => {});
    }

    res.status(500).json({
      success: false,
      message: `Resume processing failed: ${error.message}`
    });
  }
};

// GET RESUME SCORE
exports.getResumeScore = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ user_id: req.user._id });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate profile not found'
      });
    }

    const score = await ResumeScore.findOne({ candidate_id: candidate._id });

    if (!score) {
      return res.status(404).json({
        success: false,
        message: 'No resume score found. Please upload a resume first.'
      });
    }

    res.json({ success: true, data: score });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
