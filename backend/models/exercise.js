const mongoose = require('mongoose');

const exerciseSchema = mongoose.Schema({
    name: { type: String, required: true },
    type_of_set: { type: String, required: true },
    weight: { type: Number, required: true },
    reps: { type: Number, required: true },
})