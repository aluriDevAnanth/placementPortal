const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  sno: String,
  name: String,
  rollno: String,
  phone: String,
  parentphone: String,
  email: String,
  mentor: String,
  mentoremail: String,
  branch: String,
  course: String,
  batch: String,
});

const Student = mongoose.model('studentlist', studentSchema);

module.exports = Student;
