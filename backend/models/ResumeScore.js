const mongoose = require('mongoose');

const SkillDetectedSchema = new mongoose.Schema(
  {
    canonical: String,
    demand_weight: Number,
    sections_present: [String],
    depth: { type: String, enum: ['low', 'medium', 'high'] },
    coherence: Number,
    usage_score: Number,
    skill_score: Number,
  },
  { _id: false }
);

const ResumeScoreSchema = new mongoose.Schema(
  {
    candidate_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Candidate',
      required: true,
      unique: true,
    },

    // Main score
    final_score: { type: Number, min: 0, max: 100, default: 0 },
    detected_role: {
      type: String,
      enum: ['Frontend', 'Backend', 'FullStack', 'Data', 'DevOps', 'Mobile', 'Unknown'],
      default: 'Unknown',
    },

    // Dimension scores
    dimension_scores: {
      market_demand: { type: Number, min: 0, max: 100 },
      evidence: { type: Number, min: 0, max: 100 },
      skill_depth: { type: Number, min: 0, max: 100 },
      structure: { type: Number, min: 0, max: 100 },
      project_strength: { type: Number, min: 0, max: 100 },
    },

    // Penalties
    penalties_applied: {
      keyword_stuffing: { type: Number, default: 0 },
      filler_ratio: { type: Number, default: 0 },
      duplicates: { type: Number, default: 0 },
      wall_of_text: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
    },

    // Skills detected
    skills_detected: [SkillDetectedSchema],

    // Section presence
    section_presence: {
      summary: Boolean,
      experience: Boolean,
      education: Boolean,
      skills: Boolean,
      projects: Boolean,
      certifications: Boolean,
    },

    // Improvement suggestions
    improvement_suggestions: [String],

    // Metadata
    meta: {
      word_count: Number,
      char_count: Number,
      sections_detected: Number,
      skills_total: Number,
      scored_at: Date,
    },

    // ATS compatibility details (for legacy support)
    ats_compatibility: {
      sections: {
        has_contact: Boolean,
        has_experience: Boolean,
        has_education: Boolean,
        has_skills: Boolean,
        has_projects: Boolean,
        has_summary: Boolean,
        section_score: Number,
      },
      keywords: {
        action_verb_count: Number,
        total_word_count: Number,
        density_ratio: Number,
        keyword_score: Number,
      },
      format: {
        is_parseable: Boolean,
        word_count: Number,
        length_score: Number,
        format_score: Number,
      },
    },

    // Parsing info
    parse_success: { type: Boolean, default: true },
    parse_error: String,

    // ✅ FIXED: Store detailed ATS breakdown for transparency
    // New formula: Section(30%) + Keyword(25%) + Format(20%) + Skill(15%) + Project(10%)
    ats_breakdown: {
      section_score: { type: Number, default: 0 },      // 0-100 normalized
      keyword_score: { type: Number, default: 0 },      // 0-100 normalized
      format_score: { type: Number, default: 0 },       // 0-100 normalized
      skill_score: { type: Number, default: 0 },        // 0-100 normalized (NEW)
      project_strength: { type: Number, default: 0 },   // 0-100 normalized (NEW)
      ats_score: { type: Number, default: 0 },          // Final ATS score (0-100)
      resume_contribution: { type: Number, default: 0 } // ATS × 0.3 (0-30)
    },
  },
  { timestamps: true }
);

// Index for efficient queries
ResumeScoreSchema.index({ final_score: -1 });
ResumeScoreSchema.index({ detected_role: 1 });

module.exports = mongoose.model('ResumeScore', ResumeScoreSchema);