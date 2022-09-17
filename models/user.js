const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    userID: String,
    name: String,
    age: String,
    total_level: Number,
    level: Number,
    total_xp: {type: Number, index: true},
    week_xp: Number,
    txp: Number,
    xp: Number,
    xp_cd: String,
    xp_block: Boolean,
    currency: Number,
    bank: Number,
    coin_cd: String,
    rob_cd: String,
    crime_cd: String,
    daily_cd: String,
    voice_active: Boolean,
    total_voice_time: Number,
    voice_time: Number,
    total_messages: Number,
    warnings: Number,
    steam: String,
    inst: String,
    vk: String,
    inventory: Array
});

module.exports = mongoose.model('User', userSchema, 'user');