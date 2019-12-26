const mongoose = require('mongoose');

const StudentUserSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
        min: 1,
        max: 100
    },
    name: {
        type: String,
        required: true,
        min: 2,
        max: 30
    },
    surname: {
        type: String,
        min: 2,
        max: 30
    },
    username: {
        type: String,
        required: true,
        min: 2,
        max: 15
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 100,
        unique:1        
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 30,
    },
    date: {
        type: Date,
        default: Date.now
    },
    userType: {
        type: Number,
        default:1
    }
});

module.exports = mongoose.model('StudentUser', StudentUserSchema);