const mongoose = require('mongoose');

const TeacherUserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 2,
        max: 20,
        lowercase:true
    },
    surname: {
        type: String,
        required: true,
        min: 2,
        max: 20,
        lowercase:true
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 100,
        unique:1,
        lowercase:true        
    },
    university: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Universty',
        required: true,
        min: 6,
        max: 255        
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 25,
    },
    date: {
        type: Date,
        default: Date.now
    },
    userType: {
        type: Number,
        default:2
    }
});

module.exports = mongoose.model('TeacherUser', TeacherUserSchema);