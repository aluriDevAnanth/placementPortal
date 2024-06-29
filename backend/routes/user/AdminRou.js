const express = require('express')
const router = express.Router()
const md5 = require('md5');
var jwt = require('jsonwebtoken');
const { format, parse, parseISO } = require('date-fns')
const multer = require('multer');
const fs = require('fs');
const csv = require('csv-parser');

const upload = multer({ dest: 'uploads/' });

// Models 
const LogDet = require('../../models/user/LogDet');
const Student = require('../../models/user/Student');
const Parent = require('../../models/user/Parent');
const Mentor = require('../../models/mentor/Mentor');
const Att = require('../../models/admin/Att')
const Schedule = require('../../models/admin/Schedule')
const MentorReview = require('../../models/mentor/MentorReview')
const Event = require('../../models/admin/Event');
const PlacementCorner = require('../../models/admin/PlacementCorner');
const Ann = require('../../models/admin/Ann');

//use
router.use(express.json());

function isEventExpired(event) {
  const currentTime = new Date();
  const endTime = new Date(event.endTime);

  if (event.rec === "once") return currentTime > endTime;
}

function isEventHappening(event) {
  const currentTime = new Date();
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
    throw new Error("Invalid recurrence type in data it is niether daily, weekly or once");
  }
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
        res.json({ success: false, error: 'wrong role' });
      }
    } catch (error) {
      console.log(error);
      res.json({ success: false, error: 'invalid token' });
    }
  } else {
    res.json({
      success: false,
      error: 'missing token'
    });
  }
});

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
      //console.log(req.body);
      let q = await Event.create({ ...req.body.data, attendance: {} })

      res.json({ success: true, data: q });

    } else {
      res.json({ success: false, error: 'wrong role' });
    }

  } else {
    res.json({ success: false, error: 'wrong token' });
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
      res.json({ success: true, data: q });

    } else {
      res.json({ success: false, error: 'wrong role' });
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

router.post('/addBulkStu', upload.single('file'), async (req, res) => {
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

          const results = [];
          fs.createReadStream(file.path)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
              const parentAccounts = [];
              for (let i of results) {
                //console.log(i);
                const studentExists = await Student.findOne({ rollno: i.rollno });
                if (!studentExists) {
                  await Student.create({ ...i, yearofpassing: i['year of passing'] });
                }
                const logExists = await LogDet.findOne({ username: i.rollno });

                if (!logExists) {
                  const q = { username: i.rollno, password: md5(i.rollno), role: "student", deviceInfo: "" };
                  let rand = (Math.floor(Math.random() * 1000000) + 1).toString().trim();
                  let p = { username: `${i.rollno}_parent`, password: md5(md5(`${i.rollno}_parent`)), role: "parent", deviceInfo: "" };
                  await LogDet.create(q);
                  let pp = await LogDet.create(p);
                  parentAccounts.push({ ...p, password: md5(`${i.rollno}_parent`) });
                }
              }
              res.json({ success: true, data: results });

              fs.writeFile('parentDet.json', JSON.stringify(parentAccounts, null, 2), (err) => {
                if (err) {
                  console.error("Error writing file:", err);
                } else {
                  console.log(`File has been saved as 'parentDet.json'`);
                }
              });

              fs.unlink(file.path, (err) => {
                if (err) {
                  console.error('Error deleting the file:', err);
                } else {
                  console.log('Uploaded file deleted successfully');
                }
              });
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
        let s = await Student.findOneAndUpdate({ _id: stu._id }, { ...stu }, { new: true });
        //console.log('updated student: ', s);
        res.json({ success: true, data: { stu: s } })
      } else {
        res.json({ success: false, error: 'wrong role' });
      }
    } else {
      res.json({ success: false, error: 'wrong token' });
    }
  } catch (e) {
    // console.log(e); 
    res.json({ success: false, error: 'internal error' });
  }

});

router.post('/addSingleStu', async (req, res) => {
  let token;
  const authHeader = req.headers["authorization"];
  if (authHeader !== undefined) token = authHeader.split(" ")[1];
  try {
    if (token) {
      const { username, role } = jwt.verify(token, 'qwertyuiop');
      if (role === "admin") {
        let s = await Student.create(req.body.stu)
        //console.log(s);
        res.json({ success: true, data: { stu: s } });
      } else {
        res.json({ success: false, error: 'wrong role' });
      }
    } else {
      res.json({ success: false, error: 'wrong token' });
    }
  } catch (e) {
    console.log(e);
    res.json({ success: false, error: 'internal error' });
  }

});

router.get('/getStu/:year', async (req, res) => {
  let token;
  const authHeader = req.headers["authorization"];
  if (authHeader !== undefined) token = authHeader.split(" ")[1];
  try {
    if (token) {
      const { username, role } = jwt.verify(token, 'qwertyuiop');
      if (role === "admin") {
        const year = parseInt(req.params.year, 10);
        //console.log(year, typeof (year));
        const stu = await Student.find({ yearofpassing: year });
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

router.post('/getStuLogDet', async (req, res) => {
  let token;
  const authHeader = req.headers["authorization"];
  if (authHeader !== undefined) token = authHeader.split(" ")[1];
  try {
    if (token) {
      const { username, role } = jwt.verify(token, 'qwertyuiop');
      if (role === "admin") {
        const stu = await LogDet.find({ username: { $in: req.body.stu } })
        res.json({ success: true, data: { stu } });
      } else {
        res.json({ success: false, error: 'wrong role' });
      }

    } else {
      res.json({ success: false, error: 'wrong token' });
    }
  } catch (e) {
    res.json({ success: false, error: 'internal error' });
  }
});

router.post('/editStuLogDet', async (req, res) => {
  let token;
  const authHeader = req.headers["authorization"];
  if (authHeader !== undefined) token = authHeader.split(" ")[1];
  try {
    if (token) {
      const { username, role } = jwt.verify(token, 'qwertyuiop');
      if (role === "admin") {
        const stu = await LogDet.findOneAndUpdate({ username: req.body.stu.username }, req.body.stu, { new: true })
        res.json({ success: true, data: { stu } });
      } else {
        res.json({ success: false, error: 'wrong role' });
      }
    } else {
      res.json({ success: false, error: 'wrong token' });
    }
  } catch (e) {
    res.json({ success: false, error: 'internal error' });
  }
});

router.get('/getYears', async (req, res) => {
  try {
    //console.log(11);
    const distinctYears = await Student.distinct('yearofpassing');
    //console.log(distinctYears);
    res.json({ success: true, data: { years: distinctYears } });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

router.post('/postMentorThroughEmail', async (req, res) => {
  let q = req.body.emails
  //console.log(q);
  for (let i of q) {
    let mentorExists = await Mentor.findOne({ where: { email: i } });

    if (!mentorExists) {
      await Mentor.create({
        "name": "",
        "email": i,
        "cabin": "",
        "dept": "",
        "phoneno": "",
        "role": "mentor"
      });

      await LogDet2.create({
        "username": i,
        "password": md5(i),
        "role": "mentor",
      });
    }
  }
  res.json({ success: true, data: { q } })
})

router.post("/markAtt", async (req, res) => {
  const { qr_data, rollno } = req.body;
  let token;
  const authHeader = req.headers["authorization"];
  if (authHeader !== undefined) {
    token = authHeader.split(" ")[1];
  }

  if (token) {
    try {
      const sessionId = jwt.verify(qr_data, "qwertyuiop");
      const { classId } = sessionId;
      const CurrEvt = await Event.findById(classId);

      if (!CurrEvt) {
        return res
          .status(404)
          .json({ success: false, message: "Event not found" });
      }

      const today = new Date().toLocaleDateString("en-GB").split("/").join("-");
      if (!CurrEvt.attendance[today]) {
        CurrEvt.attendance[today] = [];
      } else if (CurrEvt.attendance[today].includes(rollno)) {
        return res.status(201).json({
          success: false,
          message: "Duplicate attendance found",
        });
      }
      CurrEvt.attendance[today].push(rollno);

      await Event.findByIdAndUpdate(
        classId,
        { attendance: CurrEvt.attendance },
        { new: true }
      );

      return res.json({
        success: true,
        data: { message: "Attendance marked successfully" },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "QR verification failed",
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: "Authorization token is missing or invalid",
    });
  }
});

router.post("/submitStdAtt", async (req, res) => {
  const { roll_numbers, sessionid } = req.body;
  //console.log(roll_numbers, sessionid);

  if (!roll_numbers || !sessionid) {
    return res.status(400).json({
      success: false,
      message: "Roll numbers and session ID are required",
    });
  }

  try {
    const CurrEvt = await Event.findById(sessionid);

    if (!CurrEvt) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const today = new Date().toLocaleDateString("en-GB").split("/").join("-");

    if (!CurrEvt.attendance[today]) {
      CurrEvt.attendance[today] = [];
    }

    CurrEvt.attendance[today] = [...CurrEvt.attendance[today], ...roll_numbers];

    await Event.findByIdAndUpdate(
      sessionid,
      { attendance: CurrEvt.attendance },
      { new: true }
    );

    return res.json({
      success: true,
      data: { message: "Attendance marked successfully" },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit attendance",
    });
  }
});

router.post('/addCompBulk', upload.single('file'), async (req, res) => {
  try {
    // Check if token is provided in the request headers
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ success: false, error: 'Authorization token not provided' });
    }
    const token = authHeader.split(" ")[1];

    // Verify the token and extract username and role
    const { username, role } = jwt.verify(token, 'qwertyuiop');

    // Check if the role is 'admin'
    if (role !== "admin") {
      return res.status(403).json({ success: false, error: 'Insufficient permissions' });
    }

    // Check if a file is uploaded
    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    // Parse the CSV file and convert it to JSON
    const jsonData = await new Promise((resolve, reject) => {
      const results = [];
      fs.createReadStream(file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', (err) => reject(err));
    });


    jsonData.forEach(q => {
      ['eligibleStudents', 'appliedStudents', 'shortlistedStudents', 'onlineTest', 'GD', 'interview1', 'interview2', 'interview3', 'HR', 'otherStages', 'placedStudents'].forEach(h => {
        if (typeof q[h] === 'string') {
          q[h] = q[h].split('\n').map(item => item.trim()).filter(item => item !== '');
        }
      });

      if (typeof q.branches === 'string') {
        q.branches = q.branches.split(',').map(item => item.trim()).filter(item => item !== '');
      }
    });

    let comp = [];

    for (const q of jsonData) {
      console.log('11', q);
      let stages = {
        "onlineTest": {},
        "GD": {},
        "interview1": {},
        "interview2": {},
        "interview3": {},
        "HR": {},
        "otherStages": {}
      }

      let valid = Object.keys(stages).map(s => q[s].length > 0 && s).filter(stage => stage);

      console.log(valid);
      if (valid.length !== 0) {
        for (let i of q.shortlistedStudents) {
          if (q[valid[0]].includes(i)) {
            stages[valid[0]][i] = 'cleared';
          } else {
            stages[valid[0]][i] = 'not cleared';
          }
        }

        for (let i = 1; i < valid.length; i++) {
          for (let r of q[valid[i - 1]]) {
            if (q[valid[i]].includes(r)) {
              stages[valid[i]][r] = 'cleared';
            } else {
              stages[valid[i]][r] = 'not cleared';
            }
          }
        }
      }

      Object.keys(stages).forEach(s => {
        if (!valid.includes(s) || Object.keys(stages[s]).length === 0) {
          stages[s] = 'not applicable';
        }
      });

      q.stages = stages;

      if (await PlacementCorner.findOne({ name: q.name })) {
        let updatedDocument = await PlacementCorner.findOneAndUpdate({ name: q.name }, { ...q }, { new: true });
        comp.push(updatedDocument);
      } else {
        let newDocument = await PlacementCorner.create({ ...q, stages, stuFeed: {} });
        comp.push(newDocument);
      }
    }

    res.json({ success: true, data: { comp, jsonData } });

    fs.unlink(file.path, (err) => {
      if (err) {
        console.error('Error deleting the file:', err);
      }
    });
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ success: false, error: 'Error processing file' });
  }
});

router.post('/addSingleComp', async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ success: false, error: 'Authorization token not provided' });

    const token = authHeader.split(" ")[1];
    const { username, role } = jwt.verify(token, 'qwertyuiop');

    if (role !== "admin") return res.status(403).json({ success: false, error: 'Insufficient permissions' });

    //console.log(req.body.comp);
    let com = await PlacementCorner.create(req.body.comp)
    res.json({ success: true, data: { comp: com } });
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

router.post('/editComp', async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ success: false, error: 'Authorization token not provided' });

    const token = authHeader.split(" ")[1];
    const { username, role } = jwt.verify(token, 'qwertyuiop');

    if (role !== "admin") return res.status(403).json({ success: false, error: 'Wrong role' });
    let com = await PlacementCorner.findOneAndUpdate({ _id: req.body.comp._id }, req.body.comp, { new: true })
    //console.log(com);
    res.json({ success: true, data: { comp: com } });
  } catch (error) {
    console.error('Error at editCom', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

router.post('/addAttBulk', upload.single('file'), async (req, res) => {
  try {
    // Check if token is provided in the request headers
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ success: false, error: 'Authorization token not provided' });
    }
    const token = authHeader.split(" ")[1];

    // Verify the token and extract username and role
    const { username, role } = jwt.verify(token, 'qwertyuiop');

    // Check if the role is 'admin'
    if (role !== "admin") {
      return res.status(403).json({ success: false, error: 'Insufficient permissions' });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    // Function to parse CSV file
    const csvToJson = (filePath) => {
      return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', (data) => results.push(data))
          .on('end', () => resolve(results))
          .on('error', (err) => reject(err));
      });
    };

    const jsonData = await csvToJson(file.path);

    for (const eve of jsonData) {
      try {
        //eve.date = format(parseISO(eve.date), 'dd-MM-yyyy');
        eve.rollno = eve.rollno.split('\n').map(rollno => rollno.trim());
        let curr = await Event.findOne({ name: eve.name });

        if (curr) {
          if (!curr.attendance) {
            curr.attendance = {};
          }
          if (curr.attendance[eve.date]) {
            curr.attendance[eve.date] = Array.from(new Set(curr.attendance[eve.date].concat(eve.rollno)));
          } else {
            curr.attendance[eve.date] = eve.rollno;
          }
          await Event.findOneAndUpdate({ name: eve.name }, { attendance: curr.attendance }, { new: true });
        } else {
          console.log(`Event not found: ${eve.name}`);
        }
      } catch (error) {
        console.error(`Error updating attendance for event: ${eve.name}`, error);
      }
    }

    res.json({ success: true, data: { jsonData } });

    fs.unlink(file.path, (err) => {
      if (err) {
        console.error('Error deleting the file:', err);
      }
    });
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ success: false, error: 'Error processing file' });
  }
});

router.post('/getAtt/:batch', async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.json({ success: false, error: 'Authorization token not provided' });
    const token = authHeader.split(" ")[1];
    const { username, role } = jwt.verify(token, 'qwertyuiop');
    if (role !== "admin") return res.json({ success: false, error: 'wrong role' });
    let rollno = req.body.rollno;
    let q = {};

    await Promise.all(rollno.map(async qq => {
      const att = await Event.find({ students: { $in: [qq] } });
      q[qq] = att;
    }));

    res.json({ success: true, data: { att: q } });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, error: 'internal error' })
  }
})

router.post('/addSingleTest', async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.json({ success: false, error: 'Authorization token not provided' });
    const token = authHeader.split(" ")[1];
    const { username, role } = jwt.verify(token, 'qwertyuiop');

    if (role !== "admin") return res.json({ success: false, error: 'Wrong Role' });

    //console.log('addTests', req.body.test);
    const { test } = req.body;

    let q = await Schedule.create(test)
    return res.json({ success: true, data: { tests: q } })
  } catch (error) {
    console.error('Error processing file:', error);
    return res.json({ success: false, error: 'Error processing file' });
  }
});

router.post('/addBulkTests', upload.single('file'), async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.json({ success: false, error: 'Authorization token not provided' });

    const token = authHeader.split(" ")[1];
    const { username, role } = jwt.verify(token, 'qwertyuiop');

    if (role !== "admin") return res.json({ success: false, error: 'Wrong role' });

    const file = req.file;
    if (!file) return res.json({ success: false, error: 'No file uploaded' });
    console.log(file);
    const jsonData = await new Promise((resolve, reject) => {
      const results = [];
      fs.createReadStream(file.path).pipe(csv()).on('data', (row) => {
        console.log(row);
        results.push({ name: row.name, rollno: row.rollno, att: row.att, aptitude: row.aptitude, coding: row.coding, others: row.others, date: parse(row.date, 'dd-MM-yyyy hh:mm aa', new Date()), batch: row.batch });
      }).on('end', () => { resolve(results); }).on('error', (error) => { reject(error); });
    });

    const tests = {};
    jsonData.forEach(q => {
      if (tests[q.name]) {
        tests[q.name].students[q.rollno] = q.att;
        tests[q.name].marks[q.rollno] = { aptitude: q.aptitude, coding: q.coding, others: q.others };
      } else {
        tests[q.name] = {
          name: q.name, date: new Date(q.date), batch: q.batch,
          marks: { [q.rollno]: { aptitude: q.aptitude, coding: q.coding, others: q.others } }, students: { [q.rollno]: q.att }
        };
      }
    });

    const tt = await Promise.all(Object.values(tests).map(async q => {
      let t = await Schedule.findOne({ name: q.name });
      if (!t) { t = await Schedule.create(q); }
      else { t = await Schedule.findOneAndUpdate({ name: q.name }, q, { new: true }); }
      return t;
    }));

    fs.unlink(file.path, (err) => {
      if (err) console.error('Error deleting the file:', err);
    });

    return res.json({ success: true, data: { tests: tt } });
  } catch (error) {
    console.log('Error processing file:', error);
    res.json({ success: false, error: 'Error processing file' });
  }
});

router.post('/postTest', async (req, res) => {
  let token;
  const authHeader = req.headers["authorization"];
  if (authHeader !== undefined) token = authHeader.split(" ")[1];
  if (token) {
    const { username, role } = jwt.verify(token, 'qwertyuiop');
    if (role === "admin") {
      let test = req.body.test;
      //console.log(test);
      let q = await Schedule.findOne({ _id: test.tid })
      if (!q) return res.status(404).json({ success: false, message: 'Schedule not found' });
      q.marks[test.rollno].aptitude = test.aptitude;
      q.marks[test.rollno].coding = test.coding;
      q.marks[test.rollno].others = test.others;
      q.students[test.rollno] = test.att;
      q = await Schedule.findOneAndUpdate({ _id: test.tid }, q, { new: true })
      return res.json({ success: true, data: { test: q } });
    } else {
      return res.json({ success: false, error: 'wrong role' });
    }
  } else {
    return res.json({ success: false, error: 'wrong token' });
  }
})

router.post('/deleteStuTestEntry', async (req, res) => {
  let token;
  const authHeader = req.headers["authorization"];
  if (authHeader !== undefined) token = authHeader.split(" ")[1];
  if (token) {
    const { username, role } = jwt.verify(token, 'qwertyuiop');
    if (role === "admin") {
      let test = req.body.test;
      //console.log(test);
      let q = await Schedule.findOne({ _id: test.tid })
      if (!q) return res.status(404).json({ success: false, message: 'Schedule not found' });
      delete q.marks[test.rollno];
      delete q.students[test.rollno];
      q = await Schedule.findOneAndUpdate({ _id: test.tid }, q, { new: true })
      return res.json({ success: true, data: { test: q } });
    } else {
      return res.json({ success: false, error: 'wrong role' });
    }
  } else {
    return res.json({ success: false, error: 'wrong token' });
  }
})

router.get('/getTests/:year', async (req, res) => {
  let token;
  const authHeader = req.headers["authorization"];
  if (authHeader !== undefined) token = authHeader.split(" ")[1];

  if (token) {
    const { username, role } = jwt.verify(token, 'qwertyuiop');
    if (role === "admin") {
      const { year } = req.params;
      //console.log(year);
      let q = await Schedule.find({ batch: year })
      return res.json({ success: true, data: { tests: q } });
    } else {
      return res.json({ success: false, error: 'wrong role' });
    }
  } else {
    return res.json({ success: false, error: 'wrong token' });
  }
})

router.get('/getTest/:tid', async (req, res) => {
  let token;
  const authHeader = req.headers["authorization"];
  if (authHeader !== undefined) token = authHeader.split(" ")[1];

  if (token) {
    const { username, role } = jwt.verify(token, 'qwertyuiop');
    if (role === "admin") {
      let q = await Schedule.findOne({ _id: req.params.tid })
      return res.json({ success: true, data: { test: q } });
    } else {
      return res.json({ success: false, error: 'wrong role' });
    }
  } else {
    return res.json({ success: false, error: 'wrong token' });
  }
})

router.put('/putTest', async (req, res) => {
  let token;
  const authHeader = req.headers["authorization"];
  if (authHeader !== undefined) token = authHeader.split(" ")[1];
  if (token) {
    const { username, role } = jwt.verify(token, 'qwertyuiop');
    if (role === "admin") {
      let q = await Schedule.findOneAndUpdate({}, { ...req.body.data, marks: {} }, { new: true })
      return res.json({ success: true, data: { tests: q } });
    } else {
      return res.json({ success: false, error: 'wrong role' });
    }
  } else {
    return res.json({ success: false, error: 'wrong token' });
  }
})

router.get('/getAnn/:year', async (req, res) => {
  let token;
  const authHeader = req.headers["authorization"];
  if (authHeader !== undefined) token = authHeader.split(" ")[1];
  if (token) {
    const { username, role } = jwt.verify(token, 'qwertyuiop');
    if (role === "admin") {
      let q = await Ann.find({ batch: req.params.year })
      return res.json({ success: true, data: { ann: q } });
    } else {
      return res.json({ success: false, error: 'wrong role' });
    }
  } else {
    return res.json({ success: false, error: 'wrong token' });
  }
})

router.post('/postAnn', async (req, res) => {
  let token;
  const authHeader = req.headers["authorization"];
  if (authHeader !== undefined) token = authHeader.split(" ")[1];
  if (token) {
    const { username, role } = jwt.verify(token, 'qwertyuiop');
    if (role === "admin") {
      //console.log(req.body);
      let q = await Ann.create({ ...req.body })
      return res.json({ success: true, data: { ann: q } });
    } else {
      return res.json({ success: false, error: 'wrong role' });
    }
  } else {
    return res.json({ success: false, error: 'wrong token' });
  }
})


module.exports = router;