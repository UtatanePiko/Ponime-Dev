const mongoose = require('mongoose');

const temproleSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    userID: String,
    gived_by: String,
    roleID: String,
    date: Number,
    duration: Number,
    expired: Boolean
});

module.exports = mongoose.model('Temprole', temproleSchema, 'temprole');