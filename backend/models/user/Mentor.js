const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({

    "sno": String,
    "name": String,
    "email": String,
    "cabin": String,
    "dept": String,
    "phoneno": String,
    "role": String,
});



const Mentor = mongoose.model('mentorinfos', mentorSchema);

module.exports = Mentor;
