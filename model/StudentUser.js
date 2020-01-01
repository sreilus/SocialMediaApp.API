const mongoose = require('mongoose');

const StudentUserSchema = new mongoose.Schema({
   
    name: {
        type: String,
        required: true,
        min: 2,
        max: 30,
        lowercase:true
    },
    surname: {
        type: String,
        min: 2,
        max: 30,
        lowercase:true
    },
    username: {
        type: String,
        required: true,
        min: 2,
        max: 15,
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