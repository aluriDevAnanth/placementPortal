const mongoose = require('mongoose');

const mentorReviewSchema = new mongoose.Schema({
  sno: String,
  mentorname: String,
  mentoremail: String,
  mentordept: String,
  reviewtype: String,
  rollno: String,
  contactperson: String,
  modeofcom: String,
  menreview: String,
  uploadeddate: Date,
}, {
  timestamps: true,
});

const MentorModel = mongoose.model('mentorreviews', mentorReviewSchema);

module.exports = MentorModel;
