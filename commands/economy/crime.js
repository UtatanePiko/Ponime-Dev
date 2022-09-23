const chalk = require('chalk')

module.exports = {
    name: "crime",
    category: "fun",
    description: "Test",
    aliases: ["криминал"],
    run: async (bot, message, args) => {

        try{
          
            const Discord = require('discord.js')
            const User = require('../../models/user')
            const Guild = require('../../models/guild')
            const Economy = require('../../models/economy')
            const Util = require('../../functions/Util')
            const coin = Util.findEmoji('CHPOKI_COIN')
            const { Embeds, noPerms, crossText, checkmarkText, clockText } = require('../../functions/Embed') 
            const { noColor } = require('../../functions/Colours')
            const prefix = bot.server.get(message.guild.id).prefix
            const ms = require('parse-ms')
            const economy = await Economy.findOne({guildID: message.guild.id})
            const crimeSucArray = economy.crime_suc
            const crimeFailArray = economy.crime_fail

            

            if(args[0] == "help" || args[0] == "помощь"){
                const userEmbed = new Embeds({
                    message: message,
                    description: `Позволяет совершить преступление и получить или проиграть деньги\nПерезарядка: **10 часов**`,
                    embedTitle: "CRIME HELP-MENU",
                    embedColor: noColor(),
                    alternatives: `● **\`${prefix}crime\`** | **\`${prefix}криминал\`**`,
                    examples: `● **\`${prefix}crime\`**`,
                })

                const adminEmbed = new Embeds({
                    message: message,
                    description: `Позволяет совершить преступление и получить или проиграть деньги\nПерезарядка: **10 часов**`,
                    embedTitle: "CRIME HELP-MENU [ADMIN]",
                    embedColor: noColor(),
                    arguments: `● **\`${prefix}crime [list/список]\`**\n● **\`${prefix}crime [add/добавить] <+/-> <Сообщение>\`**\n● **\`${prefix}crime [remove/удалить] <+/-> <ID>\`**\n● **\`${prefix}crime [edit/изменить] <+/-> <ID> <Новый текст>\`**`,
                    alternatives: `● **\`${prefix}crime\`** | **\`${prefix}криминал\`**`,
                    examples: `● **\`${prefix}crime\`**\n● **\`${prefix}crime list <+/->\`**\n● **\`${prefix}crime add + Обокрал банк и получил {coin}\`**\n● **\`${prefix}crime remove + 4\`**\n● **\`${prefix}crime edit - 3 Тут измененный текст\`**`,
                    hints: `● **\`+\`** - управление списком при успешном преступлении\n● **\`-\`** - управление списком при неудачном преступлении\n● **\`{coin}\`** в момент использования команды будет заменено на полученную или пройгранную сумму\n● ID можно посмотреть в списках ответов\n● **\`[]\`** - необязательно для заполнения\n● **\`<>\`** - обязательно для заполнения`
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
                        let cooldown = 1000 * 60 * 60 * 10
                        let amount = Math.floor(100 + Math.random() * 400)

                        let sucOrFail = Math.floor(Math.random() * 2)
                        //console.log(sucOrFail)
                        if(dbUser.crime_cd !== null && cooldown - (Date.now() - parseInt(dbUser.crime_cd)) < 0){
                            if(sucOrFail == 0){
                                let randDaily = Math.floor(Math.random() * crimeSucArray.length)
                                let crimeSucText = crimeSucArray.length != 0 ? crimeSucArray[randDaily].replace(/{coin}/g, `**${amount}**${coin}`) : `Стандартное сообщение, если нет добавленных фраз. Успех. +${amount}${coin}`
                                dbUser.currency = parseInt(dbUser.currency) + amount
                                dbUser.total_currency = parseInt(dbUser.bank) + parseInt(dbUser.currency)
                                //dbUser.crime_cd = Date.now()
                                checkmarkText(crimeSucText, message)
                            } else {
                                let randDaily = Math.floor(Math.random() * crimeFailArray.length)
                                let crimeSucText = crimeFailArray.length != 0 ? crimeFailArray[randDaily].replace(/{coin}/g, `**${amount}**${coin}`) : `Стандартное сообщение, если нет добавленных фраз. Неудача. -${amount}${coin}`
                                dbUser.currency = parseInt(dbUser.currency) - amount
                                dbUser.total_currency = parseInt(dbUser.bank) + parseInt(dbUser.currency)
                                //dbUser.crime_cd = Date.now()
                                crossText(crimeSucText, message)
                            }
                            dbUser.save().catch(console.error).then(`${message.member.displayName} использовал crime`)
                        } else {
                            let time = ms(cooldown - (Date.now() - parseInt(dbUser.crime_cd)))
                           return clockText(`Вы не можете совершить преступление еще **${time.hours}ч  ${time.minutes}м ${time.seconds}с**`, message)
                        }
                    }catch(err){
                        console.error(chalk.redBright(err.stack))
                        console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
                    }
                }, timeout)
                
            } else if(args[0] == "list" || args[0] == "список"){
                if(Util.checkPerm(message.member, "ADMINISTRATOR")) return noPerms(message)
                if(args[1] != "+" && args[1] != "-") return crossText(`Укажите список успех или неудач\nПример: **\`${message.content.split(" ")[0].toLowerCase()} list <+/->\`**, где '\`+\`' список при успехе, а '\`-\`' список при неудаче`, message)
                let embed = new Discord.MessageEmbed()
                .setColor(noColor())
                if(args[1] == "+"){
                    if(crimeSucArray.length == 0) return crossText(`Этот список пустует. Выводится стандартное сообщение`, message)
                    i = 1
                    let textArray = Array()
                    crimeSucArray.forEach(element => {
                        textArray.push(`${i}. ${element}`)
                        i++
                    });
                    embed.setTitle(`Список текстов успеха crime`)
                    embed.setDescription(textArray.join('\n'))
                } else if(args[1] == "-"){
                    if(crimeFailArray.length == 0) return crossText(`Этот список пустует. Выводится стандартное сообщение`, message)
                    i = 1
                    let textArray = Array()
                    crimeFailArray.forEach(element => {
                        textArray.push(`${i}. ${element}`)
                        i++
                    });
                    embed.setTitle(`Список текстов неудач crime`)
                    embed.setDescription(textArray.join('\n'))
                }
                return message.channel.send({ embeds: [embed]})
            } else if(args[0] == "add" || args[0] == "добавить"){
                if(Util.checkPerm(message.member, "ADMINISTRATOR")) return noPerms(message)
                if(args[1] != "+" && args[1] != "-") return crossText(`Укажите список успех или неудач\nПример: **\`${message.content.split(" ")[0].toLowerCase()} add <+/-> <Новый текст>\`**, где '\`+\`' список при успехе, а '\`-\`' список при неудаче`, message)
                if(!args[2]) return crossText(`Введите новый текст\nПример: **\`${message.content.split(" ")[0].toLowerCase()} add <+/-> <Новый текст>\`**, где '\`+\`' список при успехе, а '\`-\`' список при неудаче`, message)
                let newText = args.splice(2).join(" ")
                if(args[1] == "+"){
                    checkmarkText(`Текст \`${newText}\` был добавлен в список при успехах crime`, message)
                    crimeSucArray.push(newText)
                    economy.save().catch(console.error())
                } else if(args[1] == "-"){
                    checkmarkText(`Текст \`${newText}\` был добавлен в список при неудачах crime`, message)
                    crimeFailArray.push(newText)
                    economy.save().catch(console.error())
                }
            } else if(args[0] == "remove" || args[0] == "удалить"){
                if(Util.checkPerm(message.member, "ADMINISTRATOR")) return noPerms(message)
                if(args[1] != "+" && args[1] != "-") return crossText(`Укажите список успех или неудач\nПример: **\`${message.content.split(" ")[0].toLowerCase()} delete <+/-> <ID>\`**, где '\`+\`' список при успехе, а '\`-\`' список при неудаче`, message)
                if(!args[1]) return crossText(`Укажите ID\nПример: **\`${message.content.split(" ")[0].toLowerCase()} delete <+/-> <ID>\`**, где '\`+\`' список при успехе, а '\`-\`' список при неудаче`, message)
                if(args[1] == "+" && crimeSucArray[parseInt(args[2]) - 1] == null) return crossText(`Указанный вами ID не найден в списке успеха crime\nПример: **\`${message.content.split(" ")[0].toLowerCase()} delete <+/-> <ID>\`**, где '\`+\`' список при успехе, а '\`-\`' список при неудаче`, message)
                if(args[1] == "-" && crimeFailArray[parseInt(args[2]) - 1] == null) return crossText(`Указанный вами ID не найден в списке неудач crime\nПример: **\`${message.content.split(" ")[0].toLowerCase()} delete <+/-> <ID>\`**, где '\`+\`' список при успехе, а '\`-\`' список при неудаче`, message)
                if(args[1] == "+"){
                    checkmarkText(`Текст \`${crimeSucArray[parseInt(args[2]) - 1]}\` был удален из списка при успехах crime`, message)
                    crimeSucArray.pull(crimeSucArray[parseInt(args[2]) - 1])
                    economy.save().catch(console.error)
                } else if(args[1] == "-"){
                    checkmarkText(`Текст \`${crimeFailArray[parseInt(args[2]) - 1]}\` был удален из списка при неудачах crime`, message)
                    crimeFailArray.pull(crimeFailArray[parseInt(args[2]) - 1])
                    economy.save().catch(console.error)
                }
            } else if(args[0] == "edit" || args[0] == "изменить"){
                if(Util.checkPerm(message.member, "ADMINISTRATOR")) return noPerms(message)
                if(args[1] != "+" && args[1] != "-") return crossText(`Укажите список успех или неудач\nПример: **\`${message.content.split(" ")[0].toLowerCase()} edit <+/-> <ID> <Новый текст>\`**, где '\`+\`' список при успехе, а '\`-\`' список при неудаче`, message)
                if(!args[1]) return crossText(`Укажите ID\nПример: **\`${message.content.split(" ")[0].toLowerCase()} edit <+/-> <ID> <Новый текст>\`**, где '\`+\`' список при успехе, а '\`-\`' список при неудаче`, message)
                if(args[1] == "+" && crimeSucArray[parseInt(args[2]) - 1] == null) return crossText(`Указанный вами ID не найден в списке успеха crime\nПример: **\`${message.content.split(" ")[0].toLowerCase()} edit <+/-> <ID> <Новый текст>\`**, где '\`+\`' список при успехе, а '\`-\`' список при неудаче`, message)
                if(args[1] == "-" && crimeFailArray[parseInt(args[2]) - 1] == null) return crossText(`Указанный вами ID не найден в списке неудач crime\nПример: **\`${message.content.split(" ")[0].toLowerCase()} edit <+/-> <ID> <Новый текст>\`**, где '\`+\`' список при успехе, а '\`-\`' список при неудаче`, message)
                if(!args[3]) return crossText(`Введите новый текст\nПример: **\`${message.content.split(" ")[0].toLowerCase()} edit <+/-> <ID> <Новый текст>\`**, где '\`+\`' список при успехе, а '\`-\`' список при неудаче`, message)
                let newText = args.splice(3).join(" ")
                if(args[1] == "+"){
                    checkmarkText(`Текст \`${crimeSucArray[parseInt(args[2]) - 1]}\` изменен на \`${newText}\``, message)
                    crimeSucArray.set(parseInt(args[2]) - 1, newText)
                    economy.save().catch(console.error)
                } else if(args[1] == "-"){
                    checkmarkText(`Текст \`${crimeFailArray[parseInt(args[2]) - 1]}\` изменен на \`${newText}\``, message)
                    crimeFailArray.set(parseInt(args[2]) - 1, newText)
                    economy.save().catch(console.error)
                }
            } 


        }catch(err){
            console.error(chalk.redBright(err.stack))
            console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
        }
    }  
}

