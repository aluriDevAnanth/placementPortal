const express = require('express')
const router = express.Router()
const md5 = require('md5');
var isemail = require('isemail');
var jwt = require('jsonwebtoken');
const { parse, isAfter } = require('date-fns');
const path = require('path');
const axios = require('axios');
const jsdom = require("jsdom");

const { JSDOM } = jsdom;

// Models
const LogDet = require('../../models/user/LogDet');
const Student = require('../../models/user/Student');
const Parent = require('../../models/user/Parent');
const Mentor = require('../../models/user/Mentor');
const Att = require('../../models/user/Att')
const Event = require('../../models/user/Event')
const Schedule = require('../../models/user/Schedule')
const PlacementCompany = require('../../models/user/PlacementCompany')
const PlacementCorner = require('../../models/user/PlacementCorner')
const MentorReview = require('../../models/mentor/MentorReview')
const StudentFeedback = require('../../models/user/StudentFeedback')
const Ann = require('../../models/admin/Ann');

//use
router.use(express.json());

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
      const att = await Att.find({ rollno: req.params.rollno, attentype: "Technical" })

      res.json({ success: true, data: { att } });
    } else {
      res.json({ success: false, message: 'token error' });
    }

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "server error" })
  }
})

router.get('/getEventAtt/:rollno', async (req, res) => {
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
      const att = await Event.find({ students: { $in: [req.params.rollno] } });
      res.json({ success: true, data: { att } });
    } else {
      res.json({ success: false, message: 'token error' });
    }

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "server error" })
  }
})

router.get('/getComp/:batch', async (req, res) => {
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
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.json({ success: false, message: 'token error' });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.json({ success: false, message: 'token error' });
    }

    const { username: rollno, role } = jwt.verify(token, 'qwertyuiop');

    const comp = await PlacementCorner.find({ batch: req.params.year });
    const today = new Date();

    let feed = comp.map((q) => {
      if (q.eligibleStudents && q.eligibleStudents.includes(rollno) && isAfter(today, q.dateOfVisit)) {
        return { ...q.toObject(), completed: Object.keys(q.stuFeed).includes(rollno) };
      }
    }).filter(Boolean);

    let completed = feed.every(q => q.completed);

    return res.json({ success: true, data: { feed, completed } });

  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: "server error" });
  }
});


router.post('/postStuCompFeed', async (req, res) => {
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
    if (token) {
      const { values, rollno, name } = req.body;
      const updateObj = {};
      updateObj[`stuFeed.${rollno}`] = values;
      SCF = await PlacementCorner.findOneAndUpdate({ name }, updateObj, { new: true });
      res.json({ success: true, data: { SCF } });
    } else {
      res.json({ success: false, message: 'token error' });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: "server error" });
  }
});

router.get('/getStuMenFeed', async (req, res) => {
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
      const stuFeed = await StudentFeedback.find({ stuId: username })
      res.json({ success: true, data: { stuFeed } });
    } else {
      res.json({ success: false, message: 'token error' });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: "server error" });
  }
});

router.post('/postStuMenFeed', async (req, res) => {
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
      const { values } = req.body;
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

router.put('/updateStuMenFeed', async (req, res) => {
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

router.get('/getCom/:year', async (req, res) => {
  let token;
  const authHeader = req.headers["authorization"];
  if (authHeader !== undefined) {
    token = authHeader.split(" ")[1];
  }

  if (token) {
    const { username, role } = jwt.verify(token, 'qwertyuiop');
    //console.log(role);
    if (role === "student" || role === "parent" || role === "mentor") {
      //console.log(req.params.year)
      const com = await PlacementCompany.find({ batch: req.params.year })
      res.json({
        success: true,
        data: com
      });
    }
  } else {
    res.json({
      success: false,
      error: 'error'
    });
  }
})

router.get('/downloadPlacementPolicy', (req, res) => {
  try {
    const filePath = path.join(__dirname, '../../files/Placement_policy_final_version.pdf');
    res.download(filePath);
  } catch (error) {
    console.log(error);
  }
});

const query = `
  query getUserProfile($username: String!) {
    allQuestionsCount {
      difficulty
      count
    }
    matchedUser(username: $username) {
      contributions {
        points
      }
      profile {
        reputation
        ranking
      }
      submissionCalendar
      submitStats {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
        totalSubmissionNum {
          difficulty
          count
          submissions
        }
      }
    }
    recentSubmissionList(username: $username) {
      title
      titleSlug
      timestamp
      statusDisplay
      lang
      __typename
    }
    matchedUserStats: matchedUser(username: $username) {
      submitStats: submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
          submissions
          __typename
        }
        totalSubmissionNum {
          difficulty
          count
          submissions
          __typename
        }
        __typename
      }
    }
  }
`;

const formatData = (data) => {
  let sendData = {
    totalSolved: data.matchedUser.submitStats.acSubmissionNum[0].count,
    easySolved: data.matchedUser.submitStats.acSubmissionNum[1].count,
    mediumSolved: data.matchedUser.submitStats.acSubmissionNum[2].count,
    hardSolved: data.matchedUser.submitStats.acSubmissionNum[3].count,
    Globalranking: data.matchedUser.profile.ranking,
  }
  return sendData;
}

router.get('/getPracDet', async (req, res) => {
  let token;
  const authHeader = req.headers["authorization"];
  if (authHeader !== undefined) {
    token = authHeader.split(" ")[1];
  }

  if (token) {
    const { username, role } = jwt.verify(token, 'qwertyuiop');
    //console.log(role);
    if (role === "student" || role === "parent" || role === "mentor") {
      const fetch = require('node-fetch');
      try {
        let chef = await axios.get(`https://www.codechef.com/users/ananth12345`);
        chef = new JSDOM(chef.data);
        chef = chef.window.document;

        let leet = await fetch('https://leetcode.com/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Referer': 'https://leetcode.com'
          },
          body: JSON.stringify({ query: query, variables: { username: 'devananth_aluri' } }),
        })
        leet = await leet.json()
        leet = formatData(leet.data);
        //console.log(leet);

        res.status(200).send({
          success: true,
          data: {
            codechef: {
              name: chef.querySelector('.user-details-container').children[0].children[1].textContent,
              stars: chef.querySelector('.rating').textContent || "unrated",
              currentRating: parseInt(chef.querySelector(".rating-number").textContent),
              highestRating: parseInt(chef.querySelector(".rating-number").parentNode.children[4].textContent.split('Rating')[1]),
              globalRank: parseInt(chef.querySelector('.rating-ranks').children[0].children[0].children[0].children[0].innerHTML),
              countryRank: parseInt(chef.querySelector('.rating-ranks').children[0].children[1].children[0].children[0].innerHTML),
            },
            leetcode: {
              ...leet
            }
          }
        });
      } catch (err) {
        console.log(err);
        res.send({ success: false, error: err });
      }

    }
  } else {
    res.json({
      success: false,
      error: 'error'
    });
  }
})

router.get('/getAnn/:year', async (req, res) => {
  try {
    let token;
    const authHeader = req.headers["authorization"];
    if (authHeader !== undefined) token = authHeader.split(" ")[1];
    if (token) {
      const { username, role } = jwt.verify(token, 'qwertyuiop');
      if (role === "student") {
        const q = await Ann.findOne({ batch: req.params.year }).sort({ createdAt: -1 });
        return res.json({ success: true, data: { ann: q } });
      } else {
        return res.json({ success: false, error: 'wrong role' });
      }
    } else {
      return res.json({ success: false, error: 'wrong token' });
    }
  } catch (error) {
    return res.json({ success: false, error: 'internal server error' });
  }
  let token;
  const authHeader = req.headers["authorization"];
  if (authHeader !== undefined) token = authHeader.split(" ")[1];
  if (token) {
    const { username, role } = jwt.verify(token, 'qwertyuiop');
    if (role === "student") {
      const q = await Ann.findOne({ batch: req.params.year }).sort({ createdAt: -1 });
      return res.json({ success: true, data: { ann: q } });
    } else {
      return res.json({ success: false, error: 'wrong role' });
    }
  } else {
    return res.json({ success: false, error: 'wrong token' });
  }
})

module.exports = router;