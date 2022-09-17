const chalk = require('chalk')

module.exports = {
    name: "add-coins",
    description: "Описание команд",
    aliases: ["add-money", "+coins", "+money"],
    run: async (bot, message, args) => {

        try{

            const User = require('../../models/user')
            const Guild = require('../../models/guild')
            const MongoFunc = require('../../functions/MongoFunc') 
            const { Embeds, crossText, noPerms, checkmarkText } = require('../../functions/Embed') 
            const { noColor } = require('../../functions/Colours')
            const Util  = require('../../functions/Util') 
            const server = await Guild.findOne({ guildID: message.guild.id })
            const moderRole = message.guild.roles.cache.find(r => r.id == `915116241071529995` || r.id == `803053033259794482`)
    
            if(Util.checkPerm(message.member, "ADMINISTRATOR") && !(moderRole && message.member.roles.cache.has(moderRole.id))) return noPerms(message)

            if(args[0] == "help" || args[0] == "помощь"){
                const embed = new Embeds({
                    message: message,
                    description: `Добавление койнов юзеру`,
                    embedTitle: "ADD-COINS HELP-MENU",
                    embedColor: noColor(),
                    arguments: `● **\`${server.prefix}add-coins <@user | userID> <Кол-во> [bank]\`**`,
                    alternatives: `● **\`${server.prefix}add-coins\`** | **\`${server.prefix}add-money\`** | **\`${server.prefix}+coins\`** | **\`${server.prefix}+money\`**`,
                    examples: `● **\`${server.prefix}add-coins @user 1000\`**`,
                    hints: `● По умолчанию деньги выдаются на руки, но вы можете указать аргумент **\`bank\`** в конце, чтобы выдать в банк\n● **\`<>\`** - обязательно для заполнения`
                })
    
                return embed.help()
            }

            if(!args[0]) return crossText(`Не указано никаких аргументов\nИспользуйте **\`${message.content.split(" ")[0].toLowerCase()} help\`**, чтобы узнать возможные аргументы`, message)
            let mentuser = args[0] ? message.guild.members.cache.get(args[0].replace('<@', '').replace('>', '')) : null
            if(!mentuser) return crossText(`Не найден пользователь **\`${args[0]}\`**\nПример: **\`${message.content.split(" ")[0].toLowerCase()} <@user | userID> <Кол-во>\`**`, message)
            let check = await User.findOne({userID: mentuser.id,guildID: message.guild.id})
            let timeout = 0
            if(!check || check == null){ 
                if(mentuser.id != message.member.id) MongoFunc.createUser(mentuser.id, message.guild.id)
                timeout = 500
            }
    
            setTimeout(async () => {
                try{
                    let dbUser = await User.findOne({guildID: message.guild.id,userID: message.member.id})
                    let amount = args[1]
                    if(!amount) return crossText (`Не было указано количетсво выдаваемых монет`, message)
                    if((!isFinite(args[1]) || args[1].includes("+") || args[1] % 1 !== 0 || args[1].includes(".")) && parseInt(args[1]) > 0) return crossText(`Указанное значение не является целым положительным числом`, message)
                    if(args[2] && args[2].toLowerCase() == "bank"){
                        dbUser.bank = parseInt(dbUser.bank) + parseInt(amount)
                    } else {
                        dbUser.currency = parseInt(dbUser.currency) + parseInt(amount)
                    }
                    dbUser.save().catch()
                    return checkmarkText(`Пользователю ${mentuser} было выдано **${amount}** монет ${args[2] && args[2].toLowerCase() == "bank" ? `в банк` : `на руки`}`, message)
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