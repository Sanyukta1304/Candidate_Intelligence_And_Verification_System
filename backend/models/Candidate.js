const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sub_score: { type: Number, default: 0 },
  project_score: { type: Number, default: 0 },
  resume_score: { type: Number, default: 0 },
  decl_score: { type: Number, default: 20 }
});

const CandidateSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },

  education: {
    degree: String,
    institution: String,
    year: Number
  },

  about: { type: String, maxlength: 500 },

  skills: [SkillSchema],

  resume_url: { type: String, default: null },
  resume_text: { type: String, default: null },

  resume_score: { type: Number, default: 0 },
  skills_score: { type: Number, default: 0 },
  projects_score: { type: Number, default: 0 },
  total_score: { type: Number, default: 0 },

  github_username: { type: String, default: null },
  github_access_token: { type: String, default: null },
  github_verified: { type: Boolean, default: false },
<<<<<<< HEAD
  github_verified_at: { type: Date, default: null },
  github_verification_locked: { type: Boolean, default: false },
=======
>>>>>>> cf42a878e44737cf5323d658874f430fa0cae478

  tier: {
    type: String,
    enum: ['High Potential', 'Moderate', 'Needs Improvement'],
    default: 'Needs Improvement'
  },

  last_scored: { type: Date, default: null },

  profile_views: { type: Number, default: 0 },
  profile_stars: { type: Number, default: 0 }

}, { timestamps: true });

<<<<<<< HEAD
CandidateSchema.pre('save', async function() {
  try {
    if (this.total_score >= 75) {
      this.tier = 'High Potential';
    } else if (this.total_score >= 50) {
      this.tier = 'Moderate';
    } else {
      this.tier = 'Needs Improvement';
    }
    // No next() needed - async functions return promises
  } catch (err) {
    console.error('Error in Candidate pre-save hook:', err);
    throw err; // Rethrow to stop save
  }
=======
CandidateSchema.pre('save', function () {
  if (this.total_score >= 75) this.tier = 'High Potential';
  else if (this.total_score >= 50) this.tier = 'Moderate';
  else this.tier = 'Needs Improvement';
>>>>>>> cf42a878e44737cf5323d658874f430fa0cae478
});

module.exports = mongoose.model('Candidate', CandidateSchema);