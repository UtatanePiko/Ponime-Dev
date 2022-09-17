const mongoose = require('mongoose');

const reviewsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    ID: Number,
    date: Number,
    guildID: String,
    userID: String,
    from_userID: String,
    positive: Boolean,
    review: String
});

module.exports = mongoose.model('Reviews', reviewsSchema, 'reviews');