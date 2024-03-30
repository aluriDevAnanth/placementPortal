const mongoose = require('mongoose');

const ResetPsdScheme = new mongoose.Schema({
  rollno: String,
  code: String,
});

const ResetPsd = mongoose.model('resetpsds', ResetPsdScheme);

module.exports = ResetPsd;
