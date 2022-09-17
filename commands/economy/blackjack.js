const chalk = require('chalk')

module.exports = {
    name: "blackjack",
    category: "fun",
    description: "Test",
    aliases: ["bj", "блэкджек"],
    run: async (bot, message, args) => {

        try{
          
            const Discord = require('discord.js')
            const User = require('../../models/user')
            const Guild = require('../../models/guild')
            const Economy = require('../../models/economy')
            const Util = require('../../functions/Util')
            const coin = Util.findEmoji('CHPOKI_COIN')
            const { Embeds, crossText, checkmarkText, noPerms } = require('../../functions/Embed') 
            const { noColor } = require('../../functions/Colours')
            const prefix = bot.server.get(message.guild.id).prefix
            const blackjack = require('../../functions/Blackjack')
            
            if(message.author.id != "329462919676821504") return

            if(args[0] == "help" || args[0] == "помощь"){
                const userEmbed = new Embeds({
                    message: message,
                    description: `Блэкджэк`,
                    embedTitle: "BLACKJACK HELP-MENU",
                    embedColor: noColor(),
                    alternatives: `● **\`${prefix}blackjack\`** | **\`${prefix}bj\`** | **\`${prefix}блэкджек\`**`,
                    examples: `● **\`${prefix}work\`**`,
                })

                return userEmbed.help()
            }

            let dbUser = await User.findOne({guildID: message.guild.id, userID: message.member.id})
            let amount = args[0]
            if(!amount) return crossText (`Не было указано количетсво забираемых монет`, message)
            if(args[0].toLowerCase() == "all" || args[0].toLowerCase() == "все") amount = dbUser.currency
            if((!isFinite(args[0]) || args[0].includes("+") || args[0] % 1 !== 0 || args[0].includes(".")) && parseInt(args[0]) > 0) return crossText(`Указанное значение не является целым положительным числом`, message)        
            if(amount > dbUser.currency) return crossText (`Вы не можете поставить больше, чем у вас есть на руках\nВаш баланс на руках: **\`${dbUser.currency}\`**`, message)

            let bj = await blackjack(message, args, amount)
            
            if(bj.result == "WIN") dbUser.currency = parseInt(dbUser.currency) + parseInt(amount)
            if(bj.result == "LOSE") dbUser.currency = parseInt(dbUser.currency) - parseInt(amount)
            dbUser.total_currency = parseInt(dbUser.currency) + parseInt(dbUser.bank)
            dbUser.save().catch()
        

        }catch(err){
            console.error(chalk.redBright(err.stack))
            console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
        }
    }  
}

