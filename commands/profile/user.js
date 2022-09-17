const chalk = require('chalk')
module.exports = {
    name: "user",
    description: "Описание команд",
    aliases: ["юзер"],
    run: async (bot, message, args) => {

        try{

            const Discord = require('discord.js')
            const User = require('../../models/user')
            const Guild = require('../../models/guild')
            const { Embeds, crossText, checkmarkText } = require('../../functions/Embed') 
            const { noColor } = require('../../functions/Colours')
            const {findEmoji} = require('../../functions/Util')
            const dateFormat = require("dateformat")

            const TimeAgo = require('javascript-time-ago')
            const timeAgo = new TimeAgo('ru-RU')

            //if(message.member.id != "329462919676821504") return
            
            const mentuser = args[0] ? message.guild.members.cache.get(args[0].replace('<@', '').replace('>', '')) : null || message.member
            
            const prefix = bot.server.get(message.guild.id).prefix
            if(!(bot.server.get(message.guild.id).leveling_channels).includes(message.channel.id) && message.member.id != "329462919676821504") return crossText(`Данная команда разрешена лишь в следующих чатах: ${message.guild.channels.cache.find(ch => ch.id == "880530956304392262") || "880530956304392262"} ${message.guild.channels.cache.find(ch => ch.id == "841889007654141982") || "841889007654141982"}`, message)
          
            if(args[0] == "help" || args[0] == "помощь"){
                const embed = new Embeds({
                    message: message,
                    description: `Информация о пользователе`,
                    embedTitle: "USER HELP-MENU",
                    embedColor: noColor(),
                    arguments: `● **\`${prefix}user [@user | userID]\`**`,
                    alternatives: `● **\`${prefix}user\`** | **\`${prefix}юзер\`**`,
                    examples: `● **\`${prefix}user @user\`**`,
                    hints: `● **\`[]\`** - необязательно для заполнения`
                })
          
                return embed.help()
            }

            if(!mentuser) return crossText(`Не был найден указанный пользователь`, message)

            let dbUser = await User.findOne({guildID: message.guild.id, userID: mentuser.id}, {}).limit(1).lean()
            let res = await User.find({guildID: message.guild.id, xp_block: false, week_xp: {$gt: 0}}, {userID: 1}).sort({week_xp: -1}).limit(500).lean()
            let res_count = await User.count({guildID: message.guild.id, xp_block: false, week_xp: {$gt: 0}})
            let finded = res.find(el => el.userID === mentuser.id)
            let index = res.indexOf(finded)

            var status
            if(!mentuser.presence || mentuser.presence.status == 'offline') status = `${findEmoji('offline')}Не в сети`
            if(mentuser.presence && mentuser.presence.status == 'online') status = `${findEmoji('online')}В сети`
            if(mentuser.presence && mentuser.presence.status == 'idle') status = `${findEmoji('idle')}Не активен`
            if(mentuser.presence && mentuser.presence.status == 'dnd') status = `${findEmoji('dnd')}Не беспокоить`

            let joinDate = dateFormat(new Date(mentuser.joinedTimestamp), "dd.mm.yyyy HH:MM")
            let creationDate = dateFormat(new Date(mentuser.user.createdAt), "dd.mm.yyyy HH:MM")
            let joinAgo = timeAgo.format(Date.now() - (Date.now() - mentuser.joinedTimestamp))
            let creationAgo = timeAgo.format(Date.now() - (Date.now() - mentuser.user.createdAt))

            let nextLvlXP = 5 * dbUser.level**2 + 50 * dbUser.level + 100

            function msToTime(millis) {
                var hours = Math.floor(millis / (60000 * 60));
                var minutes = Math.floor((millis % (60000 * 60)) / 60000).toFixed(0);
                var seconds = ((millis % 60000) / 1000).toFixed(0);
                if(hours >= 1){
                  return (hours < 10 ? '0' : '') + hours + ":" + (minutes < 10 ? '0' : '') + minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
                } else {
                  return (minutes < 10 ? '0' : '') + minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
                }
              }

            let embed = new Discord.MessageEmbed()
            .setTitle(`Информация о ${mentuser.displayName}`)
            .setThumbnail(mentuser.displayAvatarURL({format: 'png', size: 1024, dynamic: true}))
            .setColor(noColor())
            .setFields(
                {name: "Основная информация", value: `**Имя пользователя:** ${mentuser.user.username}#${mentuser.user.discriminator} (${mentuser.displayName})\n**Статус:** ${status}${(mentuser.presence && mentuser.presence.activities[0] && mentuser.presence.activities[0].type == 'CUSTOM') ? `\n**Пользовательский статус:** ${mentuser.presence.activities[0].state}` : ''}\n**Дата присоединения:** ${joinDate} (${joinAgo})\n**Дата создания:** ${creationDate} (${creationAgo})`},
                {name: `Рейтинг:`, value: `# ${dbUser.xp_block != true ? index != -1 ? `${index + 1}/${res_count}` : `500+/${res_count}` : `Не участвует`}`, inline: true},
                {name: `Уровень:`, value: `${dbUser.level}`, inline: true},
                {name: `Опыт:`, value: `${dbUser.xp}/${nextLvlXP}`, inline: true},
            )

            if(dbUser.voice_time > 0) embed.addField(`Голосовая активность:`,`${msToTime(dbUser.voice_time)}`)

            if(mentuser.user.banner) embed.setImage(mentuser.user.banner)

            message.reply({embeds: [embed]})

        }catch(err){
            console.error(chalk.redBright(err.stack))
            console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
        }
    }
}
  