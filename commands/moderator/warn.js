const chalk = require('chalk')

module.exports = {
    name: "warn",
    description: "Описание команд",
    aliases: ["пред"],
    run: async (bot, message, args) => {

        try{

            const Discord = require('discord.js')
            const User = require('../../models/user')
            const Guild = require('../../models/guild')
            const Warnings = require('../../models/warnings')
            const RoleCache = require('../../models/roleCache')
            const Mutes = require('../../models/mute')
            const MongoFunc = require('../../functions/MongoFunc')
            const Util = require('../../functions/Util')
            const mongoose = require('mongoose')
            const checkmark = Util.findEmoji('checkmark4')
            const cross = Util.findEmoji('cross4')
            const { Embeds, crossText, checkmarkText, noPerms } = require('../../functions/Embed') 
            const { noColor } = require('../../functions/Colours')
            const ms = require('ms')
            const prefix = bot.server.get(message.guild.id).prefix

            //let mentuser = args[0] ? message.guild.members.cache.get(args[0].replace('<@', '').replace('>', '')) : null

            let WarnedRole = await message.guild.roles.cache.find(r => r.name == "warned")
            if(!WarnedRole){
                await message.guild.roles.create({
                    name: "warned",
                    reason: "Эта роль была создана, так как не было найдено роли warned",
                }).then(async role => {
                    await message.guild.channels.cache.forEach(async (ch) => {
                        await ch.permissionOverwrites.edit(role, { SEND_MESSAGES: false, SPEAK: false, CONNECT: false }).catch();
                    });
                })
            } else {
                message.guild.channels.cache.forEach(async (ch) => {
                    if(ch.type == "GUILD_TEXT") ch.permissionOverwrites.edit(WarnedRole.id, { SEND_MESSAGES: false, SPEAK: false, CONNECT: false }).catch();
                })
            }

            const helperRole = message.guild.roles.cache.find(r => r.id == `830896489215688714`)
            if(Util.checkPerm(message.member, "MANAGE_ROLES") && !(helperRole && message.member.roles.cache.has(helperRole.id))) return noPerms(message)

            if(!(bot.server.get(message.guild.id).moderation_channels).includes(message.channel.id)) return crossText(`Данная команда разрешена лишь в ${message.guild.channels.cache.find(ch => ch.id == "812070015133810718") || "812070015133810718"}`, message)
      

            if(args[0] == "help" || args[0] == "помощь"){
                const embed = new Embeds({
                    message: message,
                    description: `Позволяет выдать предупреждение пользователю\nЗапрещает пользоваться голосовыми и текстовыми каналами`,
                    embedTitle: "WARN HELP-MENU",
                    embedColor: noColor(),
                    arguments: `● **\`${prefix}warn <@user | userID> <Длительность> <Причина>\`**`,
                    alternatives: `● **\`${prefix}warn\`** | **\`${prefix}пред\`**`,
                    examples: `● **\`${prefix}warn @user 3ч Плохое поведение\`**`,
                    hints: `● Альтернативы используются для сокращения написания команды и ничем не отличаются\nВремя предупреждение назначается автоматически\n● **\`<>\`** - обязательно для заполнения\n● **\`[]\`** - необязательно для заполнения`
                })
          
                return embed.help()
            }

            if(args[0] == 'remove' || args[0] == 'удалить' || args[0] == 'снять' ||  args[0] == 'delete'){
                if(args[1] == "help"){
                    const embed = new Embeds({
                        message: message,
                        description: `Позволяет снять предупреждение с пользователя`,
                        embedTitle: "WARN REMOVE HELP-MENU",
                        embedColor: noColor(),
                        arguments: `● **\`${prefix}warn remove <ID случая> <Причина>\`**`,
                        alternatives: `● **\`${prefix}warn remove\`** | **\`${prefix}пред снять\`** | **\`${prefix}пред удалить\`**`,
                        examples: `● **\`${prefix}warn remove 7 Случайно\`**`,
                        hints: `● Альтернативы используются для сокращения написания команды и ничем не отличаются\n● **\`<>\`** - обязательно для заполнения`
                    })
              
                    return embed.help()
                }

                const getWarnID = await Warnings.findOne({guildID: message.guild.id, ID: args[1]}, {userID: 1, warned_by: 1, unwarned_date: 1, unwarned_reason: 1, expired: 1}).sort({warnID: -1})
                //const cahedUser = await RoleCache.findOne({guildID: message.guild.id, userID: getWarnID.userID}, {username: 1, userID: 1}).lean()

                if(!args[1]) return crossText(`Не указан ID случая!\nПример: **\`${message.content.split(" ")[0].toLowerCase()} снять <ID случая> <Причина>\`**`, message)
                if(!getWarnID) return crossText(`Указанный вами ID случая **\`${args[1]}\`** не найден!`, message)
                let mentuser = message.guild.members.cache.find(m => m.id === getWarnID.userID)
                if(!mentuser && !cahedUser) return crossText(`Не удалось найти пользователя на сервере и в кэше`, message)
                if(mentuser && mentuser.id === message.member.id && message.guild.ownerId != message.member.id) return crossText("Вы не можете удалить предупреждение у самого себя", message)
                if(mentuser && mentuser.roles.highest.position >= message.member.roles.highest.position && message.guild.ownerId != message.member.id) return crossText("Вы не можете удалить предупреждение у этого пользователя, так как его роль выше вашей", message)
                let who_warned = message.guild.members.cache.find(m => m.id === getWarnID.warned_by)
                if(who_warned) if(who_warned.roles.highest.position > message.member.roles.highest.position) return crossText("Вы не можете удалить предупреждение у этого пользователя, так как его выдал пользователь выше вас по ролям", message)
                let reason = args.splice(2).join(" ")
                if(!reason) return crossText(`Вы не указали причину!\nПример: **\`${message.content.split(" ")[0].toLowerCase()} снять <ID случая> <Причина>\`**`, message)

                let embed = new Discord.MessageEmbed()
                .setDescription(`${checkmark} Пользователю **${mentuser ? mentuser : cahedUser.username}** было снятно предупреждение!`)
                .setColor("#00ae5d")
                message.reply({embeds: [embed]})
                getWarnID.unwarned_by = message.member.id
                getWarnID.unwarned_date = Date.now()
                getWarnID.unwarned_reason = reason
                getWarnID.expired = true
                getWarnID.save().catch(err => console.error(err))

                let dbUser = await User.findOne({userID: mentuser ? mentuser.id : cahedUser.userID, guildID: message.guild.id}, {warnings: 1})
                if(dbUser) dbUser.warnings -= 1
                await dbUser.save().catch(err => {console.error(err)})

                let checkWarns = await Warnings.findOne({guildID: message.guild.id, userID: getWarnID.userID, expired: false}, {}).lean()
                if(!checkWarns && mentuser) await mentuser.roles.remove(WarnedRole)
                
                return
            }

            let mentuser = message.mentions.members.first() || message.guild.members.cache.find(m => m.id == args[0])

            if(mentuser){
                message.channel.sendTyping()

                //if(!mentuser && !cahedUser) return crossText(`Не указан или не найден пользователь!\nПример: **\`${message.content.split(" ")[0].toLowerCase()} <@user | userID> <Причина>\`**`, message)
                if(mentuser && mentuser.user.bot) return crossText(`Нельзя выдать предупреждение моим коллегам!`, message)
                if(mentuser && mentuser.id === message.member.id) return crossText("Вы не можете выдать предупреждение самому себе", message)
                if(mentuser && (mentuser.roles.highest.position >= message.member.roles.highest.position && message.guild.ownerId != message.member.id)) return crossText("Вы не можете выдать предупреждение этому пользователю", message)
                
                let warnID = Math.floor(parseInt(bot.server.get(message.guild.id).warnID) + 1)
                let WarnedRole = message.guild.roles.cache.find(r => r.name == "warned")
                let Promises = await Promise.all([
                    await Warnings.findOne({userID: mentuser.id, guildID: message.guild.id, expired: false}, {}).lean(),
                    await Mutes.findOne({userID: mentuser ? mentuser.id : args[0], guildID: message.guild.id, expired: false}, {}).lean(),
                    await Warnings.find({ userID: mentuser.id, guildID: message.guild.id, unwarned_reason: 'none'}, {}).count() + 1
                ])
                let hasWarn = Promises[0] ? true : false
                let hasMute = Promises[1] ? true : false
                let warningUserCount = Promises[2]
                if(hasWarn){
                    //await message.delete()
                    let embed = new Discord.MessageEmbed()
                    .setDescription(`${cross} У этого пользователя еще действует предыдущее предупреждение!`)
                    .setColor("#922a37")
                    if(mentuser) mentuser.roles.add(WarnedRole)
                    return message.reply({content: `${message.member}`, embeds: [embed]})
                }
                if(hasMute) return crossText(`Нельзя выдать предупреждение пользователю, пока у него действует мьют`, message)
                if(!args[1]) return crossText(`Вы не указали длительность варна!\nПример: **\`${message.content.split(" ")[0].toLowerCase()} <@user | userID> <1с/м/ч/д> <Причина>\`**`, message)
                let duration = (args[1]).replace(/с/g, "s").replace(/секунд/g, "s").replace(/сек/g, "s").replace(/минут/g, "m").replace(/мин/g, "m").replace(/м/g, "m").replace(/часа/g, "h").replace(/час/g, "h").replace(/ч/g, "h").replace(/дня/g, "d").replace(/день/g, "d").replace(/д/g, "d").replace(/нед/g, "w").replace(/н/g, "w").replace(/год/g, "y").replace(/г/g, "y").replace(/года/g, "y")
                //console.log(duration[duration.length - 1])
                if(ms(duration) == null || ms(duration) == undefined || duration[duration.length - 1] % 1 == 0) return crossText(`Указанная вами длительность варна введена неверено!\nПример: **\`${message.content.split(" ")[0].toLowerCase()} <@user | userID> <1с/м/ч/д> <Причина>\`**`, message)
                duration = ms(duration)
                let reason = args.splice(2).join(" ")
                if(!reason) return crossText(`Вы не указали причину!\nПример: **\`${message.content.split(" ")[0].toLowerCase()} <@user | userID> <Причина>\`**`, message)
    
                let embed = new Discord.MessageEmbed()
                .setDescription(`Пользователь **${mentuser}** получил **${warningUserCount}** предупреждение!`)
                .setColor("#00ae5d")
                .setThumbnail('https://i.imgur.com/KB1yW8x.png')
                .addFields(
                    {name: 'Причина', value: `${reason}`},
                    {name: 'Длительность наказания', value: `${args[1]}`, inline: true},
                    {name: 'ID случая', value: `${warnID}`, inline: true},
                )
                message.reply({embeds: [embed]})

                bot.server.set(message.guild.id, {
                    prefix: bot.server.get(message.guild.id).prefix,
                    actions_channels: bot.server.get(message.guild.id).actions_channels,
                    leveling_channels: bot.server.get(message.guild.id).leveling_channels,
                    moderation_channels: bot.server.get(message.guild.id).moderation_channels,
                    warnID: warnID,
                    roles: bot.server.get(message.guild.id).roles,
                    event_channels: bot.server.get(message.guild.id).event_channels || []
                })

                if(mentuser) MongoFunc.createUser(mentuser.id, message.guild.id)

                let newWarning = new Warnings({
                    _id: mongoose.Types.ObjectId(),
                    ID: warnID,
                    guildID: message.guild.id,
                    userID: mentuser ? mentuser.id : args[0],
                    warned_by: message.member.id,
                    unwarned_by: 'none',
                    date: Date.now(),
                    unwarned_date: 0    ,
                    duration: duration,
                    reason: reason,
                    unwarned_reason: 'none',
                    expired: false
                })
    
                newWarning.save()
                let dbUser = await User.findOne({userID: mentuser ? mentuser.id : args[0], guildID: message.guild.id}, {warnings: 1})
                if(dbUser) dbUser.warnings += 1
                dbUser.save().catch(err => {console.error(err)})
                if(mentuser) mentuser.roles.add(WarnedRole).catch()
                if(mentuser && mentuser.voice.channelId) mentuser.voice.disconnect()
                if(mentuser)  mentuser.user.send({ content: `Вы получили предупреждение на сервере **${message.guild.name}**\nДлительность: **${duration / (1000 * 60 * 60)}ч**\nПричина: **${reason}**\nОт: **${message.member.user.tag}**` }).catch(console.log(`Не удалось отправить сообщение об варне пользователю в лс`))
            } else {
                message.channel.sendTyping()
                let cachedUser = await RoleCache.findOne({guildID: message.guild.id, userID: args[0]}, {userID: 1, uername: 1}).lean()
                if(!cachedUser) return crossText(`Не указан или не найден пользователь!\nПример: **\`${message.content.split(" ")[0].toLowerCase()} <@user | userID> <Причина>\`**`, message)
                
                let warnID = Math.floor(parseInt(bot.server.get(message.guild.id).warnID) + 1)
                let hasWarn = await Warnings.findOne({userID: cachedUser.userID, guildID: message.guild.id, expired: false}, {}).lean()
                if(hasWarn){
                    //await message.delete()
                    let embed = new Discord.MessageEmbed()
                    .setDescription(`${cross} У этого пользователя еще действует предыдущее предупреждение!`)
                    .setColor("#922a37")
                    return message.reply({content: `${message.member}`, embeds: [embed]})
                }
                let hasMute = await Mutes.findOne({userID: cachedUser.userID, guildID: message.guild.id, expired: false}, {}).lean()
                if(hasMute) return crossText(`Нельзя выдать предупреждение пользователю, пока у него действует мьют`, message)
                if(!args[1]) return crossText(`Вы не указали длительность варна!\nПример: **\`${message.content.split(" ")[0].toLowerCase()} <@user | userID> <1с/м/ч/д> <Причина>\`**`, message)
                let duration = (args[1]).replace(/с/g, "s").replace(/секунд/g, "s").replace(/сек/g, "s").replace(/минут/g, "m").replace(/мин/g, "m").replace(/м/g, "m").replace(/часа/g, "h").replace(/час/g, "h").replace(/ч/g, "h").replace(/дня/g, "d").replace(/день/g, "d").replace(/д/g, "d").replace(/нед/g, "w").replace(/н/g, "w").replace(/год/g, "y").replace(/г/g, "y").replace(/года/g, "y")
                if(ms(duration) == null || ms(duration) == undefined) return crossText(`Указанная вами длительность варна введена неверено!\nПример: **\`${message.content.split(" ")[0].toLowerCase()} <@user | userID> <1с/м/ч/д> <Причина>\`**`, message)
                duration = ms(duration)
                let reason = args.splice(2).join(" ")
                if(!reason) return crossText(`Вы не указали причину!\nПример: **\`${message.content.split(" ")[0].toLowerCase()} <@user | userID> <Причина>\`**`, message)
    
                let warningUserCount = await Warnings.find({ userID: cachedUser.userID, guildID: message.guild.id, unwarned_reason: 'none'}, {}).count() + 1
    
                let embed = new Discord.MessageEmbed()
                .setDescription(`Пользователь **${args[0]}** получил **${warningUserCount}** предупреждение!`)
                .setColor("#00ae5d")
                .setThumbnail('https://i.imgur.com/KB1yW8x.png')
                .addFields(
                    {name: 'Причина', value: `${reason}`},
                    {name: 'Длительность наказания', value: `${args[1]}`, inline: true},
                    {name: 'ID случая', value: `${warnID}`, inline: true},
                )
                message.reply({embeds: [embed]})

                if(cachedUser) MongoFunc.createUser(cachedUser.userID, message.guild.id)

                let newWarning = new Warnings({
                    _id: mongoose.Types.ObjectId(),
                    ID: warnID,
                    guildID: message.guild.id,
                    userID: cachedUser.userID,
                    warned_by: message.member.id,
                    unwarned_by: 'none',
                    date: Date.now(),
                    unwarned_date: 0,
                    duration: duration,
                    reason: reason,
                    unwarned_reason: 'none',
                    expired: false
                })
    
                newWarning.save()
                let dbUser = await User.findOne({userID: cachedUser.userID, guildID: message.guild.id}, {warnings: 1})
                if(dbUser) dbUser.warnings += 1
                dbUser.save().catch(err => {console.error(err)})
            }

            // let cahedUser, warn
            // let prom = await Promise.all([
            //     RoleCache.findOne({guildID: message.guild.id, userID: args[0]}, {userID: 1, uername: 1}).lean(),
            // ])
            // cahedUser = prom[0]
            // warn = prom[1]
        }catch(err){
            console.error(chalk.redBright(err.stack))
            console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
        }
    }
}
