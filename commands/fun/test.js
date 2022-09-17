module.exports = {
    name: "test",
    description: "Описание команд",
    run: (bot, message, args) => {

        if(message.author.id != "329462919676821504") return message.reply(`Эта команда доступна лишь для разработчика`)

        const Discord = require('discord.js')
        const User = require('../../models/user')
        const mongoose = require('mongoose')

        d = 0
        while(d != 100){
            d++
            User.findOne({
                userID: message.author.id
            }, (err, user) => {
                if(user){
                    let newUser = new User({
                        _id: mongoose.Types.ObjectId(),
                        role_cache: Array,
                        guildID: message.guild.id,
                        userID: "674067589810356244",
                        name: "Не указано",
                        age: "Не указано",
                        total_level: 0,
                        level: 0,
                        total_xp: 0,
                        week_xp: 0,
                        txp: 0,
                        xp: 0,
                        xp_cd: 0,
                        xp_block: false,
                        currency: 0,
                        bank: 0,
                        total_currency: 0,
                        rob_cd: 0,
                        crime_cd: 0,
                        daily_cd: 0,
                        total_voice_time: 0,
                        voice_time: 0,
                        total_messages: 0,
                        warnings: 0,
                        total_warnings: 0,
                    })
                    newUser.save()
                }
            })
        }
    }
}
