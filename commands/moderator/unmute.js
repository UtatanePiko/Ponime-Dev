const chalk = require('chalk')

module.exports = {
    name: "unmute",
    description: "Описание команд",
    aliases: ["размутить", "анмьют", "анмут", "размьютить"],
    run: async (bot, message, args) => {

        try{

            const Discord = require('discord.js')
            const Guild = require('../../models/guild')
            const Mute = require('../../models/mute')
            const MongoFunc = require('../../functions/MongoFunc')
            const Util = require('../../functions/Util')
            const cross = Util.findEmoji('cross4')
            const checkmark = Util.findEmoji('checkmark4')
            const { Embeds, crossText, checkmarkText, noPerms } = require('../../functions/Embed') 
            const { noColor } = require('../../functions/Colours')
            const prefix = bot.server.get(message.guild.id).prefix
            const mentuser = args[0] ? message.guild.members.cache.get(args[0].replace('<@', '').replace('>', '')) : null
            const helperRole = message.guild.roles.cache.find(r => r.id == `830896489215688714`)

            if(Util.checkPerm(message.member, "MANAGE_ROLES") && !(helperRole && message.member.roles.cache.has(helperRole.id))) return noPerms(message)
          
            if(args[0] == "help" || args[0] == "помощь"){
                const embed = new Embeds({
                    message: message,
                    description: `Позволяет убрать действующий мьют пользователя`,
                    embedTitle: "UNMUTE HELP-MENU",
                    embedColor: noColor(),
                    arguments: `● **\`${prefix}unmute <@user | userID | user#1234> <Причина>\`**`,
                    alternatives: `● **\`${prefix}unmute\`** | **\`${prefix}размутить\`** | **\`${prefix}размьютить\`** | **\`${prefix}анмьют\`** | **\`${prefix}анмут\`**`,
                    examples: `● **\`${prefix}unmute @user Случайно\`**`,
                    hints: `● Альтернативы используются для сокращения написания команды и ничем не отличаются\n● **\`<>\`** - обязательно для заполнения`
                })
          
                return embed.help()
            }

            if(!mentuser) return crossText(`Не указан или не найден пользователь!\nПример: **\`${message.content.split(" ")[0].toLowerCase()} <@user | userID>\`**`, message)
            if(mentuser.user.bot) return crossText(`Нельзя выдать мьют моим коллегам!`, message)
            if(mentuser.id === message.member.id) return crossText("Вы не можете снять мьют самому себе", message)
            if(mentuser.roles.highest.position >= message.member.roles.highest.position && message.guild.ownerId != message.member.id) return crossText("Вы не можете снять мьют этому пользователю", message)
            let check = await Mute.findOne({userID: mentuser.id, guildID: message.guild.id, expired: false})
            if(!check) return crossText("Не было найдено действующего мьюта у этого пользователя", message)
            let who_muted = check.muted_by != "Авто-модерация" ? message.guild.members.cache.find(m => m.id === check.muted_by) : message.guild.members.cache.get(bot.user.id)
            if(who_muted && who_muted.id !== bot.user.id) if(who_muted.roles.highest.position > message.member.roles.highest.position) return crossText("Вы не можете удалить предупреждение у этого пользователя, так как его выдал пользователь выше вас по ролям", message)
            const reason = args.splice(1).join(" ")
            if(!reason) return crossText(`Вы не указали причину!\nПример: **\`${message.content.split(" ")[0].toLowerCase()} <@user | userID> <Причина>\`**`, message)
            let muteChannel = message.guild.channels.cache.get(`${check.channelID}`)
            if(!muteChannel) return message.reply({content: `Не найдено канала, в котором был выдан мут`})

            Mute.findOne().sort({'_id':-1}).limit(1).then(warn => { if(!warn) return; muteID = parseInt(warn.ID) + 1}) 

            MongoFunc.createUser(mentuser.id, message.guild.id)

            let embed = new Discord.MessageEmbed()
            .setDescription(`${checkmark} Пользователю **${mentuser}** был снят мут!`)
            .setColor("#00ae5d")

            check.unmuted_by = message.member.id
            check.unmuted_date = Date.now()
            check.unmuted_reason = reason
            check.expired = true
            check.save().catch(err => {console.error(err)})

            if(check.delete == true){
                muteChannel.permissionOverwrites.delete(mentuser.id)
            } else {
                muteChannel.permissionOverwrites.edit(mentuser.id, {
                    SEND_MESSAGES: null
                }).catch(console.error);
            }
            
            return message.reply({embeds: [embed]})
        

        }catch(err){
            console.error(chalk.redBright(err.stack))
            console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
        }
    }
}
