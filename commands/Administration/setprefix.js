const chalk = require('chalk')

module.exports = {
    name: "setprefix",
    description: "Описание команд",
    aliases: ["sp", "префикс"],
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

            if(args[0] == "help" || args[0] == "помощь"){
                const embed = new Embeds({
                    message: message,
                    description: `Установка своего префикса`,
                    embedTitle: "SETPREFIX HELP-MENU",
                    embedColor: noColor(),
                    arguments: `● **\`${server.prefix}setprefix <Префикс>\`**`,
                    alternatives: `● **\`${server.prefix}sp\`** | **\`${server.prefix}префикс\`**`,
                    examples: `● **\`${server.prefix}setprefix p!\`**`,
                    hints: `● **\`<>\`** - обязательно для заполнения`
                })
    
                return embed.help()
            }

            if(!args[0]) return crossText(`Не указано никаких аргументов\nИспользуйте **\`${message.content.split(" ")[0].toLowerCase()} help\`**, чтобы узнать возможные аргументы`, message)
            if(args[1]) return crossText(`Новый префикс не должен содержать пробелов`, message)

            Guild.findOne({guildID: message.guild.id}).then(async (server) => {
                server.prefix = args[0]
                server.save()
                bot.server.set(message.guild.id, {
                    prefix: args[0],
                    actions_channels: bot.server.get(message.guild.id).actions_channels,
                    leveling_channels: bot.server.get(message.guild.id).leveling_channels,
                    moderation_channels: bot.server.get(message.guild.id).moderation_channels,
                    warnID: bot.server.get(message.guild.id).warnID,
                    roles: bot.server.get(message.guild.id).roles,
                    event_channels: bot.server.get(message.guild.id).event_channels || []
                })
            })

            return checkmarkText(`Префикс бота был успешно изменен на **\`${args[0]}\`**`, message)

        }catch(err){
            console.error(chalk.redBright(err.stack))
            console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
        }
    }
}