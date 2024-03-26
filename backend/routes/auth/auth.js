const express = require('express')
const router = express.Router()
const md5 = require('md5');
var isemail = require('isemail');
var jwt = require('jsonwebtoken');

// Models
const LogDet = require('../../models/user/LogDet');
const Student = require('../../models/user/Student');
const Parent = require('../../models/user/Parent');
const Mentor = require('../../models/user/Mentor')

//use
router.use(express.json());

function createJwt(username, role) {
    const payload = { username, role };
    return jwt.sign(payload, 'qwertyuiop', { expiresIn: '72h' });
}

function validateNumber(input) {
    var re = /^(\d{3})[- ]?(\d{3})[- ]?(\d{4})$/
    return re.test(input)
}

router.get('/auth', async (req, res) => {
    let token;
    const authHeader = req.headers["authorization"];
    if (authHeader !== undefined) {
        token = authHeader.split(" ")[1];
    }

    if (token) {
        try {
            const { username, role } = jwt.verify(token, 'qwertyuiop');
            if (role === "mentor") {
                const teacher = await Mentor.findOne({ email: username })
                res.json({
                    success: true,
                    data: { user: teacher, role }
                });
            } else if (role === 'dean') {
                const dean = await Mentor.findOne({ email: username })
                res.json({
                    success: true,
                    data: { user: dean, role }
                });
            } else if (role === 'admin') {
                const admin = await Mentor.findOne({ email: username })
                res.json({
                    success: true,
                    data: { user: admin, role }
                });
            }
        } catch (error) {

        }

    } else {
        res.json({
            success: false,
            error: 'error'
        });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const pass = md5(password);
        console.log(username, password)
        if (username.substr(0, 2) === "AP") {
            const student = await LogDet.findOne({ username });
            const parent = await Parent.findOne({ rollno: username });
            if (student && pass === student.password) {
                const jwt = createJwt(student.username, student.role)
                res.json({ user: student, jwt })
            } else if (parent && pass === student.password) {
                if (pass === parent.psd) {
                    const jwt = createJwt(parent.username, 'parent')
                    res.json({ user: parent, jwt })
                }
            }
            else res.status(404).json({ success: false, error: "Wrong Username or Password" });

        } else if (isemail.validate(username)) {
            const teacher = await LogDet.findOne({ username });
            if (teacher && pass === teacher.password) {
                const user = await Mentor.findOne({ email: username })
                const jwt = createJwt(teacher.username, teacher.role)
                console.log(user)
                res.json({ success: true, user, jwt })
            }
            else {
                res.status(404).json({ success: false, error: "Wrong Username or Password" });
            }

        }

        if (validateNumber(username)) {
            console.log(11);
            const student = await Student.findOne({ phone: username });
            if (student) {
                const jwt = createJwt(student.username, student.role)
                res.json({ success: true, user: student, jwt })
            }
            else res.status(404).json({ success: false, error: "Wrong Phone number" });

        } else {
            res.status(400).json({ success: false, error: "Invalid username format" });
        }
    } catch (error) {
        console.log("lll", error);
        res.status(500).json({ success: false, error });
    }
});


module.exports = router;