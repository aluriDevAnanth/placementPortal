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
const PlacementCorner = require('../../models/user/PlacementCorner')
const Event = require('../../models/user/Event')

//use
router.use(express.json());

router.get('/getStudents/:year', async (req, res) => {
    let token;
    const authHeader = req.headers["authorization"];
    if (authHeader !== undefined) {
        token = authHeader.split(" ")[1];
    }
    try {
        if (token) {
            const { username, role } = jwt.verify(token, 'qwertyuiop');
            if (role === "mentor") {
                //console.log(req.params.year, username)
                let studentList = await Student.find({ mentoremail: username, yearofpassing: parseInt(req.params.year) })
                let qq = {};
                studentList.map((q, i) => {
                    let w = q.rollno
                    qq[w] = q;
                })
                res.json({ success: true, data: { studentList: qq } });
            }
        } else {
            res.json({
                success: false,
                error: 'error'
            });
        }
    } catch (e) {
        console.log(e);
        res.json({ success: false, error: "internal server error" })
    }

})

router.post('/getAtt', async (req, res) => {
    try {
        const { rollno } = req.body;
        const att1 = await Att.find({ rollno: { $in: rollno } })
        let att = {};
        for (let i of att1) {
            if (!att[i.rollno]) att[i.rollno] = [];
            att[i.rollno].push(i);
        }
        //console.log(att)
        res.status(200).json({ success: true, data: { att } })
    } catch (e) {
        console.log(e);
    }
})

router.post('/getEventAtt', async (req, res) => {
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
            let q = {};
            let rollno = req.body.rollno;

            // Use Promise.all to wait for all asynchronous operations to complete
            await Promise.all(rollno.map(async qq => {
                const att = await Event.find({ students: { $in: [qq] } });
                q[qq] = att;
            }));

            console.log(q, rollno);
            res.json({ success: true, data: { att: q } });

        } else {
            res.json({ success: false, message: 'token error' });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "server error" })
    }
})

router.get('/getSchedule/:year', async (req, res) => {
    const { rollno } = req.body;
    const year = req.params.year;
    const schedule = await Schedule.find()

    res.status(200).json({ data: schedule })
})

router.get('/getPC', async (req, res) => {
    try {
        const visitedCompanies = await PlacementCompany.find({ arrival: 'visited', batch: '2019', });
        res.json({ success: true, data: visitedCompanies });
    } catch (error) {
        console.error(error);
    }
})

router.get('/getMentorReview/:email/:year', async (req, res) => {
    try {
        const { email, year } = req.params;
        const MR = await MentorReview.find({ mentoremail: email, batch: year });
        res.json({ success: true, data: MR });
    } catch (error) {
        console.error(error);
    }
})

router.post('/uploadMFB', async (req, res) => {
    const { user, data, year } = req.body;
    //console.log(data.reviewtype === 'individual')
    if (data.reviewtype === 'individual') {
        try {
            const MFB = {
                "sno": "",
                "mentorname": user.name,
                "mentoremail": user.email,
                "mentordept": user.dept,
                "reviewtype": data.reviewtype,
                "rollno": data.rollno,
                "contactperson": data.person,
                "modeofcom": data.modeofcom,
                "menreview": data.menreview,
                "batch": year,
                "uploadeddate": format(new Date(), "yyyy-MM-dd"),
                "timestm": format(new Date(), "yyyy-MM-dd"),
            }
            const MR = await MentorReview.create(MFB);
            res.json({ success: true, data: MR });
        } catch (error) {
            console.error(error);
        }
    } else if (data.reviewtype === 'group') {
        try {
            const MFB = {
                "sno": "",
                "mentorname": user.name,
                "mentoremail": user.email,
                "mentordept": user.dept,
                "reviewtype": data.reviewtype,
                "rollno": data.rollno,
                "contactperson": data.reviewtype,
                "modeofcom": data.modeofcom,
                "menreview": data.menreview,
                "batch": year,
                "uploadeddate": format(new Date(data['meeting-time']), "yyyy-MM-dd"),
                "timestm": new Date(),
            }
            const MR = await MentorReview.create(MFB);
            res.json({ success: true, data: MR });
            //console.log(MR)
        } catch (error) {
            console.error(error);
        }
    }

})

router.put('/updateMFB', async (req, res) => {
    const { id, user, data } = req.body;
    console.log(data);
    if (data.reviewtype === 'individual') {
        try {
            const MFB = {
                "mentorname": user.name,
                "mentoremail": user.email,
                "mentordept": user.dept,
                "reviewtype": data.reviewtype,
                "rollno": data.rollno,
                "contactperson": data.contactperson,
                "modeofcom": data.modeofcom,
                "menreview": data.menreview,
                "uploadeddate": data.uploadeddate,
            };
            const MR = await MentorReview.findOneAndUpdate({ _id: id }, MFB, { new: true });
            if (MR) {
                res.json({ success: true, data: MR });
            } else {
                res.status(404).json({ success: false, error: "Document not found" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: error.message });
        }
    } else if (data.reviewtype === 'group') {
        try {
            const MFB = {
                "sno": "",
                "mentorname": user.name,
                "mentoremail": user.email,
                "mentordept": user.dept,
                "reviewtype": data.reviewtype,
                "rollno": data.rollno,
                "contactperson": data.contactperson,
                "modeofcom": data.modeofcom,
                "menreview": data.menreview,
                "timestm": new Date(),
            };

            const MR = await MentorReview.findOneAndUpdate({ _id: id }, MFB, { new: true });
            if (MR) {
                res.json({ success: true, data: MR });
            } else {
                res.status(404).json({ success: false, error: "Document not found" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: error.message });
        }
    } else {
        res.status(400).json({ success: false, error: "Invalid review type" });
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
        if (role === "mentor" || role === "parent" || role === "student" || role === "admin") {
            //console.log(req.params.year)
            //console.log(role);
            const com = await PlacementCorner.find({ batch: req.params.year })
            res.json({ success: true, data: com });
        }
    } else {
        res.json({
            success: false,
            error: 'error'
        });
    }
})

router.post('/upDet', async (req, res) => {
    let token;
    const authHeader = req.headers["authorization"];
    if (authHeader !== undefined) {
        token = authHeader.split(" ")[1];
    }
    //console.log(1)
    if (token) {
        const { username, role } = jwt.verify(token, 'qwertyuiop');
        //console.log(username, role)
        if (role === "mentor") {
            let q = await Mentor.findOneAndUpdate({ email: username }, {
                phoneno: req.body.phoneno,
                cabin: req.body.cabin,
                dept: req.body.dept,
            }, { new: true });
            res.json({
                success: true,
                data: q
            });
        }
    } else {
        res.json({
            success: false,
            error: 'error'
        });
    }
})

router.post('/chgnPwd', async (req, res) => {
    let token;
    const authHeader = req.headers["authorization"];
    if (authHeader !== undefined) {
        token = authHeader.split(" ")[1];
    }
    if (token) {
        const { username, role } = jwt.verify(token, 'qwertyuiop');
        //console.log(username, role, req.body)
        if (role === "mentor" || role === "admin") {
            let q = await LogDet.findOneAndUpdate({ username: username }, {
                password: md5(req.body.pass)
            }, { new: true });
            res.json({
                success: true,
                data: q
            });
        }
    } else {
        res.json({
            success: false,
            error: 'error'
        });
    }
})

router.get('/getYears', async (req, res) => {
    let token;
    const authHeader = req.headers["authorization"];
    if (authHeader !== undefined) {
        token = authHeader.split(" ")[1];
    }
    //console.log(1)
    if (token) {
        const { username, role } = jwt.verify(token, 'qwertyuiop');
        //console.log(username, role)
        try {
            if (role === 'mentor' || role === 'HOD') {
                const batches = await Student.distinct('batch');
                res.json({ success: true, data: { batches } });
            } else {
                res.json({ success: false, error: 'auth failed' });
            }
        } catch (error) {
            console.error('Error fetching batches:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.json({ success: false, error: 'auth failed' });
    }
});

router.post('/createPlacement', async (req, res) => {
    try {
        const com = req.body;
        const data = await PlacementCorner.create(com);
        res.json({ success: true, data })
    } catch (error) {
        console.log(error);
    }
})

router.get('/getPlaceCom/:year', async (req, res) => {
    let token;
    const authHeader = req.headers["authorization"];
    if (authHeader !== undefined) {
        token = authHeader.split(" ")[1];
    }

    if (token) {
        const { username, role } = jwt.verify(token, 'qwertyuiop');
        if (role === "mentor") {
            const com = await PlacementCorner.find({ batch: req.params.year })
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

router.get('/getAllStu/:year', async (req, res) => {
    let token;
    const authHeader = req.headers["authorization"];
    if (authHeader !== undefined) {
        token = authHeader.split(" ")[1];
    }

    if (token) {
        const { username, role } = jwt.verify(token, 'qwertyuiop');
        if (role === "mentor") {
            const stu = await Student.find({ batch: req.params.year })
            res.json({
                success: true,
                data: stu
            });
        }
    } else {
        res.json({
            success: false,
            error: 'error'
        });
    }
})

router.post('/getStudentPlacementProgress/:year', async (req, res) => {
    try {
        const { rollno } = req.body; const { year } = req.params;

        let eligibleCompany = {}; let appliedCompany = {}; let shortlistedCompany = {};
        await Promise.all(rollno.map(async (no) => {
            let qqq = await PlacementCorner.find({ eligibleStudents: no, batch: year }, { name: 1, _id: 0 });
            qqq = qqq.map(item => item.name);
            eligibleCompany[no] = qqq
        }));

        await Promise.all(rollno.map(async (no) => {
            let qqq = await PlacementCorner.find({ appliedStudents: no, batch: year }, { name: 1, _id: 0 });
            qqq = qqq.map(item => item.name);
            appliedCompany[no] = qqq
        }));

        await Promise.all(rollno.map(async (no) => {
            let qqq = await PlacementCorner.find({ shortlistedStudents: no, batch: year }, { name: 1, _id: 0 });
            qqq = qqq.map(item => item.name);
            shortlistedCompany[no] = qqq
        }));

        let stages = {}; let placed = {};

        await Promise.all(rollno.map(async (no) => {
            let [ot, gd, inter, hr, other, p] = await Promise.all([
                PlacementCorner.find({ "stages.onlineTest": no, batch: year }, { name: 1, _id: 0 }),
                PlacementCorner.find({ "stages.GD": no, batch: year }, { name: 1, _id: 0 }),
                PlacementCorner.find({ "stages.interview": no, batch: year }, { name: 1, _id: 0 }),
                PlacementCorner.find({ "stages.HR": no, batch: year }, { name: 1, _id: 0 }),
                PlacementCorner.find({ "stages.otherStages": no, batch: year }, { name: 1, _id: 0 }),
                PlacementCorner.find({ "placedStudents": no, batch: year }, { name: 1, CTC: 1, _id: 0 })
            ]);

            ot = ot.map(item => item.name);
            inter = inter.map(item => item.name);
            gd = gd.map(item => item.name);
            hr = hr.map(item => item.name);
            other = other.map(item => item.name);

            placed[no] = p;
            stages[no] = { ot, gd, inter, hr, other };
            //console.log(ot, gd, inter, hr, other);
        }));

        res.json({ success: true, data: { eligibleCompany, appliedCompany, shortlistedCompany, stages, placed } });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

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

module.exports = router;