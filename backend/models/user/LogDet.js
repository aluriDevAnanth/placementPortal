const mongoose = require('mongoose');

const logDetSchema = new mongoose.Schema({
    sno: String,
    username: String,
    password: String,
    role: String
}, {
    timestamps: true
});

const LogDet = mongoose.model('login_details', logDetSchema);

module.exports = LogDet;
