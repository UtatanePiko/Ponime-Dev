const chalk = require('chalk')

module.exports = {
    name: "check",
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
    
            if(message.member.id != "329462919676821504") return

            let ManRole = message.guild.roles.cache.find(r => r.name == "Мэнчики")
            let LadyRole = message.guild.roles.cache.find(r => r.name == "Леди") || message.guild.roles.cache.find(r => r.name == "ЛЕДИ")
            if(!ManRole || !LadyRole) return console.log(`Проблема при поиске ролей`)
            message.guild.members.cache.forEach(async mem => {
                if(!mem.user.bot && !mem.roles.cache.has(ManRole.id) && !mem.roles.cache.has(LadyRole.id)) mem.roles.add(ManRole)
            });
        }catch(err){
            console.error(chalk.redBright(err.stack))
            console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
        }
    }
}