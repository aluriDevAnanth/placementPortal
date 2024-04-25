const mongoose = require('mongoose');

const placementCompanySchema = new mongoose.Schema({
  sno: String,
  name: String,
  CTC: String,
  category: String,
  contribution: String,
  status: String,
  batch: String,
  offers: String,
  dateofvisit: String,
  arrival: String,
}, {
  timestamps: true
});

const PlacementCompany = mongoose.model('placementcompanies', placementCompanySchema);

module.exports = PlacementCompany;
