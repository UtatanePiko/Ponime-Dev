const chalk = require('chalk')

module.exports = {
    name: "deposit",
    description: "Описание команд",
    aliases: ["dep", "положить", "депосит"],
    run: async (bot, message, args) => {
        try{
            
            const User = require('../../models/user')
            const Guild = require('../../models/guild')
            const Util = require('../../functions/Util')
            const coin = Util.findEmoji('CHPOKI_COIN')
            const { Embeds, crossText, checkmarkText } = require('../../functions/Embed') 
            const { noColor } = require('../../functions/Colours')
            const prefix = bot.server.get(message.guild.id).prefix

            if(message.author.id != "329462919676821504") return

            if(args[0] == "help" || args[0] == "помощь"){
                const embed = new Embeds({
                    message: message,
                    description: `Снять монеты со своего банка`,
                    embedTitle: "DEPOSIT HELP-MENU",
                    embedColor: noColor(),
                    arguments: `● **\`${prefix}withdraw <Кол-во>\`**`,
                    alternatives: `● **\`${prefix}deposit\`** | **\`${prefix}dep\`** | **\`${prefix}положить\`** | **\`${prefix}депосит\`**`,
                    examples: `● **\`${prefix}with 1000\`**`,
                    hints: `● **\`<>\`** - обязательно для заполнения`
                })
    
                return embed.help()
            }

            let check = await User.findOne({userID: message.member.id,guildID: message.guild.id})
            let timeout = 0
            if(!check || check == null) timeout = 500

            setTimeout(async() => {
                try{
                    const dbuser = await User.findOne({userID: message.member.id,guildID: message.guild.id})
                    var amount = 0
        
                    if(!args[0]) return crossText(`Вы не указали сумму\nПример: **\`${message.content.split(" ")[0].toLowerCase()} <Число | all/все | half/половина>\`**`, message)
                    if(args[0].toLowerCase() != "all" || args[0].toLowerCase() != "half" || args[0].toLowerCase() != "всё" || args[0].toLowerCase() != "все" || args[0].toLowerCase() != "половина" || args[0].toLowerCase() != "половину") amount = args[0]
                    if(args[0].toLowerCase() == 'all' || args[0].toLowerCase() == 'всё' || args[0].toLowerCase() == 'все') amount = parseInt(dbuser.currency)
                    if(args[0].toLowerCase() == 'half' || args[0].toLowerCase() == 'половина' || args[0].toLowerCase() == 'половину') amount = Math.floor(parseInt(dbuser.currency) / 2)
                    if(!isFinite(amount) || parseInt(amount) % 1 != 0 || args[0].includes(".") || args[0].includes("+")) return crossText(`Вкладываемая сумма должна быть целым числом\nПример: **\`${message.content.split(" ")[0].toLowerCase()} 1000\`**`, message)
                    if(amount > parseInt(dbuser.currency)) return crossText(`Вы не можете внести больше, чем у вас имеется на руках`, message)
                    if(amount <= 0) return crossText(`Вы не можете внести сумму 0 или меньше`, message)
                    checkmarkText(`Вы успешно внесли в банк **${amount}**${coin}`, message)
                    dbuser.bank = parseInt(dbuser.bank) + parseInt(amount)
                    dbuser.currency = parseInt(dbuser.currency) - parseInt(amount)
                    dbuser.total_currency = parseInt(dbuser.bank) + parseInt(dbuser.currency)
                    dbuser.save().catch(console.error)
                }catch(err){
                    console.error(chalk.redBright(err.stack))
                    console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
                }
            }, timeout)
        }catch(err){
            console.error(chalk.redBright(err.stack))
            console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
        }
    }
}
