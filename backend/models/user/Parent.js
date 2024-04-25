const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema({
    rollno: String,
    psd: String,
}, {
    timestamps: true
});

const Parent = mongoose.model('parentlogins', parentSchema);

module.exports = Parent;
