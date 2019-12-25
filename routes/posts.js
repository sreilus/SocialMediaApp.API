const router = require('express').Router();
const verify = require('./verifyToken');
const StudentUser = require('../model/StudentUser');


router.get('/',verify,async (req,res) => {
    const emailExist = await StudentUser.findOne({ _id: req.user._id });

    res.send(emailExist);

});

module.exports = router;