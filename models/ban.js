const mongoose = require('mongoose');

const banSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    ID: String,
    guildID: String,
    userID: String,
    banned_by: String,
    unbanned_by: String,
    date: Number,
    unbanned_date: Number,
    reason: String,
    unbanned_reason: String,
    duration: Number,
    expired: Boolean
});

module.exports = mongoose.model('Bans', banSchema, 'bans');