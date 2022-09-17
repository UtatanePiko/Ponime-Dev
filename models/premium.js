const mongoose = require('mongoose');

const premiumSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    userID: String,
    date: Number,
    expired: Boolean
});

module.exports = mongoose.model('Premium', premiumSchema, 'premium');