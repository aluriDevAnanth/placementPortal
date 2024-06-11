const mongoose = require('mongoose');

const studentSchema2 = new mongoose.Schema({
  "10": String,
  "12": String,
  name: String,
  rollno: String,
  phone: String,
  email: String,
  batch: String,
  personalemail: String,
  gender: String,
  residence: String,
  address: String,
  CGPA: Number,
  leetcode: String,
  codechef: String,
  hackerrank: String,
  crcs: String,
  dept: String,
  parentname: String,
  parentphone: String,
  parentemail: String,
  mentoremail: String,
  spec: String,
  skill: String,
  yearofpassing: String,
  school: String,
  enrollmentstatus: String,
}, { timestamps: true, minimize: false });

const Student = mongoose.model('studentlist2', studentSchema2);

module.exports = Student;
