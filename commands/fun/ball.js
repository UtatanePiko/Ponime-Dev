const chalk = require('chalk')

module.exports = {
    name: "ball",
    description: "Описание команд",
    aliases: ['шар'],
    run: async (bot, message, args) => {

        try{

            const Discord = require('discord.js')
            const Guild = require('../../models/guild')
            const { Embeds, crossText } = require('../../functions/Embed') 
            const { noColor } = require('../../functions/Colours')
            const prefix = bot.server.get(message.guild.id).prefix
            if(!(bot.server.get(message.guild.id).leveling_channels).includes(message.channel.id)) return crossText(`Данная команда разрешена лишь в следующих чатах: ${message.guild.channels.cache.find(ch => ch.id == "880530956304392262") || "880530956304392262"} ${message.guild.channels.cache.find(ch => ch.id == "841889007654141982") || "841889007654141982"}`, message)

            if(args[0] == "help" || args[0] == "помощь"){
                const embed = new Embeds({
                    message: message,
                    description: `Магический шар, который отвечает положительно или отрицательно на ваш вопрос`,
                    embedTitle: "BALL HELP-MENU",
                    embedColor: noColor(),
                    arguments: `● **\`${prefix}ball <Вопрос>\`**`,
                    alternatives: `● **\`${prefix}ball\`** | **\`${prefix}шар\`**`,
                    examples: `● **\`${prefix}ball Существует ли жизнь на других планетах?\`**`,
                    hints: `● **\`<>\`** - обязательно для заполнения`
                })
                return embed.help()
            }

            const question = args.slice(0).join(" ")

            if(!question) return crossText(`Вы не указали вопрос`, message)

            const answers = ["Нет", "Бесспорно", "Никаких сомнений", "Определенно да", "Можешь быть уверен(а) в этом", "Даже не думай", "Весьма сомнительно", "Лучше не рассказывать", "Определенно нет"]
            let rand = Math.floor(Math.random() * 9)

            let embed = new Discord.MessageEmbed()
            .setTitle(`Магический шар`)
            .setFields(
                {name: `Вопрос:`, value: question},
                {name: `Ответ:`, value: answers[rand]}
            )
            .setColor(noColor())

            return message.reply({embeds: [embed]})
    
        }catch(err){
            console.error(chalk.redBright(err.stack))
            console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
        }
    }
}
