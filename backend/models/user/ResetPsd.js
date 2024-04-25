const mongoose = require('mongoose');

const ResetPsdScheme = new mongoose.Schema({
  rollno: String,
  code: String,
}, {
  timestamps: true
});

const ResetPsd = mongoose.model('resetpsds', ResetPsdScheme);

module.exports = ResetPsd;
