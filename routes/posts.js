const router = require('express').Router();
const StudentUser = require('../model/StudentUser');
const TeacherUser = require('../model/TeacherUser');
const verify = require('./verifyToken');

router.get('/', verify, async (req, res) => {
    let userId = (req.user._id);
    const user = await StudentUser.findById(userId);
    res.send(user);
});

module.exports = router;