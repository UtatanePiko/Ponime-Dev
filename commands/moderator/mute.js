    const chalk = require('chalk')

    module.exports = {
        name: "mute",
        description: "Описание команд",
        aliases: ["мьют", "мут"],
        run: async (bot, message, args) => {

            try{

                const Discord = require('discord.js')
                const Guild = require('../../models/guild')
                const Mute = require('../../models/mute')
                const Warnings = require('../../models/warnings')
                const MongoFunc = require('../../functions/MongoFunc')
                const Util = require('../../functions/Util')
                const mongoose = require('mongoose')
                const ms = require('ms')
                const { Embeds, crossText, checkmarkText, noPerms } = require('../../functions/Embed') 
                const { noColor } = require('../../functions/Colours')
                const prefix = bot.server.get(message.guild.id).prefix
                const cross = Util.findEmoji('cross4')
                const mentuser = args[0] ? args[0] ? message.guild.members.cache.get(args[0].replace('<@', '').replace('>', '')) : null : null
                const helperRole = message.guild.roles.cache.find(r => r.id == `830896489215688714`)

                if(Util.checkPerm(message.member, "MANAGE_ROLES") && !(helperRole && message.member.roles.cache.has(helperRole.id))) return noPerms(message)

                if(args[0] == "help" || args[0] == "помощь"){
                    const embed = new Embeds({
                        message: message,
                        description: `Позволяет выдать мьют пользователю на время\nМьют запрещает писать в канале, в котором он был выдан`,
                        embedTitle: "MUTE HELP-MENU",
                        embedColor: noColor(),
                        arguments: `● **\`${prefix}mute <@user | userID> <Длительность> <Причина>\`**`,
                        alternatives: `● **\`${prefix}mute\`** | **\`${prefix}мьют\`** | **\`${prefix}мут\`**`,
                        examples: `● **\`${prefix}mute @user 5ч Плохое поведение\`**`,
                        hints: `● Альтернативы используются для сокращения написания команды и ничем не отличаются\n● **\`<>\`** - обязательно для заполнения`
                    })
            
                    return embed.help()
                }

                if(!mentuser) return crossText(`Не указан или не найден пользователь!\nПример: **\`${message.content.split(" ")[0].toLowerCase()}<@user | userID> <1с/м/ч/д> <Причина>\`**`, message)
                if(mentuser.id === message.member.id) return crossText("Вы не можете выдать мьют самому себе", message)
                if(mentuser.user.bot) return crossText(`Нельзя выдать мьют моим коллегам!`, message)
                if(mentuser.roles.highest.position >= message.member.roles.highest.position && message.guild.ownerId != message.member.id) return crossText("Вы не можете выдать мьют этому пользователю", message)
                if(!args[1]) return crossText(`Вы не указали длительность мьюта!\nПример: **\`${message.content.split(" ")[0].toLowerCase()} <@user | userID> <1с/м/ч/д> <Причина>\`**`, message)
                let duration = (args[1]).replace(/с/g, "s").replace(/секунд/g, "s").replace(/сек/g, "s").replace(/минут/g, "m").replace(/мин/g, "m").replace(/м/g, "m").replace(/часа/g, "h").replace(/час/g, "h").replace(/ч/g, "h").replace(/дня/g, "d").replace(/день/g, "d").replace(/д/g, "d").replace(/нед/g, "w").replace(/н/g, "w").replace(/год/g, "y").replace(/г/g, "y").replace(/года/g, "y")
                if(ms(duration) == null || ms(duration) == undefined) return crossText(`Указанная вами длительность мьюта введена неверено!\nПример: **\`${message.content.split(" ")[0].toLowerCase()} <@user | userID> <1с/м/ч/д> <Причина>\`**`, message)
                let check = await Mute.findOne({userID: mentuser.id, expired: false})
                        
                if(check){
                    let embed = new Discord.MessageEmbed()
                    .setDescription(`${cross} Это пользователь уже находится в муте!`)
                    .setColor("#922a37")

                    return message.reply({ embeds: [embed]})
                }

                let hasWarn = await Warnings.findOne({userID: mentuser.id, guildID: message.guild.id, expired: false})
                if(hasWarn) return crossText(`Нельзя выдать предупреждение пользователю, пока у него действует предупреждение`, message)

                MongoFunc.createUser(mentuser.id, message.guild.id)

                const reason = args.splice(2).join(" ")
                if(!reason) return crossText(`Вы не указали причину!\nПример: **\`${message.content.split(" ")[0].toLowerCase()} <@user | userID> <1с/м/ч/д> <Причина>\`**`, message)
    // .then(msg => { message.delete(); setTimeout(() => {msg.delete()}, 10000)})
                    var muteID
                    let mute = await Mute.findOne().sort({"_id":-1}).limit(1)
                    if(!mute){
                        muteID = 0
                    } else {
                        muteID = parseInt(mute.ID) + 1
                    }

                let newMute = new Mute({
                    _id: mongoose.Types.ObjectId(),
                    ID: muteID,
                    guildID: message.guild.id,
                    userID: mentuser.id,
                    channelID: message.channel.id,
                    muted_by: message.member.id,
                    unmuted_by: 'none',
                    date: Date.now(),
                    unmuted_date: 0,
                    duration: ms(duration),
                    reason: reason,
                    unmuted_reason: 'none',
                    expired: false,
                    delete: message.channel.permissionOverwrites.cache.filter(m => m.id == mentuser.id).size == 0 ? true : false
                })

                await newMute.save()

                let embed = new Discord.MessageEmbed()
                .setDescription(`Пользователь **${mentuser}** получил мут!`)
                .setColor("#00ae5d")
                .setThumbnail('https://i.imgur.com/0kyE4pk.png')
                .addFields(
                    {name: 'Причина', value: `${reason}`},
                    {name: 'Длительность наказания', value: `${args[1]}`, inline: true},
                    {name: 'ID случая', value: `${muteID}`, inline: true},
                )

                message.channel.permissionOverwrites.edit(mentuser.id, {
                    SEND_MESSAGES: false
                }).catch(console.error);

                return message.reply({embeds: [embed]})
            }catch(err){
                console.error(chalk.redBright(err.stack))
                console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
            }
        }
    }
