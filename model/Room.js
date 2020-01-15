const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique:true,
        min: 1,
        max: 255
    },
    user1:{
        type: mongoose.Schema.Types.ObjectId, refPath:'onModelUser1',
        require:true,
    },
    user2:
    {
        type: mongoose.Schema.Types.ObjectId,refPath:'onModelUser2',
        required:true,
    },
    onModelUser1: {
        type: String,
        required: true,
        enum: ['StudentUser', 'TeacherUser']
    },
    onModelUser2: {
        type: String,
        required: true,
        enum: ['StudentUser', 'TeacherUser']
    },
    created_at:{
        type:Date,
        default:new Date()
    }
});

module.exports = mongoose.model('Room', RoomSchema);