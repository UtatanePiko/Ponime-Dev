const chalk = require('chalk')

module.exports = {
    name: "balance",
    description: "Описание команд",
    aliases: ["bal", "$", "баланс", "бал"],
    run: async (bot, message, args) => {
        try{
            
            const Discord = require('discord.js')
            const User = require('../../models/user')
            const Guild = require('../../models/guild')
            const MongoFunc = require('../../functions/MongoFunc')
            const Util = require('../../functions/Util')
            const coin = Util.findEmoji('CHPOKI_COIN')
            const { Embeds, crossText } = require('../../functions/Embed') 
            const { noColor } = require('../../functions/Colours')
            const prefix = bot.server.get(message.guild.id).prefix

            

            if(args[0] == "help" || args[0] == "помощь"){
                const embed = new Embeds({
                    message: message,
                    description: `Узнать баланс пользователя`,
                    embedTitle: "BALANCE HELP-MENU",
                    embedColor: noColor(),
                    arguments: `● **\`${prefix}balance [@user | userID]\`**`,
                    alternatives: `● **\`${prefix}balance\`** | **\`${prefix}bal\`** | **\`${prefix}$\`** | **\`${prefix}баланс\`** | **\`${prefix}бал\`**`,
                    examples: `● **\`${prefix}$ @user\`**`,
                    hints: `● **\`[]\`** - необязательно для заполнения`
                })
    
                return embed.help()
            }

            let mentuser = message.member
            if(args[0]) mentuser = args[0] ? message.guild.members.cache.get(args[0].replace('<@', '').replace('>', '')) : null
            if(!mentuser) return crossText(`Не найден указанный пользователь!\nПример: **\`${message.content.split(" ")[0].toLowerCase()} [@user | userID]\`**`, message)
// .then(msg => { message.delete(); setTimeout(() => {msg.delete()}, 10000)})
            if(mentuser.id != message.member.id) MongoFunc.createUser(mentuser.id, message.guild.id)
            let check = await User.findOne({userID: mentuser.id,guildID: message.guild.id})
            let timeout = 0
            if(!check || check == null) timeout = 500

            setTimeout(async() => {
                const dbuser = await User.findOne({userID: mentuser.id,guildID: message.guild.id})
    
                let embed = new Discord.MessageEmbed()
                .setTitle(`Баланс пользователя ${mentuser.displayName}`)
                .setColor(noColor())
                .setThumbnail(mentuser.user.displayAvatarURL({format: 'png', size: 1024, dynamic: true}))
                .setFields(
                    {name: "На руках", value: `${dbuser.currency} ${coin}`, inline: true},
                    {name: "В банке", value: `${dbuser.bank} ${coin}`, inline: true},
                    {name: "Всего", value: `${parseInt(dbuser.currency) + parseInt(dbuser.bank)} ${coin}`, inline: true},
                )
                return message.reply({embeds: [embed]})
            }, timeout)
        }catch(err){
            console.error(chalk.redBright(err.stack))
            console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
        }
    }
}
