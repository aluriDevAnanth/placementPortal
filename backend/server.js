const express = require('express');
const auth = require('./routes/auth/auth')
const teacherRou = require('./routes/user/mentorRou')
const DeanRou = require('./routes/user/DeanRou')
const HODRou = require('./routes/user/HODRou')
const AdminRou = require('./routes/user/AdminRou')
const mongoose = require('mongoose');
var cors = require('cors')

const app = express();
const PORT = 3000;

app.use(cors())
app.use(express.json())

app.use('/api/', auth);
app.use('/api/mentor', teacherRou);
app.use('/api/dean', DeanRou);
app.use('/api/hod', HODRou);
app.use('/api/admin', AdminRou);

app.get('/', (req, res) => {
    res.send('<p>qwerty</p>')
})

const start = async () => {
    try {
        qq = await mongoose.connect('mongodb://localhost:27017/placementPortal');

        app.listen(PORT, () => {
            console.log(`lala ${PORT}`)
        })
    } catch (error) {
        console.error(error);
    }
};

start();