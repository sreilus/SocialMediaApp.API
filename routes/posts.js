const router = require('express').Router();
const StudentUser = require('../model/StudentUser');
const TeacherUser = require('../model/TeacherUser');
const verify = require('./verifyToken');

router.get('/', verify, async (req, res) => {
    let userId = (req.user._id);
    let user = await StudentUser.findById(userId);
    if(!user)
    {
        user = await TeacherUser.findById(userId);
    }
    res.send(user);
});

module.exports = router;