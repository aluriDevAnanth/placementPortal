const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema({
    rollno: String,
    psd: String,
});

const Parent = mongoose.model('parentlogins', parentSchema);

module.exports = Parent;
