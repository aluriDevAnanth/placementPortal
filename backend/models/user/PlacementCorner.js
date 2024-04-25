const mongoose = require('mongoose');

const PlacementCornerSchema = new mongoose.Schema({
  name: String,
  CTC: String,
  jodRole: String,
  category: String,
  appStatus: String,
  statusOfPlacement: String,
  batch: String,
  statusOfDrive: String,
  offers: String,
  dateOfVisit: String,
  progressOfCompany: String,
  modeOfDrive: String,
  jobDes: String,
  eligible: Number,
  applied: Number,
  eligibleStudents: [String],
  appliedStudents: [String],
  placedStudents: [String],
  stages: {
    onlineTest: [String],
    GD: [String],
    interview: [String],
    otherStages: [String],
  }
}, {
  timestamps: true
});

const PlacementCorner = mongoose.model('placementcorners', PlacementCornerSchema);

module.exports = PlacementCorner;
