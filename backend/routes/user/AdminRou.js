const express = require('express')
const router = express.Router()
const md5 = require('md5');
var isemail = require('isemail');
var jwt = require('jsonwebtoken');
const { format } = require('date-fns')
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');

const upload = multer({ dest: 'uploads/' });

// Models
const LogDet = require('../../models/user/LogDet1');
const LogDet2 = require('../../models/user/LogDet');
const Student = require('../../models/user/Student1');
const Student2 = require('../../models/user/Student');
const Parent = require('../../models/user/Parent');
const Mentor = require('../../models/user/Mentor');
const Att = require('../../models/user/Att')
const Schedule = require('../../models/user/Schedule')
const PlacementCompany = require('../../models/user/PlacementCompany')
const MentorReview = require('../../models/mentor/MentorReview')
const Event = require('../../models/user/Event')

//use
router.use(express.json());

let attToken = '';

function isEventExpired(event) {
  const currentTime = new Date();
  const endTime = new Date(event.endTime);

  if (event.rec === "once") return currentTime > endTime;
}

function isEventHappening(event) {
  const currentTime = new Date(); // Get the current time
  const startTime = new Date(event.startTime);
  const endTime = new Date(event.endTime);

  if (event.rec === "once") {
    return currentTime >= startTime && currentTime <= endTime;
  } else if (event.rec === "daily") {
    const todayStartTime = new Date(startTime);
    todayStartTime.setFullYear(currentTime.getFullYear());
    todayStartTime.setMonth(currentTime.getMonth());
    todayStartTime.setDate(currentTime.getDate());

    const todayEndTime = new Date(endTime);
    todayEndTime.setFullYear(currentTime.getFullYear());
    todayEndTime.setMonth(currentTime.getMonth());
    todayEndTime.setDate(currentTime.getDate());

    return currentTime >= todayStartTime && currentTime <= todayEndTime;
  } else if (event.rec === "weekly") {
    const eventDay = startTime.getDay();
    const currentDay = currentTime.getDay();
    if (eventDay !== currentDay) {
      return false;
    }
    return currentTime >= startTime && currentTime <= endTime;
  } else {
    throw new Error("Invalid recurrence type");
  }
}

function generateRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  attToken = result;
  return result;
}

router.get('/getEvents', async (req, res) => {
  let token;
  const authHeader = req.headers["authorization"];
  if (authHeader !== undefined) {
    token = authHeader.split(" ")[1];
  }

  if (token) {
    try {
      const { username, role } = jwt.verify(token, 'qwertyuiop');
      //console.log(role);
      if (role === "admin" || role === 'coor') {
        let q = await Event.find({});
        const eventsWithExpiration = q.map(event => ({
          ...event.toObject(),
          isExp: isEventExpired(event),
          isHap: isEventHappening(event)
        }));
        res.json({
          success: true,
          data: eventsWithExpiration
        });
      } else {
        res.json({
          success: false,
          error: 'wrong role'
        });
      }
    } catch (error) {
      res.json({
        success: false,
        error: 'invalid token'
      });
    }
  } else {
    res.json({
      success: false,
      error: 'missing token'
    });
  }
});

/* router.get('/getRandomValue', async (req, res) => {
  let token;
  const authHeader = req.headers["authorization"];
  if (authHeader !== undefined) {
    token = authHeader.split(" ")[1];
  }
  if (token) {
    try {
      const { username, role } = jwt.verify(token, 'qwertyuiop');
      if (role === "admin" || role === "coor") {
        const randomValue = generateRandomString(50);
        attToken = randomValue;
        res.json({
          success: true,
          data: { randomValue }
        });
      } else {
        res.status(403).json({
          success: false,
          error: 'wrong role'
        });
      }
    } catch (error) {
      res.status(401).json({
        success: false,
        error: 'invalid token'
      });
    }
  } else {
    res.status(400).json({
      success: false,
      error: 'missing token'
    });
  }
}); */

function generateTokens(classId) {
  const Sessiontokens = [];
  const currentTime = Math.floor(Date.now() / 1000);

  for (let i = 0; i < 10; i++) {
    const token = jwt.sign({ classId, validUntil: currentTime + (i + 1) * 6 }, 'qwertyuiop', { expiresIn: (i + 1) * 6 });
    Sessiontokens.push(token);
  }
  return Sessiontokens;
}

router.post("/startQrSession", (req, res) => {
  const { sessionId } = req.body;

  if (!sessionId) return res.status(400).json({ success: false, message: "Session ID is required" });

  try {
    const tokens = generateTokens(sessionId);
    //console.log(tokens);
    res.json({ success: true, data: { tokens } });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Failed to generate tokens" });
  }
});

router.get('/getEvent/:eid', async (req, res) => {
  let token;
  const { eid } = req.params;
  const authHeader = req.headers["authorization"];
  if (authHeader !== undefined) {
    token = authHeader.split(" ")[1];
  }

  if (token) {
    try {
      const { username, role } = jwt.verify(token, 'qwertyuiop');
      if (role === "admin" || role === "coor") {
        let q = await Event.find({ _id: eid });

        const eventsWithExpiration = q.map(event => ({
          ...event.toObject(),
          isExp: isEventExpired(event),
          isHap: isEventHappening(event)
        }));
        res.json({
          success: true,
          data: eventsWithExpiration
        });
      } else {
        res.json({
          success: false,
          error: 'wrong role'
        });
      }
    } catch (error) {
      res.json({
        success: false,
        error: 'invalid token'
      });
    }
  } else {
    res.json({
      success: false,
      error: 'missing token'
    });
  }
});

router.post('/postEvent', async (req, res) => {
  let token;
  const authHeader = req.headers["authorization"];
  if (authHeader !== undefined) {
    token = authHeader.split(" ")[1];
  }

  if (token) {
    const { username, role } = jwt.verify(token, 'qwertyuiop');

    if (role === "admin") {
      //console.log(req.body.data);
      let q = await Event.create(req.body.data)

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

router.post('/markAtt', async (req, res) => {
  let token;
  const authHeader = req.headers["authorization"];
  if (authHeader !== undefined) {
    token = authHeader.split(" ")[1];
  }

  if (token) {
    const { username, role } = jwt.verify(token, 'qwertyuiop');
    let { rollno } = await Event.find({ name: username })
    if (role === "student") {
      const { rand, eid } = req.body;
      if (attToken == rand) {
        let q = await Event.find({ _id: req.body.eid })
        q.attendance[new Date()].push(rollno)
        res.json({
          success: true,
          data: { message: "done", }
        });
      } else {
        res.json({
          success: false,
          data: { message: "qr Exp" }
        });
      }
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

router.delete('/deleteEvent/:id', async (req, res) => {
  let token;
  const authHeader = req.headers["authorization"];
  if (authHeader !== undefined) {
    token = authHeader.split(" ")[1];
  }

  if (token) {
    const { username, role } = jwt.verify(token, 'qwertyuiop');
    if (role === "admin") {
      const { id } = req.params;
      let q = await Event.findOneAndDelete({ _id: id })
      //console.log(id);
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

router.put('/putEvent', async (req, res) => {
  let token;
  const authHeader = req.headers["authorization"];
  if (authHeader !== undefined) {
    token = authHeader.split(" ")[1];
  }

  if (token) {
    const { username, role } = jwt.verify(token, 'qwertyuiop');

    if (role === "admin") {
      //console.log(11, req.body.data);
      let q = await Event.findByIdAndUpdate({ _id: req.body.data._id }, req.body.data, { new: true })

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

router.post('/addStu', upload.single('file'), async (req, res) => {
  let token;
  const authHeader = req.headers["authorization"];
  if (authHeader !== undefined) {
    token = authHeader.split(" ")[1];
  }
  try {
    if (token) {
      const { username, role } = jwt.verify(token, 'qwertyuiop');

      if (role === "admin") {
        try {
          const file = req.file;
          if (!file) {
            return res.status(400).json({ success: false, error: 'No file uploaded' });
          }

          const workbook = xlsx.readFile(file.path);
          const sheet_name_list = workbook.SheetNames;
          const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
          //console.log(jsonData[0]);
          for (let i of jsonData) {
            const studentExists = await Student2.findOne({ rollno: i.rollno });
            if (!studentExists) {
              await Student2.create({ ...i, yearofpassing: i['year of passing'] });
            }
            const logExists = await LogDet2.findOne({ username: i.rollno });
            if (!logExists) {
              const q = { username: i.rollno, password: md5(i.rollno), role: "student" };
              await LogDet2.create(q);
            }
          }
          res.json({
            success: true,
            data: jsonData
          });

          fs.unlink(file.path, (err) => {
            if (err) {
              console.error('Error deleting the file:', err);
            } else {
              //console.log('Uploaded file deleted successfully');
            }
          });

        } catch (error) {
          console.error('Error processing file:', error);
          res.status(500).json({ success: false, error: 'Error processing file' });
        }

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
  } catch (e) {
    res.json({
      success: false,
      error: 'internal error'
    });
  }

});

router.post('/editStu', async (req, res) => {
  let token;
  const authHeader = req.headers["authorization"];
  try {
    if (authHeader !== undefined) token = authHeader.split(" ")[1];

    if (token) {
      const { username, role } = jwt.verify(token, 'qwertyuiop');
      if (role === "admin") {
        const stu = req.body.stu;
        let s = await Student2.findOneAndUpdate({ _id: stu._id }, { ...stu }, { new: true })
        console.log(1, stu._id, s);
        res.json({ success: true, data: { stu: s } })
      } else {
        res.json({ success: false, error: 'wrong role' });
      }
    } else {
      res.json({ success: false, error: 'wrong token' });
    }
  } catch (e) { res.json({ success: false, error: 'internal error' }); }

});

router.get('/getStu/:year', async (req, res) => {
  let token;
  const authHeader = req.headers["authorization"];
  if (authHeader !== undefined) {
    token = authHeader.split(" ")[1];
  }
  try {
    if (token) {
      const { username, role } = jwt.verify(token, 'qwertyuiop');
      if (role === "admin") {
        const year = parseInt(req.params.year, 10);
        //console.log(year, typeof (year));
        const stu = await Student2.find({ yearofpassing: year });
        res.json({
          success: true,
          data: { stu },
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
  } catch (e) {
    res.json({
      success: false,
      error: 'internal error'
    });
  }

});

router.get('/getYears', async (req, res) => {
  try {
    const distinctYears = await Student2.distinct('yearofpassing');
    res.json({
      success: true,
      data: { years: distinctYears }
    });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

module.exports = router;