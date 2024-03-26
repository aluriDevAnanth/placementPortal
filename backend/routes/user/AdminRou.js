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
const Event = require('../../models/user/Event')

//use
router.use(express.json());

function isEventExpired(event) {
  const currentTime = new Date();
  const endTime = new Date(event.endTime);

  if (event.rec === "once") return currentTime > endTime;
}

function isEventHappening(event) {
  const currentTime = new Date(); // Get the current time
  const startTime = new Date(event.startTime);
  const endTime = new Date(event.endTime);

  // Check the recurrence type
  if (event.rec === "once") {
    // For one-time events, simply check if the current time is within the start and end time
    return currentTime >= startTime && currentTime <= endTime;
  } else if (event.rec === "daily") {
    // For daily recurring events, check if the current time is within today's start and end time
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
    // For weekly recurring events, check if the current day is the same as the event's day
    // and if the current time is within the event's start and end time
    const eventDay = startTime.getDay(); // Get the day of the event
    const currentDay = currentTime.getDay(); // Get the current day
    if (eventDay !== currentDay) {
      return false; // Event is not happening today
    }
    return currentTime >= startTime && currentTime <= endTime;
  } else {
    // Invalid recurrence type
    throw new Error("Invalid recurrence type");
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
      if (role === "admin") {
        let q = await Event.find({});
        // Calculate if each event is expired
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

module.exports = router;