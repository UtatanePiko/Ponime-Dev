const chalk = require('chalk')

module.exports = {
    name: "rob",
    category: "fun",
    description: "Test",
    aliases: ["украсть", "обворовать"],
    run: async (bot, message, args) => {

        try{
          
            const Discord = require('discord.js')
            const User = require('../../models/user')
            const Guild = require('../../models/guild')
            const Economy = require('../../models/economy')
            const Util = require('../../functions/Util')
            const MongoFunc = require('../../functions/MongoFunc')
            const coin = Util.findEmoji('CHPOKI_COIN')
            const { Embeds, crossText, checkmarkText, clockText } = require('../../functions/Embed') 
            const { noColor } = require('../../functions/Colours')
            const prefix = bot.server.get(message.guild.id).prefix
            const ms = require('parse-ms')

            if(message.author.id != "329462919676821504") return

            if(args[0] == "help" || args[0] == "помощь"){
                const embed = new Embeds({
                    message: message,
                    description: `Ограбить другого пользователя(Шанс 50%)\nПерезарядка: **24 часа**`,
                    embedTitle: "ROB HELP-MENU",
                    embedColor: noColor(),
                    arguments: `● **\`${prefix}rob <@user>\`**`,
                    alternatives: `● **\`${prefix}rob\`** | **\`${prefix}украсть\`** | **\`${prefix}обворовать\`**`,
                    examples: `● **\`${prefix}rob @user\`**`,
                    hints: `● **\`<>\`** - обязательно для заполнения`
                })
    
                return embed.help()
            }

            let mentuser = args[0] ? message.guild.members.cache.get(args[0].replace('<@', '').replace('>', '')) : null

            if(mentuser.id == message.member.id) return crossText(`Вы не можете обокрасть самого себя`, message)

            if(mentuser){
                let check = await User.findOne({userID: mentuser.id,guildID: message.guild.id})
                let timeout = 0
                if(!check || check == null){ 
                    if(mentuser.id != message.member.id) MongoFunc.createUser(mentuser.id, message.guild.id)
                    timeout = 500
                }

                setTimeout(async () => {
                    try{
                        let dbUser = await User.findOne({guildID: message.guild.id, userID: message.member.id})
                        let dbMentUser = await User.findOne({guildID: message.guild.id, userID: mentuser.id})
                        let cooldown = 1000 * 60 * 60 * 24

                        let sucOrFail = Math.floor(Math.random() * 10)
    
                        if(dbUser.rob_cd !== null && cooldown - (Date.now() - parseInt(dbUser.rob_cd)) < 0){
                            if(sucOrFail >= 4){
                                amount = Math.floor(parseInt(dbMentUser.currency) / 100 * (50 + Math.random() * 30))
                                //let randDaily = Math.floor(Math.random() * robSucArray.length)
                                robSucText = `Вы украли **${Math.abs(amount)}** ${coin} у **${mentuser.displayName}**`
                                dbUser.currency = parseInt(dbUser.currency) + amount
                                dbMentUser.currency = parseInt(dbMentUser.currency) - amount
                                dbUser.rob_cd = Date.now()
                                checkmarkText(robSucText, message)
                            } else {
                                amount = Math.floor(100 + Math.random() * 400)
                                //let randDaily = Math.floor(Math.random() * robFailArray.length)
                                let robSucText = `Вы попались на краже и потеряли **${Math.abs(amount)}** ${coin}`
                                dbUser.currency = parseInt(dbUser.currency) - amount
                                dbUser.rob_cd = Date.now()
                                crossText(robSucText, message)
                            }
                            dbMentUser.save().catch(console.error)
                            dbUser.save().catch(console.error).then(`${message.member.displayName} использовал rob на ${mentuser.displayName}`)
                        } else {
                            let time = ms(cooldown - (Date.now() - parseInt(dbUser.rob_cd)))
                            return clockText(`Вы не можете никого обокрасть еще **${time.hours}ч  ${time.minutes}м ${time.seconds}с**`, message)
                        }

                    }catch(err){
                        console.error(chalk.redBright(err.stack))
                        console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
                    }

                }, timeout)
            } else {
                return crossText(`Не указан или не найден пользователь!\nПример: **\`${message.content.split(" ")[0].toLowerCase()} <@user | userID>\`**`, message)
            }


        }catch(err){
            console.error(chalk.redBright(err.stack))
            console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
        }
    }  
}

