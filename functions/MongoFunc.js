const mongoose = require('mongoose')
const Util = require('../functions/Util')
const User = require('../models/user')
const Guild = require('../models/guild')
const bot = require('..')
module.exports = {

    createUser(uID, gID){
        User.findOne({userID: uID, guildID: gID}, (err, dbUser) => {
            let mem = bot.guilds.cache.get(gID).members.cache.find(m => m.id === uID)
            if(!mem) return
            let TrueFalse = false
            if(!Util.checkPerm(mem, "MOVE_MEMBERS")) TrueFalse = true
            if(!dbUser){
                let newUser = new User({
                    _id: mongoose.Types.ObjectId(),
                    guildID: gID,
                    userID: uID,
                    name: "Не указано",
                    age: "Не указано",
                    total_level: 0,
                    level: 0,
                    total_xp: 0,
                    week_xp: 0,
                    txp: 0,
                    xp: 0,
                    xp_cd: 0,
                    xp_block: TrueFalse,
                    currency: 0,
                    bank: 0,
                    total_currency: 0,
                    coin_cd: 0,
                    rob_cd: 0,
                    crime_cd: 0,
                    daily_cd: 0,
                    voice_active: false,
                    total_voice_time: 0,
                    voice_time: 0,
                    total_messages: 0,
                    warnings: 0,
                })
                newUser.save()
                .catch(err => {console.log(err)})
            }
        })
    },

}