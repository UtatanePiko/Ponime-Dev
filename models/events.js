const mongoose = require('mongoose');

const eventsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    ID: Number,
    name: String,
    chan: String,
    title: String,
    desc: String,
    place: String,
    participation: Number,
    isWinnersExist: Boolean,
    isPrizePlacesExist: Boolean,
    winnersAmount: Number,
    winPlaces: Object,
    winnersPrize: Number,
    image: String,
    roles: String,
    rules: String
});

module.exports = mongoose.model('Events', eventsSchema, 'events');