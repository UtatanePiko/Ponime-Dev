const mongoose = require('mongoose');

const roleCacheSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    userID: String,
    username: String,
    role: String
});

module.exports = mongoose.model('RoleCache', roleCacheSchema, 'roleCache');