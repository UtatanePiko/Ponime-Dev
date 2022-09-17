const mongoose = require('mongoose');

const loveSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    userID: String,
    toUserID: String,
    love: Number
});

module.exports = mongoose.model('Love', loveSchema, 'love');