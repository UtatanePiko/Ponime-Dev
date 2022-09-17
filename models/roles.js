const mongoose = require('mongoose');

const rolesSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    userID: String,
    roles: Array
});

module.exports = mongoose.model('Roles', rolesSchema, 'Roles');