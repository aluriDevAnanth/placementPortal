const mongoose = require('mongoose');

const StudentFeedbackSchema = new mongoose.Schema({
  studentFeedback: String,
  stuId: String,
  mentoremail: String,
}, {
  timestamps: true
});

const StudentFeedback = mongoose.model('studentfeedback', StudentFeedbackSchema);

module.exports = StudentFeedback;
