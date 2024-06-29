const express = require("express");
const path = require("path");
const auth = require("./routes/auth/auth");
const teacherRou = require("./routes/user/mentorRou");
const DeanRou = require("./routes/user/DeanRou");
const HODRou = require("./routes/user/HODRou");
const AdminRou = require("./routes/user/AdminRou");
const StudentRou = require("./routes/user/StudentRou");
const ParentRou = require("./routes/user/ParentRou");
const mongoose = require("mongoose");
var cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use("/api/", auth);
app.use("/api/mentor", teacherRou);
app.use("/api/dean", DeanRou);
app.use("/api/hod", HODRou);
app.use("/api/admin", AdminRou);
app.use("/api/student", StudentRou);
app.use("/api/parent", ParentRou);

app.get("/api", (req, res) => {
  res.send("<p>qwerty</p>");
});


const start = async () => {
  try {
    qq = await mongoose.connect(
      `${process.env.MONGO_BASE_URL}/placementPortal`
    );
    app.listen(PORT, () => {
      console.log(`lala ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};

start();
