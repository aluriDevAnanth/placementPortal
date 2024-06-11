const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema(
  {
    name: String,
    date: Date,
    marks: {},
    students: [String],
    batch: String
  }, {
  timestamps: true,
  minimize: false
}
);

const Schedule = mongoose.model('schedules', scheduleSchema);

module.exports = Schedule;
