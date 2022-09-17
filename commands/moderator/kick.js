const chalk = require('chalk')

module.exports = {
    name: "kick",
    description: "Описание команд",
    aliases: ["кик"],
    run: async (bot, message, args) => {
        
        try{

            const Discord = require('discord.js')
            const Util = require('../../functions/Util')
            const Guild = require('../../models/guild')
            const { Embeds, crossText, checkmarkText, noPerms } = require('../../functions/Embed') 
            const { noColor } = require('../../functions/Colours')
            const prefix = bot.server.get(message.guild.id).prefix
            const mentuser = args[0] ? message.guild.members.cache.get(args[0].replace('<@', '').replace('>', '')) : null

            if(Util.checkPerm(message.member, "KICK_MEMBERS")) return noPerms(message)

            if(args[0] == "help" || args[0] == "помощь"){
                const embed = new Embeds({
                    message: message,
                    description: `Кик определенного пользователя`,
                    embedTitle: "KICK HELP-MENU",
                    embedColor: noColor(),
                    arguments: `● **\`${prefix}kick <@user | userID> <Причина>\`**`,
                    alternatives: `● **\`${prefix}kick\`** | **\`${prefix}кик\`**`,
                    examples: `● **\`${prefix}kick @user Причина\`**`,
                    hints: `● Альтернативы используются для сокращения написания команды и ничем не отличаются\n● **\`<>\`** - необязательно для заполнения`
                })
          
                return embed.help()
            }

            if(!mentuser) return crossText(`Не указан или не найден пользователь!\nПример: **\`${message.content.split(" ")[0].toLowerCase()} <@user | userID> <Причина>\`**`, message)
            let reason = args.splice(1).join(" ")
            if(!reason) return crossText(`Вы не указали причину!\nПример: **\`${message.content.split(" ")[0].toLowerCase()} <@user | userID> <Причина>\`**`, message)
            await mentuser.user.send({ content: `Вы были выгнаны с сервера **${message.guild.name}**\nПричина: **${reason}**\nВыгнал: **${message.member.user.tag}**\n\nhttps://discord.gg/KKETWhFNQ9` }).then(async () => {
                await mentuser.kick()
                return checkmarkText(`Пользователь **${mentuser.user.username}#${mentuser.user.discriminator}** был успешно кикнут`, message)
            })

        }catch(err){
            console.error(chalk.redBright(err.stack))
            console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
        }
    }
}
