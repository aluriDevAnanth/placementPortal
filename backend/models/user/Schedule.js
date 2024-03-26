const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema(
  {
    sno: String,
    testno: String,
    date: String,
  }
);

const Schedule = mongoose.model('schedules', scheduleSchema);

module.exports = Schedule;
