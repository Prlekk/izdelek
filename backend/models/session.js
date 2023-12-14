const mongoose = require('mongoose');

const sessionSchema = mongoose.Schema({
    date: { type: Date, required: true },
    type: { type: String, required: true },
    duration: { type: Number, required: true },
    volume: { type: Number, required: true },
    sets: { type: Number, required: true },
    records: { type: Number, required: true },
    exercises: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' }],
})

module.exports = mongoose.model('Session', sessionSchema);