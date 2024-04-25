const express = require('express')
const router = express.Router()
const md5 = require('md5');
var isemail = require('isemail');
var jwt = require('jsonwebtoken');
const { parse, isAfter } = require('date-fns');

// Models
const LogDet = require('../../models/user/LogDet');
const Student = require('../../models/user/Student');
const Parent = require('../../models/user/Parent');
const Mentor = require('../../models/user/Mentor');
const Att = require('../../models/user/Att')
const Schedule = require('../../models/user/Schedule')
const PlacementCompany = require('../../models/user/PlacementCompany')
const PlacementCorner = require('../../models/user/PlacementCorner')
const MentorReview = require('../../models/mentor/MentorReview')
const StuCompFeed = require('../../models/user/StuCompFeed')
const StudentFeedback = require('../../models/user/StudentFeedback')

//use
router.use(express.json());

router.get('/getMentorDetails', async (req, res) => {
  try {
    let token;
    const authHeader = req.headers["authorization"];
    if (authHeader !== undefined) {
      token = authHeader.split(" ")[1];
    } else {
      res.json({ success: false, message: 'token error' });
    }
    const { username, role } = jwt.verify(token, 'qwertyuiop');
    if (token) {
      const stu = await Student.findOne({ rollno: username })
      const mentorDetails = await Mentor.findOne({ email: stu.mentoremail })
      res.json({ success: true, data: { men: mentorDetails } });
    } else {
      res.json({ success: false, message: 'token error' });
    }

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "server error" })
  }
})

router.put('/changePassword', async (req, res) => {
  try {
    let token;
    const authHeader = req.headers["authorization"];
    if (authHeader !== undefined) {
      token = authHeader.split(" ")[1];
    } else {
      res.json({ success: false, message: 'token error' });
    }
    const { username, role } = jwt.verify(token, 'qwertyuiop');
    if (token) {
      let parent = await Parent.findOneAndUpdate({ rollno: username }, { psd: md5(req.body.pass) }, { new: true })
      res.json({ success: true, data: { parent } });
    } else {
      res.json({ success: false, message: 'token error' });
    }

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "server error" })
  }
})

module.exports = router;