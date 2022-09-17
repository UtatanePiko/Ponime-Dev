const chalk = require('chalk')

module.exports = {
    name: "resetxp",
    description: "Описание команд",
    run: async (bot, message, args) => {

        try{

            const User = require('../../models/user')
            const Guild = require('../../models/guild')
            const MongoFunc = require('../../functions/MongoFunc') 
            const { Embeds, crossText, noPerms, checkmarkText } = require('../../functions/Embed') 
            const { noColor } = require('../../functions/Colours')
            const Util  = require('../../functions/Util') 
            const server = await Guild.findOne({ guildID: message.guild.id })
    
            if(Util.checkPerm(message.member, "ADMINISTRATOR")) return noPerms(message)

            User.find({week_xp: {$gt: 0}}, {level: 1, week_xp: 1, xp: 1, voice_time: 1}).then(async (dbUser) => {
                dbUser.forEach(async (user) => {
                    user.level = 1
                    user.week_xp = 0
                    user.xp = 0
                    user.voice_time = 0
                    user.save().catch(console.error)
                })
            })

        }catch(err){
            console.error(chalk.redBright(err.stack))
            console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
        }
    }
}