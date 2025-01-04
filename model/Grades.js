
// models/Grade.js
const mongoose = require('mongoose');

const GradeSchema = new mongoose.Schema({
    student: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: true
        },
        firstname: String,
        lastname: String
    },
    course: {
        type: String,
        required: true
    },
    grade: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Grade', GradeSchema);

