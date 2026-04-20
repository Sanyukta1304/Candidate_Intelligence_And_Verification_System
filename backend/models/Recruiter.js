const mongoose = require('mongoose');

const RecruiterSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },

  company_name: { type: String, default: '' },
  company_email: { type: String, default: '' },
  about_company: { type: String, default: '', maxlength: 1000 },
  address: { type: String, default: '' },
  logo_url: { type: String, default: null },

  starred: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' }],

  viewed_profiles: [{
    candidate_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' },
    viewed_at: { type: Date, default: Date.now }
  }],

  profiles_viewed_count: { type: Number, default: 0 },
  profiles_starred_count: { type: Number, default: 0 }

}, { timestamps: true });

module.exports = mongoose.model('Recruiter', RecruiterSchema);