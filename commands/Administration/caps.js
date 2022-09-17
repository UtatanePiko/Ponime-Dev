const chalk = require('chalk')

module.exports = {
    name: "caps",
    description: "Описание команд",
    aliases: ["капс"],
    run: async (bot, message, args) => {

        try{

            const Discord = require('discord.js')
            const User = require('../../models/user')
            const Guild = require('../../models/guild')
            const MongoFunc = require('../../functions/MongoFunc') 
            const { Embeds, crossText, noPerms, checkmarkText } = require('../../functions/Embed') 
            const { noColor } = require('../../functions/Colours')
            const Util  = require('../../functions/Util') 
            const server = await Guild.findOne({ guildID: message.guild.id })
            const ms = require('ms')
    
            if(Util.checkPerm(message.member, "ADMINISTRATOR")) return noPerms(message)

            if(args[0] == "help" || args[0] == "помощь"){
                const embed = new Embeds({
                    message: message,
                    description: `Изменение автомодерации капса`,
                    embedTitle: "CAPS HELP-MENU",
                    embedColor: noColor(),
                    arguments: `● **\`${server.prefix}caps msg [Сообщение]\`**\n● **\`${server.prefix}caps dur [Длительность ограничения чата]\`**`,
                    alternatives: `● **\`caps\`** | **\`капс\`**`,
                    examples: `● **\`${server.prefix}caps msg Мут за спам капсом пользователю {user}\`**\n● **\`${server.prefix}caps dur 10мин\`**`,
                    hints: `● **\`{user}\`** заменяется на пользователя, к кому применится эта модерация\n● **\`<>\`** - обязательно для заполнения`
                })
    
                return embed.help()
            }

            if(!args[0]) return crossText(`Не указано никаких аргументов\nИспользуйте **\`${message.content.split(" ")[0].toLowerCase()} help\`**, чтобы узнать возможные аргументы`, message)
            if(args[0] == "msg" || args[0] == "message" || args[0] == "сообщение"){
                let text = args.slice(1).join(' ')
                if(!text){
                    let embed = new Discord.MessageEmbed()
                    .setTitle(`Сообщение при обильном капсе`)
                    .setColor(noColor())
                    if(!server.caps_msg) embed.setDescription(`В данный момент не установлено никакого сообщение, поэтому используется стандартный шаблон: **\`{user} спам капсом. Мут 5 минут\`**`)
                    if(server.caps_msg) embed.setDescription(`В данный момент используется следующее сообщение:\n**\`${server.caps_msg}\`**`)
                    return message.channel.send({embeds: [embed]})
                }
                server.caps_msg = text
                await server.save().catch()
                return checkmarkText(`Выводимое сообщение при капсе было измнено на:\n**\`${text}\`**`, message)
            } else if(args[0] == "dur" || args[0] == "duration" || args[0] == "длительность"){
                if(!args[1]){
                    let embed = new Discord.MessageEmbed()
                    .setTitle(`Длительность ограничения чата [CAPS]`)
                    .setColor(noColor())
                    if(!server.caps_duration) embed.setDescription(`В данный момент не установлено длительности ограничения чата, поэтому используется стандартная длительность: **\`5м\`**`)
                    if(server.caps_duration) embed.setDescription(`В данный момент используется следующая длительность ограничения чата:\n**\`${!server.caps_duration ? "5m" : ms(server.caps_duration)}\`**`)
                    return message.channel.send({embeds: [embed]})
                }
                let duration = (args[1]).replace(/с/g, "s").replace(/секунд/g, "s").replace(/сек/g, "s").replace(/минут/g, "m").replace(/мин/g, "m").replace(/м/g, "m").replace(/часа/g, "h").replace(/час/g, "h").replace(/ч/g, "h").replace(/дня/g, "d").replace(/день/g, "d").replace(/д/g, "d").replace(/нед/g, "w").replace(/н/g, "w").replace(/год/g, "y").replace(/г/g, "y").replace(/года/g, "y")
                if(ms(duration) == null || ms(duration) == undefined) return crossText(`Указанная вами длительность ограничения чата введена неверено`, message)
                server.caps_duration = ms(duration)
                server.save().catch()
                return checkmarkText(`Длительность ограничения чата была успешно изменена на **\`${duration}\`**`, message)
            } else {
                return crossText(`Не было найдено такого аргумента`, message)
            }

        }catch(err){
            console.error(chalk.redBright(err.stack))
            console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
        }
    }
}