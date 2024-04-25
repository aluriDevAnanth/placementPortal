const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema(
  {
    sno: String,
    testno: String,
    date: String,
  }, {
  timestamps: true
}
);

const Schedule = mongoose.model('schedules', scheduleSchema);

module.exports = Schedule;
