const mongoose = require('mongoose');

const leavedSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    userID: String,
    userName: String,
});

module.exports = mongoose.model('Leaved', leavedSchema, 'leaved');