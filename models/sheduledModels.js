const mongoose = require('mongoose');

const sheduledModels = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    eventID: String,
    guildID: String,
    startDate: Number,
    endDate: Number,
    activated: Boolean
});

module.exports = mongoose.model('SheduledModels', sheduledModels, 'sheduledModels');