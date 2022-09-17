const chalk = require('chalk')

module.exports = {
    name: "roll",
    description: "Описание команд",
    aliases: ['ролл'],
    run: async (bot, message, args) => {

        try{

            const mongoose = require('mongoose')
            const Discord = require('discord.js')
            const Guild = require('../../models/guild')
            const Love = require('../../models/love')
            const { Embeds, crossText } = require('../../functions/Embed') 
            const { noColor } = require('../../functions/Colours')
            const {findEmoji} = require('../../functions/Util')
            const prefix = bot.server.get(message.guild.id).prefix
            if(!(bot.server.get(message.guild.id).leveling_channels).includes(message.channel.id)) return crossText(`Данная команда разрешена лишь в следующих чатах: ${message.guild.channels.cache.find(ch => ch.id == "880530956304392262") || "880530956304392262"} ${message.guild.channels.cache.find(ch => ch.id == "841889007654141982") || "841889007654141982"}`, message)

            if(args[0] == "help" || args[0] == "помощь"){
                const embed = new Embeds({
                    message: message,
                    description: `Выбросить случайное число`,
                    embedTitle: "ROLL HELP-MENU",
                    embedColor: noColor(),
                    arguments: `● **\`${prefix}roll [число] [число]\`**`,
                    alternatives: `● **\`${prefix}roll\`** | **\`${prefix}ролл\`**`,
                    examples: `● **\`${prefix}roll\`**\n● **\`${prefix}roll 100\`**\n● **\`${prefix}roll 10 50\`**`,
                    hints: `● **\`[]\`** - необязательно для заполнения`
                })
                return embed.help()
            }

            let result, num1, num2

            if(args.length == 0){
                result = Math.floor(Math.random() * 101)
            } else if(args.length == 1){
                num1 = args[0]
                if(!isFinite(num1) || num1 % 1 !== 0 || num1.includes("+")  || num1.includes(".")) return crossText(`Аргумент должен быть целым числом`, message)
                result = Math.floor(Math.random() * (parseInt(num1) + 1))
            } else {
                num1 = args[0]
                num2 = args[1]
                if(!isFinite(num1) || num1 % 1 !== 0 || num1.includes("+")  || num1.includes(".")) return crossText(`Первый аргумент должен быть целым числом`, message)
                if(!isFinite(num2) || num2 % 1 !== 0 || num2.includes("+")  || num2.includes(".")) return crossText(`Второй аргумент должен быть целым числом`, message)
                if(parseInt(num1) >= parseInt(num2)) return crossText(`Первое число должно быть меньше второго`, message)
                result = Math.floor(parseInt(num1) + (Math.random() * (parseInt(num2) - parseInt(num1) + 1)))
            }

            let embed = new Discord.MessageEmbed()
            .setTitle(`Случайное число`)
            .setColor(noColor())
            // .setFields(
            //     {name: `Значение:`, value: `От **\`${num2 ? num1 : 0}\`** до **\`${num2 ? num2 : num1}\`**`},
            //     {name: `Результат:`, value: `**\`${result}\`**`}
            // )
            .setDescription(`Вы выбросили число от **${num2 ? num1 : 0}** до **${num2 ? num2 : num1 ? num1 : 100}**\nРезультат: **${result}**`)
            message.reply({embeds: [embed]})

    
        }catch(err){
            console.error(chalk.redBright(err.stack))
            console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
        }
    }
}
