const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    prefix: String,
    boost_message: String,
    boost_channel: String,
    autorole: Array,
    shop: Array,
    voice_categoryID: String,
    voice_channelID: String,
    ultraRole: String,
    automod: String,
    caps_msg: String,
    spam_msg: String,
    link_msg: String,
    caps_duration: Number,
    spam_duration: Number,
    blocked_channels: Array,
    roles: Array,
    event_channels: Array,
    negative_roles: Array
});

module.exports = mongoose.model('Guild', guildSchema, 'guild');