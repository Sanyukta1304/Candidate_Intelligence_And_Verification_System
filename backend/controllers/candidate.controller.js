const User = require('../models/User');
const Candidate = require('../models/Candidate');
const ResumeScore = require('../models/ResumeScore');
const { scoreResume } = require('../services/atsScorer');
const fs = require('fs').promises;
const path = require('path');

// GET PROFILE
exports.getProfile = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ user_id: req.user.id });
    
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

    // Get existing candidate
    let candidate = await Candidate.findOne({ user_id: req.user.id });
    
    // ✅ If no candidate exists, create one with user_id
    if (!candidate) {
      const newCandidate = await Candidate.create({
        user_id: req.user.id,
        education,
        about,
        skills
      });
      return res.json({ success: true, data: newCandidate });
    }
    
    // Prevent modification of GitHub-related fields if locked
    if (candidate.github_verification_locked) {
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

    // ✅ Update existing candidate
    const updated = await Candidate.findOneAndUpdate(
      { user_id: req.user.id },
      { education, about, skills, last_scored: new Date() },
      { returnDocument: 'after' }
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
    // ✅ FETCH FRESH USER DATA FROM DATABASE (not from old JWT token)
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

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
        github_username: user.githubProfile.username,
        github_access_token: user.github_access_token,
        github_verified: true,
        github_verified_at: new Date(),
        github_verification_locked: true
      });
      
      // ✅ ALSO UPDATE USER MODEL TO LOCK VERIFICATION
      user.github_verification_locked = true;
      await user.save();
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
      candidate.github_username = user.githubProfile.username;
      candidate.github_access_token = user.github_access_token;
      candidate.github_verified = true;
      candidate.github_verified_at = new Date();
      candidate.github_verification_locked = true;
      await candidate.save();
    }

    // ✅ ALSO UPDATE USER MODEL TO LOCK VERIFICATION
    user.github_verification_locked = true;
    await user.save();

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

    // ✅ Validate file type - only PDF and DOCX allowed
    const allowedMimeTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const allowedExtensions = ['.pdf', '.docx'];
    
    const fileName = req.file.originalname.toLowerCase();
    const fileMimeType = req.file.mimetype.toLowerCase();
    const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
    
    if (!allowedMimeTypes.includes(fileMimeType) || !allowedExtensions.includes(fileExtension)) {
      // Clean up file before returning error
      await fs.unlink(filePath).catch(() => {});
      return res.status(400).json({
        success: false,
        message: 'Invalid file format. Only PDF and DOCX files are accepted.',
        details: {
          received: `${fileExtension || 'unknown'} (${fileMimeType || 'unknown'})`
        }
      });
    }

    // Verify candidate exists and GitHub is verified AND locked
    let candidate = await Candidate.findOne({ user_id: req.user.id });

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

    // ✅ FIXED: Delete old resume before storing new one (single resume policy)
    const oldResumeUrl = candidate.resume_url;
    if (oldResumeUrl) {
      try {
        const oldResumePath = path.join(__dirname, "../uploads/resumes", oldResumeUrl);
        // Check if file exists before trying to delete
        try {
          await fs.stat(oldResumePath);
          await fs.unlink(oldResumePath);
          console.log(`[Resume Upload] Old resume deleted: ${oldResumeUrl}`);
        } catch (err) {
          // File doesn't exist, that's ok
          console.log(`[Resume Upload] Old resume file not found: ${oldResumeUrl}`);
        }
      } catch (error) {
        console.error(`[Resume Upload] Error deleting old resume:`, error.message);
        // Don't fail the upload if we can't delete the old file
      }
    }

    // ✅ UPDATE: Just store the resume file, don't score yet
    // Update candidate with resume metadata
    await Candidate.findByIdAndUpdate(candidate._id, {
      resume_url: req.file.filename,
      resume_uploaded_at: new Date()
    });

    console.log(`[Resume Upload] File stored for user ${req.user.id}: ${req.file.filename}`);

    // Return file info (user will submit separately to trigger scoring)
    res.status(200).json({
      success: true,
      message: 'Resume uploaded successfully. Click Submit to score with ATS engine.',
      data: {
        resume_url: req.file.filename,
        filename: req.file.originalname,
        file_size: req.file.size,
        upload_time: new Date()
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
    const candidate = await Candidate.findOne({ user_id: req.user.id });

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

// ✅ DOWNLOAD RESUME (Latest only)
exports.downloadResume = async (req, res) => {
  try {
    console.log(`[Resume Download] Request from user: ${req.user?.id}`);
    
    const candidate = await Candidate.findOne({ user_id: req.user.id });

    if (!candidate) {
      console.log(`[Resume Download] Candidate not found for user: ${req.user?.id}`);
      return res.status(404).json({
        success: false,
        message: 'Candidate profile not found'
      });
    }

    // ✅ Only serve the latest resume
    if (!candidate.resume_url) {
      console.log(`[Resume Download] No resume_url found for candidate: ${candidate._id}`);
      return res.status(404).json({
        success: false,
        message: 'No resume found. Please upload a resume first.'
      });
    }

    const resumePath = path.join(__dirname, "../uploads/resumes", candidate.resume_url);
    console.log(`[Resume Download] Resume path: ${resumePath}`);

    // Check if file exists and get file stats
    let fileStats;
    try {
      fileStats = await fs.stat(resumePath);
      console.log(`[Resume Download] File found, size: ${fileStats.size} bytes`);
    } catch (err) {
      console.error(`[Resume Download] File not found at: ${resumePath}`, err.message);
      return res.status(404).json({
        success: false,
        message: 'Resume file not found on server'
      });
    }

    // Set response headers for file download
    const fileExtension = candidate.resume_url.split('.').pop().toLowerCase();
    const fileName = `resume_${candidate._id}.${fileExtension}`;
    
    // Set proper content type based on file extension
    let contentType = 'application/octet-stream';
    if (fileExtension === 'pdf') {
      contentType = 'application/pdf';
    } else if (fileExtension === 'docx') {
      contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    } else if (fileExtension === 'doc') {
      contentType = 'application/msword';
    }
    
    console.log(`[Resume Download] Serving file: ${fileName}, type: ${contentType}`);
    
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', fileStats.size);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Stream the file with error handling
    const stream = require('fs').createReadStream(resumePath);
    
    stream.on('error', (err) => {
      console.error('[Resume Download] Stream error:', err.message);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: 'Error downloading resume'
        });
      }
    });
    
    stream.on('end', () => {
      console.log(`[Resume Download] File successfully streamed to client`);
    });
    
    res.on('error', (err) => {
      console.error('[Resume Download] Response error:', err.message);
    });
    
    stream.pipe(res);
  } catch (error) {
    console.error('[Resume Download] Error:', error.message);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Error downloading resume: ' + error.message
      });
    }
  }
};
