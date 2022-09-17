const mongoose = require('mongoose');

const muteSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    ID: String,
    guildID: String,
    userID: String,
    channelID: String,
    muted_by: String,
    unmuted_by: String,
    date: Number,
    unmuted_date: Number,
    duration: Number,
    reason: String,
    unmuted_reason: String,
    expired: Boolean,
    delete: Boolean
});

module.exports = mongoose.model('Mute', muteSchema, 'mute');