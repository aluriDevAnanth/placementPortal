const mongoose = require('mongoose');

const attScheme = new mongoose.Schema({
  sno: String,
  week: String,
  date: String,
  rollno: String,
  attentype: String,
  attendence: String,
});

const Att = mongoose.model('attendances', attScheme);

module.exports = Att;
