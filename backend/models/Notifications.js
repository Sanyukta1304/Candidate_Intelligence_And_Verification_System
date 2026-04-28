const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  recipient_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  type: {
    type: String,
    enum: ['profile_viewed', 'profile_starred', 'shortlisted'],
    required: true
  },

  recruiter_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Recruiter' },
  recruiter_name: String,
  company_name: String,

  read: { type: Boolean, default: false }

}, { timestamps: true });

NotificationSchema.index({ recipient_id: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', NotificationSchema);