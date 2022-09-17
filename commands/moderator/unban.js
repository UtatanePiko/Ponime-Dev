const chalk = require('chalk')

module.exports = {
    name: "unban",
    description: "Описание команд",
    aliases: ["разбан", "анбан"],
    run: async (bot, message, args) => {
        
        try{

            const Discord = require('discord.js')
            const Util = require('../../functions/Util')
            const Ban = require('../../models/ban')
            const Guild = require('../../models/guild')
            const { Embeds, crossText, checkmarkText, noPerms } = require('../../functions/Embed') 
            const { noColor } = require('../../functions/Colours')

            if(Util.checkPerm(message.member, "BAN_MEMBERS")) return noPerms(message)
            
            const prefix = bot.server.get(message.guild.id).prefix
            if(!(bot.server.get(message.guild.id).moderation_channels).includes(message.channel.id)) return crossText(`Данная команда разрешена лишь в ${message.guild.channels.cache.find(ch => ch.id == "812070015133810718") || "812070015133810718"}`, message)
      
            if(args[0] == "help" || args[0] == "помощь"){
                const embed = new Embeds({
                    message: message,
                    description: `Разбан определенного пользователя`,
                    embedTitle: "UNBAN HELP-MENU",
                    embedColor: noColor(),
                    arguments: `● **\`${prefix}unban <userID> <Причина>\`**`,
                    alternatives: `● **\`unban\`** | **\`разбан\`** | **\`анбан\`**`,
                    examples: `● **\`${prefix}unban @user <Причина>\`**`,
                    hints: `● Альтернативы используются для сокращения написания команды и ничем не отличаются\n● **\`<>\`** - обязательно для заполнения`
                })
          
                return embed.help()
              }

              let ban = await message.guild.bans.fetch();
              let userID = args[0]
              //var unbanned = false
              let reason = args.splice(1).join(" ")
              if(!reason) return crossText(`Вы не указали причину!\nПример: **\`${message.content.split(" ")[0].toLowerCase()} <ID> <Причина>\`**`, message)
              console.log(userID)
              let getBan = await ban.get(userID)
              if(!getBan) return crossText(`Не было найдено бана с таким пользователем`, message).then(console.log(getBan))

              await message.guild.bans.fetch(userID).then(async (ban) => {
                await message.guild.bans.remove(ban.user.id)
                //unbanned = true
            }).catch(err => {return message.reply(`Возникла непредвиденная ошибка. Обратитесь к администратору бота`).then(console.error(err))})

              //if(unbanned == false) return crossText(`Возникла ошибка при поиске бана на сервере`, message)

              let findBan = await Ban.findOne({guildID: message.guild.id, userID: userID}).sort({"_id":-1}).limit(1)
              if(!findBan) console.log(`Не было найдено бана`)
              if(findBan) {
                findBan.unbanned_by = message.member.id
                findBan.unbanned_date = Date.now()
                findBan.unbanned_reason = reason
                findBan.expired = true
                await findBan.save().then(console.log(`${message.member.id} разбанил ${userID} на сервере ${message.guild.name}`)).catch()
              }

              return checkmarkText(`Бын был успешно снят`, message)


        }catch(err){
            console.error(chalk.redBright(err.stack))
            console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
        }
    }
}
