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

function parseDate(dateString) {
  const [day, month, year] = dateString.split('-');
  return parse(`${year}-${month}-${day}`, 'yyyy-MM-dd', new Date());
}

router.get('/getMyInfo', async (req, res) => {
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
      const stu = await Student.find({ rollno: username })
      res.json({ success: true, data: { stu } });
    } else {
      res.json({ success: false, message: 'token error' });
    }

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "server error" })
  }
})

router.get('/getAtt/:rollno', async (req, res) => {
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
      const att1 = await Att.find({ rollno: req.params.rollno })
      const groupedResults = {};
      att1.forEach((result) => {
        const rollno = result.rollno;
        const attendType = result.attentype.toLowerCase();
        const week = result.week;

        if (!groupedResults[rollno]) {
          groupedResults[rollno] = {};
        }

        if (!groupedResults[rollno][attendType]) {
          groupedResults[rollno][attendType] = {};
        }

        if (!groupedResults[rollno][attendType][week]) {
          groupedResults[rollno][attendType][week] = [];
        }

        groupedResults[rollno][attendType][week].push(result);
      });

      const att = { ...groupedResults }

      res.json({ success: true, data: { att } });
    } else {
      res.json({ success: false, message: 'token error' });
    }

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "server error" })
  }
})

router.get('/setComp/:batch', async (req, res) => {
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
      const comp = await PlacementCorner.find({ batch: req.params.batch })
      res.json({ success: true, data: { comp } });
    } else {
      res.json({ success: false, message: 'token error' });
    }

  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: "server error" })
  }
})

router.get('/getStuCompFeed/:year', async (req, res) => {
  try {
    let token;
    const authHeader = req.headers["authorization"];
    if (authHeader !== undefined) {
      token = authHeader.split(" ")[1];
    } else {
      res.json({ success: false, message: 'token error' });
    }
    const { username: rollno, role } = jwt.verify(token, 'qwertyuiop');
    if (token) {
      const comp = await StuCompFeed.find({ batch: req.params.year });
      const today = new Date();
      let feed = comp.map((q, i) => {
        const dateOfVisit = parseDate(q.dateOfVisit);
        if (q.eligibleStudents && q.eligibleStudents.includes(rollno) && isAfter(today, dateOfVisit)) {
          return { ...q.toObject(), completed: Object.keys(q.stuFeed).includes(rollno) };
        }
      }).filter(Boolean);

      let completed = true;
      feed.map((q, i) => {
        completed = completed && q.completed
      })
      res.json({ success: true, data: { feed, completed } });
    } else {
      res.json({ success: false, message: 'token error' });
    }

  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: "server error" })
  }
})

router.post('/postStuCompFeed', async (req, res) => {
  try {
    let token;
    const authHeader = req.headers["authorization"];
    if (authHeader !== undefined) {
      token = authHeader.split(" ")[1];
    } else {
      res.json({ success: false, message: 'token error' });
      return; // Ensure to exit the function after sending the response
    }
    const { username, role } = jwt.verify(token, 'qwertyuiop');
    if (token) {
      const { values, rollno, name } = req.body;
      const updateObj = {};
      updateObj[`stuFeed.${rollno}`] = values;
      SCF = await StuCompFeed.findOneAndUpdate({ name }, updateObj, { new: true });
      res.json({ success: true, data: { SCF } });
    } else {
      res.json({ success: false, message: 'token error' });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: "server error" });
  }
});

router.get('/getFeedbackPageDetails', async (req, res) => {
  try {
    let token;
    const authHeader = req.headers["authorization"];
    if (authHeader !== undefined) {
      token = authHeader.split(" ")[1];
    } else {
      res.json({ success: false, message: 'token error' });
      return;
    }
    const { username, role } = jwt.verify(token, 'qwertyuiop');
    if (username) {
      const user = await Student.findOne({ rollno: username })
      const placeCom = await PlacementCompany.find({ batch: user.batch })
      const studentfeedback = await StudentFeedback.find({ stuId: user._id })
      res.json({ success: true, data: { placeCom, studentfeedback } });
    } else {
      res.json({ success: false, message: 'token error' });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: "server error" });
  }
});

router.post('/postStuFeed', async (req, res) => {
  try {
    let token;
    const authHeader = req.headers["authorization"];
    if (authHeader !== undefined) {
      token = authHeader.split(" ")[1];
    } else {
      res.json({ success: false, message: 'token error' });
      return;
    }
    const { username, role } = jwt.verify(token, 'qwertyuiop');
    if (username) {
      const { values } = req.body; console.log(values);
      const studentfeedback = await StudentFeedback.create({ ...values })
      res.json({ success: true, data: { studentfeedback } });
    } else {
      res.json({ success: false, message: 'token error' });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: "server error" });
  }
});

router.put('/updateStuFeed', async (req, res) => {
  try {
    let token;
    const authHeader = req.headers["authorization"];
    if (authHeader !== undefined) {
      token = authHeader.split(" ")[1];
    } else {
      res.json({ success: false, message: 'token error' });
      return;
    }
    const { username, role } = jwt.verify(token, 'qwertyuiop');
    if (username) {
      const { values } = req.body
      const studentfeedback = await StudentFeedback.findOneAndUpdate({ _id: values._id }, values, { new: true })
      res.json({ success: true, data: { studentfeedback } });
    } else {
      res.json({ success: false, message: 'token error' });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: "server error" });
  }
});

router.put('/changePassword', async (req, res) => {
  try {
    let token;
    const authHeader = req.headers["authorization"];
    if (authHeader !== undefined) {
      token = authHeader.split(" ")[1];
    } else {
      res.json({ success: false, message: 'token error' });
      return;
    }
    const { username, role } = jwt.verify(token, 'qwertyuiop');
    if (username) {
      const { pass } = req.body
      const stu = await LogDet.findOneAndUpdate({ username }, { password: md5(pass) }, { new: true })
      res.json({ success: true, data: { username } });
    } else {
      res.json({ success: false, message: 'token error' });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: "server error" });
  }
});

module.exports = router;