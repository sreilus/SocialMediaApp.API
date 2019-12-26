const router = require('express').Router();
const StudentUser = require('../model/StudentUser');
const TeacherUser = require('../model/TeacherUser');
const jwt = require('jsonwebtoken');
const { registerStudentValidation, registerTeacherValidation, loginValidation } = require('../validations/validation');
const bcrypt = require('bcryptjs');

router.post('/register', async (req, res) => {

    //LETS VALIDATE THE DATA BEFORE WE A USER
    if (req.body.userType == 1) {
        const { error } = registerStudentValidation(req.body);
        if (error) return res.status(400).send(error.details[0].message);
    }
    else if(req.body.userType == 2){
        const { error } = registerTeacherValidation(req.body);
        if (error) return res.status(400).send(error.details[0].message);
    }
    //Checking if the user is already in the database
    const emailExist = await StudentUser.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send('Email already exists');

    //Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //Create a new user
    if (req.body.userType == 1) {
        const studentUser = new StudentUser({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            username: req.body.username,
            userType: req.body.userType
        });

        try {
            const savedUser = await studentUser.save();
            res.send({ studentUser: studentUser._id, userType: studentUser.userType });
        }
        catch (err) {
            res.status(400).send(err);
        }
    }
    else if (req.body.userType == 2) {
        const teacherUser = new TeacherUser({
            name: req.body.name,
            email: req.body.email,
            surname:req.body.surname,
            university: req.body.university,
            password: hashedPassword,
            userType: req.body.userType
        });

        try {
            const savedUser = await teacherUser.save();
            res.send({ teacherUser: teacherUser._id, userType: teacherUser.userType });
        }
        catch (err) {
            res.status(400).send(err);
        }
    }


});

router.post('/login', async (req, res) => {
    //LETS VALIDATE THE DATA BEFORE WE A USER
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Checking if the email exists
    const user = await StudentUser.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Email is not found');

    //PASSWORD CORRRECT
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('Invalid password');

    //Create and assign a token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).status(200).send({state:"succes", token:token});
});

//Get User
router.get('/:userId', async (req, res) => {
    const user = await StudentUser.findById(req.params.userId);
    console.log(req.params.userId)
    res.json(user);
});

//Get All Users
router.get('/getUsers/get', async (req, res) => {
    StudentUser.find({}, function(err, users) {
        var userMap = {};
    
        users.forEach(function(user) {
          userMap[user._id] = user;
        });
    
        res.json(userMap);  
      });

});

//Delete User
router.delete('/:userId', async (req, res) => {

    const remoweUser = await StudentUser.remove({ _id: req.params.userId });
    res.json(remoweUser);

});

//Update User
router.patch('/:userId', async (req, res) => {

    const updateUser = await StudentUser.updateOne(
        { _id: req.params.userId },
        {
            $push: {
                email: {
                    $each: [{ wk: 5, score: 8 }, { wk: 6, score: 7 }, { wk: 7, score: 6 }],
                    $sort: { score: -1 }
                }
            }
        }
    );
    res.json(updateUser);

});

module.exports = router;