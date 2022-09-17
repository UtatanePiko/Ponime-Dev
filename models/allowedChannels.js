const mongoose = require('mongoose');

const allowedChannelsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    actions: Array,
    moderation: Array,
    economy: Array,
    leveling: Array
});

module.exports = mongoose.model('AllowedChannels', allowedChannelsSchema, 'allowedChannels');