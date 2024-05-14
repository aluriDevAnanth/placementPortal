const mongoose = require('mongoose');

const StudentFeedbackSchema = new mongoose.Schema({
  monthlyConnect: String,
  monthlyCount: Number,
  meetingConnectionType: String,
  meetingType: String,
  studentFeedback: String,
  stuId: String,
  mentoremail: String,
}, {
  timestamps: true
});

const StudentFeedback = mongoose.model('studentfeedback', StudentFeedbackSchema);

module.exports = StudentFeedback;
