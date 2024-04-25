const mongoose = require('mongoose');

const attScheme = new mongoose.Schema({
  name: String,
  jobRole: String,
  dateOfVisit: String,
  batch: String,
  eligibleStudents: [String],
  statusOfPlacement: String,
  stuFeed: {},
}, {
  timestamps: true
});
new mongoose.Schema({ any: {} })

const Att = mongoose.model('stucompfeed', attScheme);

module.exports = Att;
