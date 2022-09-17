const chalk = require('chalk')

module.exports = {
    name: "temprole",
    description: "Описание команд",
    aliases: ["tr", "времроль"],
    run: async (bot, message, args) => {
        
        try{

            const Discord = require('discord.js')
            const mongoose = require('mongoose')
            const Util = require('../../functions/Util')
            const Guild = require('../../models/guild')
            const Temprole = require('../../models/temprole')
            const ms = require('ms')
            const { Embeds, crossText, checkmarkText, noPerms } = require('../../functions/Embed') 
            const { noColor } = require('../../functions/Colours')
            const server = await Guild.findOne({ guildID: message.guild.id })
            const mentuser =  args[0] ? message.guild.members.cache.get(args[0].replace('<@', '').replace('>', '')) : null
            const prefix = bot.server.get(message.guild.id).prefix
            if(!message.member.roles.cache.has(server.ultraRole)) return noPerms(message)

            if(args[0] == "help" || args[0] == "помощь"){
                const embed = new Embeds({
                    message: message,
                    description: `Выдача роли на определенный срок`,
                    embedTitle: "TEMPROLE HELP-MENU",
                    embedColor: noColor(),
                    arguments: `● **\`${prefix}temprole <@user | userID> <@role | roleID> <Длительность>\`**`,
                    alternatives: `● **\`${prefix}temprole\`** | **\`${prefix}tr\`** | **\`${prefix}времроль\`**`,
                    examples: `● **\`${prefix}temprole @user @vip 1ч\`**`,
                    hints: `● Альтернативы используются для сокращения написания команды и ничем не отличаются\n● **\`<>\`** - обязательно для заполнения`
                })
          
                return embed.help()
            }

            if(!mentuser) return crossText(`Не указан или не найден пользователь!\nПример: **\`${message.content.split(" ")[0].toLowerCase()} @user @vip 1ч\`**`, message)
            const role = message.mentions.roles.first() || message.guild.roles.cache.find(r => r.id === args[1])
            if(!role) return crossText(`Не указан или не найдена роль!\nПример: **\`${message.content.split(" ")[0].toLowerCase()} @user @vip 1ч\`**`, message)
            if(!args[2]) return crossText(`Длительность не указана!\nПример: **\`${message.content.split(" ")[0].toLowerCase()} @user @vip 1ч\`**`, message)
            let duration = (args[2]).replace(/с/g, "s").replace(/секунд/g, "s").replace(/сек/g, "s").replace(/минут/g, "m").replace(/мин/g, "m").replace(/м/g, "m").replace(/часа/g, "h").replace(/час/g, "h").replace(/ч/g, "h").replace(/дня/g, "d").replace(/день/g, "d").replace(/д/g, "d").replace(/нед/g, "w").replace(/н/g, "w").replace(/мес/g, "d").replace(/год/g, "d").replace(/г/g, "d").replace(/года/g, "d")
            if(ms(duration) == null || ms(duration) == undefined) return crossText(`Длительность введена неверна!\nПример: **\`${message.content.split(" ")[0].toLowerCase()} @user @vip 1ч\`**`, message)
            if(message.member.roles.highest.position <= role.position) return crossText("Вы не можете выдать вашу высшую роль или роль выше вашей", message)
            if(mentuser.roles.cache.has(role.id)) return crossText(`У этого пользователя есть эта роль`, message)
            if(mentuser.roles.highest.position >= role.position && message.guild.ownerId != message.member.id) return crossText("Вы не можете выдать эту роль, так как она выше вашей", message)
            let check = await Temprole.findOne({userID: mentuser.id, roleID: role.id})
            if(check && mentuser.roles.cache.has(role.id)) return crossText(`У этого пользователя в данный момент действует эта роль`, message)
            if(check && !mentuser.roles.cache.has(role.id)) await check.delete()
            var TF = false
            await mentuser.roles.add(role).catch(err => { crossText(`У меня недостаточно прав, чтобы выдать эту роль`, message); TF = true})

            if(TF == true) return

            let newTempRole = await new Temprole({
                _id: mongoose.Types.ObjectId(),
                guildID: message.guild.id,
                userID: mentuser.id,
                gived_by: message.member.id,
                roleID: role.id,
                date: Date.now(),
                duration: ms(duration),
            })

            await newTempRole.save()
            return checkmarkText(`Пользователю ${mentuser} была выдана роль ${role} на **\`${args[2]}\`**`, message)

        }catch(err){
            console.error(chalk.redBright(err.stack))
            console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
        }
    }
}
