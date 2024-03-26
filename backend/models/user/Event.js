const mongoose = require('mongoose');

const eventScheme = new mongoose.Schema({
  name: String,
  des: String,
  startTime: String,
  endTime: String,
  rec: String,
  students: [],
});

const event = mongoose.model('events', eventScheme);

module.exports = event;
