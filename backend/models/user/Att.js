const mongoose = require('mongoose');

const attScheme = new mongoose.Schema({
  sno: String,
  week: String,
  date: String,
  rollno: String,
  attentype: String,
  attendence: String,
}, {
  timestamps: true
});

const Att = mongoose.model('attendances', attScheme);

module.exports = Att;
