const mongoose = require('mongoose');

const economySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    daily_text: Array,
    crime_suc: Array,
    crime_fail: Array,
    rob_suc: Array,
    rob_fail: Array
});

module.exports = mongoose.model('Economy', economySchema, 'economy');