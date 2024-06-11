const mongoose = require('mongoose');

const annScheme = new mongoose.Schema({
  des: String, batch: String
}, {
  timestamps: true
});

const Ann = mongoose.model('announcements', annScheme);

module.exports = Ann;
