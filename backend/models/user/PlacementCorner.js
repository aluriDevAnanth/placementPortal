const mongoose = require('mongoose');

const PlacementCornerSchema = new mongoose.Schema({
  name: String,
  arrival: String,
  CTC: String,
  jobRole: String,
  jobLoc: String,
  eligibility: [String],
  category: String,
  appStatus: String,
  statusOfPlacement: String,
  batch: String,
  driveStatus: String,
  offers: String,
  dateOfVisit: Date,
  progressOfCompany: String,
  modeOfDrive: String,
  jobDes: mongoose.Schema.Types.Mixed,
  eligible: Number,
  "10": String,
  "12": String,
  CGPA: String,
  branches: [String],
  applied: Number,
  eligibleStudents: [String],
  appliedStudents: [String],
  shortlistedStudents: [String],
  placedStudents: [String],
  stages: {
    onlineTest: {},
    GD: {},
    interview1: {},
    interview2: {},
    interview3: {},
    HR: {},
    otherStages: {}
  },
  stuFeed: {},
}, {
  timestamps: true
});

const PlacementCorner = mongoose.model('placementcorners', PlacementCornerSchema);

module.exports = PlacementCorner;
