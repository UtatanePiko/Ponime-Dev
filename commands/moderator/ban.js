const chalk = require('chalk')

module.exports = {
    name: "ban",
    description: "Описание команд",
    aliases: ["бан", "забанить"],
    run: async (bot, message, args) => {
        
        try{

            const Discord = require('discord.js')
            const Util = require('../../functions/Util')
            const UserCache = require('../../models/roleCache')
            const Ban = require('../../models/ban')
            const mongoose = require('mongoose')
            const { Embeds, crossText, checkmarkText, noPerms } = require('../../functions/Embed') 
            const { noColor } = require('../../functions/Colours')
            const ms = require('ms')
            const mentuser = args[0] ? message.guild.members.cache.get(args[0].replace('<@', '').replace('>', '')) : null

            if(Util.checkPerm(message.member, "BAN_MEMBERS")) return noPerms(message)

            const prefix = bot.server.get(message.guild.id).prefix
            if(!(bot.server.get(message.guild.id).moderation_channels).includes(message.channel.id)) return crossText(`Данная команда разрешена лишь в ${message.guild.channels.cache.find(ch => ch.id == "812070015133810718") || "812070015133810718"}`, message)
      

            if(args[0] == "help" || args[0] == "помощь"){
                const embed = new Embeds({
                    message: message,
                    description: `Бан определенного пользователя`,
                    embedTitle: "BAN HELP-MENU",
                    embedColor: noColor(),
                    arguments: `● **\`${prefix}ban <@user | userID> [Длительность] <Причина>\`**`,
                    alternatives: `● **\`ban\`** | **\`бан\`** | **\`забанить\`**`,
                    examples: `● **\`${prefix}ban @user <Причина>\`**\n● **\`${prefix}ban @user 7д <Причина>\`**`,
                    hints: `● Длительность опцианальна и может быть пропущена, в таком случае, бан будет вечным\n● Если длительность указана в неверном формате, то бан будет вечным, а неправильно введенная длительность учтется в причине\n● Альтернативы используются для сокращения написания команды и ничем не отличаются\n● **\`<>\`** - обязательно для заполнения\n● **\`[]\`** - необязательно для заполнения`
                })
          
                return embed.help()
              }

              if(mentuser){
                let duration = (args[1]).replace(/с/g, "s").replace(/секунд/g, "s").replace(/сек/g, "s").replace(/минут/g, "m").replace(/мин/g, "m").replace(/м/g, "m").replace(/часа/g, "h").replace(/час/g, "h").replace(/ч/g, "h").replace(/дня/g, "d").replace(/день/g, "d").replace(/д/g, "d").replace(/нед/g, "w").replace(/н/g, "w").replace(/год/g, "y").replace(/г/g, "y").replace(/года/g, "y")
                let reason = ms(duration) == null || ms(duration) == undefined ? args.splice(1).join(" ") : args.splice(2).join(" ")
                if(!reason) return crossText(`Вы не указали причину!\nПример: **\`${message.content.split(" ")[0].toLowerCase()} <@user> <Причина>\`**`, message)
    
                var banID
                let ban = await Ban.findOne().sort({"_id":-1}).limit(1)
                if(!ban){
                    banID = 0
                } else {
                    banID = parseInt(ban.ID) + 1
                }
    
                let newBan = await new Ban({
                    _id: mongoose.Types.ObjectId(),
                    ID: banID,
                    guildID: message.guild.id,
                    userID: mentuser.id,
                    banned_by: message.member.id,
                    unbanned_by: null,
                    date: Date.now(),
                    unbanned_date: null,
                    reason: reason,
                    duration: ms(duration) != null || ms(duration) != undefined ? ms(duration) : 0,
                    expired: false
                })
                await newBan.save()
    
                await mentuser.user.send({ content: `Вы были забанены на сервере **${message.guild.name}**\nДлительность: **${duration}**\nПричина: **${reason}**\nЗабанил: **${message.member.user.tag}**\n\nНасчёт разбана писать **\`trayn#8328\`**${ms(duration) != null || ms(duration) != undefined ? `\n\nhttps://discord.gg/KKETWhFNQ9` : ``}`}).then(async () => {
                    await mentuser.ban({ reason: reason })
                }).catch(async (err) => {
                    await mentuser.ban({ reason: reason })
                })
    
                let embed = new Discord.MessageEmbed()
                .setDescription(`Пользователь **${mentuser.user.username}#${mentuser.user.discriminator}** был успешно забанен`)
                .setColor("#00ae5d")
                .setThumbnail('https://i.imgur.com/D1enPm7.png')
                .addFields(
                    {name: 'Причина', value: `${reason}`},
                    {name: 'Длительность', value: `${ ms(duration) != null || ms(duration) != undefined ? duration : "Навсегда"}`, inline: true},
                    {name: 'ID случая', value: `${banID}`, inline: true},
                )
                return message.reply({embeds: [embed]})
              } else {
                let cachedUser = await UserCache.findOne({guildID: message.guild.id, userID: args[0]})
                if(!cachedUser) return crossText(`Пользователь не указан или не был найден в кэше`, message)
                let duration = (args[1]).replace(/с/g, "s").replace(/секунд/g, "s").replace(/сек/g, "s").replace(/минут/g, "m").replace(/мин/g, "m").replace(/м/g, "m").replace(/часа/g, "h").replace(/час/g, "h").replace(/ч/g, "h").replace(/дня/g, "d").replace(/день/g, "d").replace(/д/g, "d").replace(/нед/g, "w").replace(/н/g, "w").replace(/год/g, "y").replace(/г/g, "y").replace(/года/g, "y")
                let reason = ms(duration) == null || ms(duration) == undefined ? args.splice(1).join(" ") : args.splice(2).join(" ")
                if(!reason) return crossText(`Вы не указали причину!\nПример: **\`${message.content.split(" ")[0].toLowerCase()} <@user> <Причина>\`**`, message)
    
                var banID
                let ban = await Ban.findOne().sort({"_id":-1}).limit(1)
                if(!ban){
                    banID = 0
                } else {
                    banID = parseInt(ban.ID) + 1
                }
    
                let newBan = await new Ban({
                    _id: mongoose.Types.ObjectId(),
                    ID: banID,
                    guildID: message.guild.id,
                    userID: args[0],
                    banned_by: message.member.id,
                    unbanned_by: null,
                    date: Date.now(),
                    unbanned_date: null,
                    reason: reason,
                    duration: ms(duration) != null || ms(duration) != undefined ? ms(duration) : 0,
                    expired: false
                })
                await newBan.save()
    

                await message.guild.bans.create(cachedUser.userID,{ reason: reason }).catch()
    
                let embed = new Discord.MessageEmbed()
                .setDescription(`Пользователь **${cachedUser.username}** был успешно забанен`)
                .setColor("#00ae5d")
                .setThumbnail('https://i.imgur.com/D1enPm7.png')
                .addFields(
                    {name: 'Причина', value: `${reason}`},
                    {name: 'Длительность', value: `${ ms(duration) != null || ms(duration) != undefined ? duration : "Навсегда"}`, inline: true},
                    {name: 'ID случая', value: `${banID}`, inline: true},
                )
                return message.reply({embeds: [embed]})
              }

        }catch(err){
            console.error(chalk.redBright(err.stack))
            console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
        }
    }
}
