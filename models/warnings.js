const mongoose = require('mongoose');

const warningsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    ID: String,
    guildID: String,
    userID: String,
    warned_by: String,
    unwarned_by: String,
    date: Number,
    unwarned_date: Number,
    duration: Number,
    reason: String,
    unwarned_reason: String,
    expired: Boolean
});

module.exports = mongoose.model('Warnings', warningsSchema, 'warnings');