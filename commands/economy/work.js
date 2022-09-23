const chalk = require('chalk')

module.exports = {
    name: "work",
    category: "fun",
    description: "Test",
    aliases: ["работа", "daily", "ежед"],
    run: async (bot, message, args) => {

        try{
          
            const Discord = require('discord.js')
            const User = require('../../models/user')
            const Guild = require('../../models/guild')
            const Economy = require('../../models/economy')
            const Util = require('../../functions/Util')
            const coin = Util.findEmoji('CHPOKI_COIN')
            const { Embeds, crossText, checkmarkText, noPerms, clockText } = require('../../functions/Embed') 
            const { noColor } = require('../../functions/Colours')
            const prefix = bot.server.get(message.guild.id).prefix
            const ms = require('parse-ms')
            const economy = await Economy.findOne({guildID: message.guild.id})
            const dailyArray = economy.daily_text

            

            if(args[0] == "help" || args[0] == "помощь"){
                const userEmbed = new Embeds({
                    message: message,
                    description: `Позволяет поработать и получить небольшую прибыль\nПерезарядка: **4 часа**`,
                    embedTitle: "WORK HELP-MENU",
                    embedColor: noColor(),
                    alternatives: `● Отсутствуют`,
                    examples: `● **\`${prefix}work\`**`,
                })

                const adminEmbed = new Embeds({
                    message: message,
                    description: `Позволяет поработать и получить небольшую прибыль\nПерезарядка: **4 часа**\nБудучи администратором вы можете управлять списком ответов`,
                    embedTitle: "WORK HELP-MENU [ADMIN]",
                    embedColor: noColor(),
                    arguments: `● **\`${prefix}work [list/список]\`**\n● **\`${prefix}work [add/добавить] <Сообщение>\`**\n● **\`${prefix}work [remove/удалить] <ID>\`**\n● **\`${prefix}work [edit/изменить] <ID> <Новый текст>\`**`,
                    alternatives: `● **\`${prefix}work\`** | **\`${prefix}работа\`** | **\`${prefix}ежед\`**`,
                    examples: `● **\`${prefix}work\`**\n● **\`${prefix}work list\`**\n● **\`${prefix}work add Нашел на дорогое {coin}\`**\n● **\`${prefix}work remove <ID>\`**\n● **\`${prefix}work edit <ID> <Новый текст>\`**`,
                    hints: `● **\`{coin}\`** в момент использования команды будет заменено на полученную сумму\n● ID можно посмотреть в списке ответов\n● **\`[]\`** - необязательно для заполнения\n● **\`<>\`** - обязательно для заполнения`
                })

                if(!Util.checkPerm(message.member, "ADMINISTRATOR")) return adminEmbed.help()
                return userEmbed.help()
            }

            if(!args[0]){

                let check = await User.findOne({userID: message.member.id,guildID: message.guild.id})
                let timeout = 0
                if(!check || check == null) timeout = 500

                setTimeout(async () => {
                    try{
                        let dbUser = await User.findOne({guildID: message.guild.id,userID: message.member.id})
                        let randDaily = Math.floor(Math.random() * dailyArray.length)
                        let cooldown = 1000 * 60 * 60 * 4
                        let amount = Math.floor(20 + Math.random() * 80)
                        let dailyText = dailyArray.length != 0 ? dailyArray[randDaily].replace(/{coin}/g, `**${amount}**${coin}`) : `Стандартное сообщение, если нет добавленных фраз ${amount}${coin}`
    

                        if(dbUser.daily_cd !== null && cooldown - (Date.now() - parseInt(dbUser.daily_cd)) < 0){
                            dbUser.currency = parseInt(dbUser.currency) + amount
                            dbUser.total_currency = parseInt(dbUser.bank) + parseInt(dbUser.currency)
                            //dbUser.daily_cd = Date.now()
                            dbUser.save().catch(console.error).then(`${message.member.displayName} использовал work и получил ${amount}`)
                            return checkmarkText(dailyText, message)
                        } else {
                            let time = ms(cooldown - (Date.now() - parseInt(dbUser.daily_cd)))
                            return clockText(`Вы не можете работать еще **${time.hours}ч  ${time.minutes}м ${time.seconds}с**`, message)
                        }

                    }catch(err){
                        console.error(chalk.redBright(err.stack))
                        console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
                    }

                }, timeout)
            } else if(args[0] == "list" || args[0] == "список"){
                if(Util.checkPerm(message.member, "ADMINISTRATOR")) return noPerms(message)

                if(dailyArray.length == 0) return crossText(`Этот список пустует. Выводится стандартное сообщение`, message)
                i = 1
                let textArray = Array()
                dailyArray.forEach(element => {
                    textArray.push(`**${i}.** ${element}`)
                    i++
                });
                let embed = new Discord.MessageEmbed()
                .setColor(noColor())
                .setTitle(`Список текстов work`)
                .setDescription(textArray.join('\n'))

                message.reply({ embeds: [embed]})
            } else if(args[0] == "add" || args[0] == "добавить"){
                if(Util.checkPerm(message.member, "ADMINISTRATOR")) return noPerms(message)

                if(!args[1]) return crossText(`Введите текст, который хотите добавить\nПример: **\`${message.content.split(" ")[0].toLowerCase()} add <Новый текст>\`**`, message)
                let newText = args.splice(1).join(" ")
                checkmarkText(`Текст \`${newText}\` был добавлен в список work`, message)
                dailyArray.push(newText)
                economy.save().catch(console.error)
            } else if(args[0] == "delete" || args[0] == "удалить"){
                if(Util.checkPerm(message.member, "ADMINISTRATOR")) return noPerms(message)

                if(!args[1]) return crossText(`Введите ID текста, который хотите удалить\nПример: **\`${message.content.split(" ")[0].toLowerCase()} delete <ID>\`**`, message)
                if(args[1] && dailyArray[parseInt(args[1]) - 1] == null) return crossText(`Указанный вами ID не найден в списке\nПример: **\`${message.content.split(" ")[0].toLowerCase()} delete <ID>\`**`, message)
                checkmarkText(`Текст \`${dailyArray[parseInt(args[1]) - 1]}\` был удален из списка work`, message)
                dailyArray.pull(dailyArray[parseInt(args[1]) - 1])
                economy.save().catch(console.error)
            } else if(args[0] == "edit" || args[0] == "изменить"){
                if(Util.checkPerm(message.member, "ADMINISTRATOR")) return noPerms(message)

                if(!args[1]) return crossText(`Введите ID текста и текст, на который хотите изменить\nПример: **\`${message.content.split(" ")[0].toLowerCase()} edit <ID> <Новый текст>\`**`, message)
                if(args[1] && dailyArray[parseInt(args[1]) - 1] == null) return crossText(`Указанный вами ID не найден в списке\nПример: **\`${message.content.split(" ")[0].toLowerCase()} edit <ID> <Новый текст>\`**`, message)
                if(!args[2]) return crossText(`Введите новый текст\nПример: **\`${message.content.split(" ")[0].toLowerCase()} edit <ID> <Новый текст>\`**`, message)
                let newText = args.splice(2).join(" ")
                checkmarkText(`Текст \`${dailyArray[parseInt(args[1]) - 1]}\` изменен на \`${newText}\``, message)
                dailyArray.set(parseInt(args[1]) - 1, newText)
                economy.save().catch(console.error)
            } 


        }catch(err){
            console.error(chalk.redBright(err.stack))
            console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
        }
    }  
}

