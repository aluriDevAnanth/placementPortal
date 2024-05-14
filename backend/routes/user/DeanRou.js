const express = require('express')
const router = express.Router()
const md5 = require('md5');
var isemail = require('isemail');
var jwt = require('jsonwebtoken');
const { format } = require('date-fns')

// Models
const LogDet = require('../../models/user/LogDet');
const Student = require('../../models/user/Student');
const Parent = require('../../models/user/Parent');
const Mentor = require('../../models/user/Mentor');
const Att = require('../../models/user/Att')
const Schedule = require('../../models/user/Schedule')
const PlacementCompany = require('../../models/user/PlacementCompany')
const MentorReview = require('../../models/mentor/MentorReview')

//use
router.use(express.json());

router.get('/getAllMentors', async (req, res) => {
  console.log(1, req.body)
  let token;
  const authHeader = req.headers["authorization"];
  if (authHeader !== undefined) {
    token = authHeader.split(" ")[1];
  }

  if (token) {
    const mentorList = await Mentor.find({})
    res.json({
      success: true,
      data: { mentorList }
    });
  } else {
    res.json({
      success: false,
      error: 'error'
    });
  }
})

router.get('/getAllFeed', async (req, res) => {
  console.log(1, req.body)
  let token;
  const authHeader = req.headers["authorization"];
  if (authHeader !== undefined) {
    token = authHeader.split(" ")[1];
  }

  if (token) {
    const feedList = await MentorReview.find({})
    res.json({
      success: true,
      data: { feedList }
    });
  } else {
    res.json({
      success: false,
      error: 'error'
    });
  }
})

router.get('/getAllStudents/:year', async (req, res) => {
  //console.log(1, req.body)
  let token;
  const authHeader = req.headers["authorization"];
  if (authHeader !== undefined) {
    token = authHeader.split(" ")[1];
  }

  if (token) {
    const studentList = await Student.find({ batch: req.params.year })
    res.json({
      success: true,
      data: { studentList }
    });
  } else {
    res.json({
      success: false,
      error: 'error'
    });
  }
})

router.get('/getAllComp', async (req, res) => {
  //console.log(1, req.body)
  let token;
  const authHeader = req.headers["authorization"];
  if (authHeader !== undefined) {
    token = authHeader.split(" ")[1];
  }

  if (token) {
    const compList = await PlacementCompany.find({})
    res.json({
      success: true,
      data: { compList }
    });
  } else {
    res.json({
      success: false,
      error: 'error'
    });
  }
})

router.put('/chgnPwd', async (req, res) => {
  //console.log(1, req.body)
  let token;
  const authHeader = req.headers["authorization"];
  if (authHeader !== undefined) {
    token = authHeader.split(" ")[1];
  }

  if (token) {
    const { username, role } = jwt.verify(token, 'qwertyuiop');
    //console.log(username, role)
    if (role === "dean") {
      let q = await LogDet.findOneAndUpdate({ username, role }, {
        password: md5(req.body.pass)
      }, { new: true });
      res.json({
        success: true,
        data: q
      });
    } else {
      res.json({
        success: false,
        error: 'wrong role'
      });
    }

  } else {
    res.json({
      success: false,
      error: 'wrong token'
    });
  }
})

module.exports = router;