const mongoose = require('mongoose');

const UniProgramRoomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique:true,
        min: 1,
        max: 255
    },
    created_at:{
        type:Date,
        default:new Date()
    }
});

module.exports = mongoose.model('UniProgramRoom', UniProgramRoomSchema);