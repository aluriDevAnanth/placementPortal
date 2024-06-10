const express = require("express");
const router = express.Router();
const md5 = require("md5");
var isemail = require("isemail");
var jwt = require("jsonwebtoken");
var nodemailer = require("nodemailer");
const crypto = require("crypto");

require("dotenv").config();

// Models
const LogDet = require("../../models/user/LogDet");
const Student = require("../../models/user/Student");
const Parent = require("../../models/user/Parent");
const Mentor = require("../../models/user/Mentor");
const ResetPsd = require("../../models/user/ResetPsd");

//use
router.use(express.json());

var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
    },
});

function createJwt(username, role) {
    const payload = { username, role };
    return jwt.sign(payload, "qwertyuiop", { expiresIn: "72h" });
}

async function decryptData(encryptedData) {
    //console.log(encryptedData);
    if (!encryptedData) {
        throw new Error("No data provided for decryption");
    }

    const keyBuffer = Buffer.from(process.env.encryptionKey, "utf8");
    const ivBuffer = Buffer.from(process.env.initializationVector, "utf8");

    if (keyBuffer.length !== 16 || ivBuffer.length !== 16) {
        throw new Error("Key and IV must be 16 bytes long");
    }

    const decipher = crypto.createDecipheriv("aes-128-cbc", keyBuffer, ivBuffer);

    let decrypted = decipher.update(encryptedData, "base64", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}
function validateNumber(input) {
    var re = /^(\d{3})[- ]?(\d{3})[- ]?(\d{4})$/;
    return re.test(input);
}

function generateOTP(length) {
    const chars = "0123456789";
    const charsLength = chars.length;
    let otp = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(charsLength);
        otp += chars[randomIndex];
    }

    return otp;
}

router.get("/auth", async (req, res) => {
    let token;
    const authHeader = req.headers["authorization"];
    if (authHeader !== undefined) {
        token = authHeader.split(" ")[1];
    }

    if (token) {
        try {
            const { username, role } = jwt.verify(token, "qwertyuiop");
            if (role === "mentor") {
                const teacher = await Mentor.findOne({ email: username });
                res.json({ success: true, data: { user: teacher, role } });
            } else if (role === "student") {
                const student = await Student.findOne({ rollno: username });
                res.json({ success: true, data: { user: student, role } });
            } else if (role === "dean") {
                const dean = await Mentor.findOne({ email: username });
                res.json({ success: true, data: { user: dean, role } });
            } else if (role === "admin") {
                const admin = await Mentor.findOne({ email: username });
                res.json({ success: true, data: { user: admin, role } });
            } else if (role === "parent") {
                const parent = await Student.findOne({ rollno: username });
                res.json({ success: true, data: { user: parent, role } });
            } else if (role === "coor") {
                const admin = await Mentor.findOne({ email: username });
                //console.log(admin);
                res.json({ success: true, data: { user: admin, role } });
            }
        } catch (error) {
            console.log(error);
        }
    } else {
        res.json({ success: false, error: "error" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const pass = md5(password);
        if (username.substr(0, 2) === "AP") {
            const student = await LogDet.findOne({ username });
            const parent = await Parent.findOne({ rollno: username });
            if (student && pass === student.password) {
                const jwt = createJwt(student.username, student.role);
                res.json({ success: true, user: student, jwt });
            } else if (parent && pass === parent.psd) {
                const jwt = createJwt(parent.rollno, "parent");
                res.json({ success: true, user: { ...parent, role: "parent" }, jwt });
            } else
                res
                    .status(404)
                    .json({ success: false, error: "Wrong Username or Password" });
        } else if (isemail.validate(username)) {
            const teacher = await LogDet.findOne({ username });
            if (teacher && pass === teacher.password) {
                const user = await Mentor.findOne({ email: username });
                const jwt = createJwt(teacher.username, teacher.role);
                res.json({ success: true, user, jwt });
            } else {
                res
                    .status(404)
                    .json({ success: false, error: "Wrong Username or Password" });
            }
        } else if (validateNumber(username)) {
            const student = await Student.findOne({ phone: username });
            if (student) {
                const jwt = createJwt(student.username, student.role);
                res.json({ success: true, user: student, jwt });
            } else
                res.status(404).json({ success: false, error: "Wrong Phone number" });
        } else {
            res
                .status(400)
                .json({ success: false, error: "Invalid username format" });
        }
    } catch (error) {
        console.log("lll", error);
        res.status(500).json({ success: false, error });
    }
});

router.post("/mobilelogin", async (req, res) => {
    const { encryptedDeviceInfo } = req.body;

    if (!encryptedDeviceInfo) {
        return res.status(400).json({
            success: false,
            message: "Device information is missing!",
        });
    }

    try {
        const incomingData = await decryptData(encryptedDeviceInfo);
        const deviceInfoFromDb = await LogDet.findOne({
            deviceInfo: encryptedDeviceInfo,
        });
        //console.log("deviceInfoFromDb ", deviceInfoFromDb);
        if (!deviceInfoFromDb) {
            return res.status(404).json({
                success: false,
                error: "Device not registered yet!",
            });
        }

        const dbDeviceInfo = await decryptData(deviceInfoFromDb.deviceInfo);

        if (incomingData !== dbDeviceInfo) {
            return res.status(401).json({
                success: false,
                message: "Device information does not match!",
            });
        }

        const { username, role } = deviceInfoFromDb;
        let userData;
        let token;
        if (role === "student") {
            userData = await Student.findOne({ rollno: username });
            token = createJwt(userData["rollno"], role);
        } else if (role === "coor") {
            userData = await LogDet.findOne({ username: username });
            token = createJwt(username, role);
        } else if (role === "mentor") {
            userData = await Mentor.findOne({ email: username });
            token = createJwt(userData["username"], role);
        }
        //console.log("userData", userData);
        if (Object.keys(userData).length === 0) {
            return res.status(404).json({
                success: false,
                error: "User data not found!",
            });
        }
        return res.status(200).json({
            success: true,
            userData: userData,
            role: role,
            token: token,
        });
    } catch (error) {
        console.error("Error during mobile login:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error!",
        });
    }
});

router.post("/register", async (req, res) => {
    const { UserRole, InputInfo, encryptedDeviceInfo } = req.body;
    //console.log(UserRole, InputInfo, encryptedDeviceInfo);

    if (UserRole) {
        if (UserRole === "Student") {
            const collegeMail = InputInfo["College mail"];
            const StudentRollnumber = InputInfo["Student Roll number"];
            //console.log(collegeMail, StudentRollnumber);
            const studentData = await Student.findOne({ rollno: StudentRollnumber });
            //console.log(studentData);
            // const studentcollege = await Student.findOne({
            //   email: collegeMail,
            // });
            if (studentData == null) {
                return res.json({
                    success: false,
                    error: "Associated student data not found !!",
                });
            }

            if (
                studentData.email !== collegeMail ||
                studentData.rollno !== StudentRollnumber
            ) {
                return res.json({
                    success: false,
                    error:
                        "Entered mail and roll number doesn't match the same student !!",
                });
            }

            const jwt = createJwt(StudentRollnumber, UserRole);
            const findDeviceInfo = await LogDet.findOne({
                username: StudentRollnumber,
            });
            if (findDeviceInfo && findDeviceInfo.deviceInfo) {
                return res.json({
                    success: false,
                    error: "Device already registered !!!",
                });
            }

            const LoginDet = await LogDet.findOneAndUpdate(
                { username: StudentRollnumber },
                { deviceInfo: encryptedDeviceInfo },
                { new: true }
            );

            res.json({
                success: true,
                userData: studentData,
                token: jwt,
            });
        } else if (UserRole === "Faculty mentor") {
            //console.log(InputInfo);
            const Mentoremail = InputInfo["College mail"];
            const MentorData = await Mentor.findOne({ email: Mentoremail });
            if (MentorData == null) {
                return res.json({
                    success: false,
                    error: "Student roll number not found !!",
                });
            }

            res.json({ success: true, data: { user: dean, role } });
        } else if (UserRole == "Faculty coordinator") {
            const Mentoremail = InputInfo["College mail"];
            const MentorData = await LogDet.findOne({ username: Mentoremail });
            //console.log(MentorData);
            if (MentorData == null) {
                return res.json({
                    success: false,
                    error: "Student roll number not found !!",
                });
            }
            //console.log(MentorData);
            const jwt = createJwt(Mentoremail, MentorData.role);

            const LoginDet = await LogDet.findOneAndUpdate(
                { username: Mentoremail },
                { deviceInfo: encryptedDeviceInfo },
                { new: true }
            );

            res.json({ success: true, userData: MentorData, token: jwt });
        }
    }
    //console.log(req.body);
});

router.post("/newLogin", async (req, res) => {
    try {
        const { username, password } = req.body;
        const pass = md5(password);
        if (username.substr(0, 2) === "AP") {
            const student = await LogDet.findOne({ username });
            const parent = await Parent.findOne({ rollno: username });
            if (student && pass === student.password) {
                const jwt = createJwt(student.username, student.role);
                res.json({ success: true, user: student, jwt });
            } else if (parent && pass === parent.psd) {
                const jwt = createJwt(parent.rollno, "parent");
                res.json({ success: true, user: { ...parent, role: "parent" }, jwt });
            } else
                res
                    .status(404)
                    .json({ success: false, error: "Wrong Username or Password" });
        } else if (isemail.validate(username)) {
            const teacher = await LogDet.findOne({ username });
            if (teacher && pass === teacher.password) {
                const user = await Mentor.findOne({ email: username });
                const jwt = createJwt(teacher.username, teacher.role);
                res.json({ success: true, user, jwt });
            } else {
                res
                    .status(404)
                    .json({ success: false, error: "Wrong Username or Password" });
            }
        } else if (validateNumber(username)) {
            const student = await Student.findOne({ phone: username });
            if (student) {
                const jwt = createJwt(student.username, student.role);
                res.json({ success: true, user: student, jwt });
            } else
                res.status(404).json({ success: false, error: "Wrong Phone number" });
        } else {
            res
                .status(400)
                .json({ success: false, error: "Invalid username format" });
        }
    } catch (error) {
        console.log("lll", error);
        res.status(500).json({ success: false, error });
    }
});

router.post("/sendOTP", async (req, res) => {
    try {
        const { username } = req.body;
        const student = await Student.findOne({ rollno: username });
        const parent = await Student.findOne({ rollno: username });
        const teacher = await Mentor.findOne({ email: username });
        let q = [student?.email, teacher?.email, parent?.email].filter(q => q !== undefined)[0];

        if (student || parent || teacher) {
            const otp = generateOTP(6);
            var mailOptions = {
                from: process.env.EMAIL_ADDRESS,
                to: q,
                subject: "Password Reset OTP",
                text: `otp for resetting password: ${otp}`,
            };
            transporter.sendMail(mailOptions, async function (error, info) {
                if (error) {
                    return res.status(400).json({ success: false, error });
                } else {
                    return res.json({ success: true, data: { otp }, message: "sent OTP" });
                }
            });
        } else {
            return res.json({ success: false, error: "Invalid email or rollno" });
        }
    } catch (error) {
        console.log("lll", error);
        res.status(500).json({ success: false, error });
    }
});


router.post('/changePass', async (req, res) => {
    try {
        const { username, pass } = req.body;
        const student = await Student.findOne({ rollno: username });
        const parent = await Parent.findOne({ rollno: username });
        const teacher = await LogDet.findOne({ email: username });
        let q;
        if (student) {
            q = await LogDet.findOneAndUpdate({ username: student.rollno }, { password: md5(pass) }, { new: true })
            //console.log(q);
            res.json({ success: true, data: { newCred: q } })
        } else if (teacher) {
            //console.log(teacher);
            q = await Mentor.findOneAndUpdate({ username: teacher.email }, { password: md5(pass) }, { new: true })
            res.json({ success: true, data: { newCred: q } })
        } else {
            res.status(400).json({ success: false, error: "Invalid email" });
        }
    } catch (error) {
        console.log("lll", error);
        res.status(500).json({ success: false, error });
    }
})

module.exports = router;
