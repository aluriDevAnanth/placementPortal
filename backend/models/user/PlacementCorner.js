const mongoose = require('mongoose');

const PlacementCornerSchema = new mongoose.Schema({
  name: String,
  arrival: String,
  CTC: String,
  jodRole: String,
  category: String,
  appStatus: String,
  statusOfPlacement: String,
  batch: String,
  statusOfDrive: String,
  offers: String,
  dateOfVisit: Date,
  progressOfCompany: String,
  modeOfDrive: String,
  jobDes: String,
  eligible: Number,
  applied: Number,
  eligibleStudents: [String],
  appliedStudents: [String],
  shortlistedStudents: [String],
  placedStudents: [String],
  stages: {
    onlineTest: {},
    GD: {},
    interview: {},
    HR: {},
    otherStages: {}
  },
  stuFeed: {},
}, {
  timestamps: true
});

const PlacementCorner = mongoose.model('placementcorners', PlacementCornerSchema);

module.exports = PlacementCorner;
