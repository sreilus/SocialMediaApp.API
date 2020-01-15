const mongoose = require('mongoose');

const UniverstyProgramSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 6,
        max: 255
    }
});

module.exports = mongoose.model('UniverstyProgram', UniverstyProgramSchema);