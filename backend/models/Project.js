const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  candidate_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },

  title: { type: String, required: true },
  description: { type: String, required: true },
  github_link: { type: String, required: true },

  tech_stack: [{ type: String }],

  github_owner: { type: String, default: null },
  github_repo: { type: String, default: null },

  is_public: { type: Boolean, default: false },
  has_readme: { type: Boolean, default: false },
  repo_description: { type: String, default: null },
  repo_language: { type: String, default: null },

  total_commits: { type: Number, default: 0 },
  user_commits: { type: Number, default: 0 },
  user_commit_ratio: { type: Number, default: 0 },

  last_pushed_at: { type: Date, default: null },
  user_is_contributor: { type: Boolean, default: false },

  verified: { type: Boolean, default: false },
  project_score: { type: Number, default: 0 },

  score_breakdown: {
    public_score: { type: Number, default: 0 },
    readme_score: { type: Number, default: 0 },
    user_commit_score: { type: Number, default: 0 },
    ratio_score: { type: Number, default: 0 },
    volume_score: { type: Number, default: 0 },
    recency_score: { type: Number, default: 0 },
    meta_score: { type: Number, default: 0 }
  },

  verified_at: { type: Date, default: null }

}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);