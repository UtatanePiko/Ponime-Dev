const mongoose = require('mongoose');

const giveawaySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    channelID: String,
    msgID: String,
    winners: Number,
    date: Number,
    endDate: Number,
    prize: String,
    uslovie: String,
    places: Array,
    hasEnded: Boolean,
    winnersArr: Array
});

module.exports = mongoose.model('Giveaway', giveawaySchema, 'giveaway');