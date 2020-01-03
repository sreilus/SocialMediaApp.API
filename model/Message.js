const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    room:{
        type: mongoose.Schema.Types.ObjectId, ref:'Room'
    },
    message_body: {
        type: String,
        required: true,
        min: 1,
        max: 2048
    },
    message_status:{
        type:Boolean,
        default:false
    },
    sender:{
         type: mongoose.Schema.Types.ObjectId, refPath:'onModelUser',
    },
    onModelUser: {
        type: String,
        required: true,
        enum: ['StudentUser', 'TeacherUser']
    },
    created_at:{
        type:Date,
        default:new Date()
    }
});

module.exports = mongoose.model('Message', MessageSchema);