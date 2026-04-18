const mongoose = require('mongoose');

const ResumeScoreSchema = new mongoose.Schema({
  candidate_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },

  sections: {
    has_contact: Boolean,
    has_experience: Boolean,
    has_education: Boolean,
    has_skills: Boolean,
    has_projects: Boolean,
    has_summary: Boolean,
    section_score: Number
  },

  keywords: {
    action_verb_count: Number,
    total_word_count: Number,
    density_ratio: Number,
    keyword_score: Number
  },

  format: {
    is_parseable: Boolean,
    word_count: Number,
    length_score: Number,
    format_score: Number
  },

  total_ats_score: { type: Number, default: 0 },
  scored_at: { type: Date, default: Date.now }

}, { timestamps: true });

module.exports = mongoose.model('ResumeScore', ResumeScoreSchema);