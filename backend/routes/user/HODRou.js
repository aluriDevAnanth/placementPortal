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
const Mentor = require('../../models/mentor/Mentor');
const Att = require('../../models/admin/Att')
const Schedule = require('../../models/admin/Schedule')
const MentorReview = require('../../models/mentor/MentorReview')

//use
router.use(express.json());

router.get('/getAllMentors', async (req, res) => {
  //console.log(1, req.body)
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

router.get('/getMentorList', async (req, res) => {
  //console.log(1, req.body)
  let token;
  const authHeader = req.headers["authorization"];
  if (authHeader !== undefined) {
    token = authHeader.split(" ")[1];
  }

  if (token) {
    try {
      const { username, role } = jwt.verify(token, 'qwertyuiop');
      //console.log(username)
      const mentor = await Mentor.findOne({ email: username }, { dept: 1 });
      if (!mentor) {
        console.error('Mentor not found');
        return;
      }

      // Now, perform the aggregation on the Student collection
      const results = await Student.aggregate([
        { $match: { branch: mentor.dept } }, // Filter by branch
        {
          $group: {
            _id: '$mentor', // Group by mentor
            mentoremail: { $first: '$mentoremail' }, // Get the first mentor email in each group
            menteecount: { $sum: 1 } // Count the number of students in each group
          }
        },
        {
          $project: {
            _id: 0, // Exclude the _id field
            mentor: '$_id', // Rename _id to mentor
            mentoremail: 1, // Include mentor email
            menteecount: 1 // Include mentee count
          }
        }
      ]);

      results.sort((a, b) => {
        if (a.mentor < b.mentor) {
          return -1;
        }
        if (a.mentor > b.mentor) {
          return 1;
        }
        return 0;
      });

      res.json({ success: true, data: { results } })
    } catch (error) {
      console.error(error);
    }
  } else {
    res.json({
      success: false,
      error: 'error'
    });
  }
})

router.get('/getAllFeed', async (req, res) => {
  //console.log(1, req.body)
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

router.get('/getAllStudents', async (req, res) => {
  //console.log(1, req.body)
  let token;
  const authHeader = req.headers["authorization"];
  if (authHeader !== undefined) {
    token = authHeader.split(" ")[1];
  }

  if (token) {
    const studentList = await Student.find({})
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