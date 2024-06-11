const mongoose = require('mongoose');

const logDetSchema = new mongoose.Schema({
    sno: String,
    username: String,
    password: String,
    role: String,
    deviceInfo: String
}, {
    timestamps: true, minimize: false
});

const LogDet = mongoose.model('login_details2', logDetSchema);

module.exports = LogDet;
