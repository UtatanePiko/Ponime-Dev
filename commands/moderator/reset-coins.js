const chalk = require('chalk')

module.exports = {
    name: "reset-coins",
    description: "Описание команд",
    aliases: ["reset-money"],
    run: async (bot, message, args) => {

        try{

            const User = require('../../models/user')
            const Guild = require('../../models/guild')
            const MongoFunc = require('../../functions/MongoFunc') 
            const { Embeds, crossText, noPerms, checkmarkText } = require('../../functions/Embed') 
            const { noColor } = require('../../functions/Colours')
            const Util  = require('../../functions/Util') 
            const server = await Guild.findOne({ guildID: message.guild.id })
            //const moderRole = message.guild.roles.cache.find(r => r.id == `915116241071529995` || r.id == `803053033259794482`)
    
            if(Util.checkPerm(message.member, "ADMINISTRATOR")) return noPerms(message)

            if(args[0] == "help" || args[0] == "помощь"){
                const embed = new Embeds({
                    message: message,
                    description: `Обнулить баланс пользователя`,
                    embedTitle: "RESET-MONEY HELP-MENU",
                    embedColor: noColor(),
                    arguments: `● **\`${server.prefix}reset-money <@user | userID>\`**`,
                    alternatives: `● **\`${server.prefix}reset-money\`** | **\`${server.prefix}reset-coins\`**`,
                    examples: `● **\`${server.prefix}reset-money @user\`**`,
                    hints: `● **\`<>\`** - обязательно для заполнения`
                })
    
                return embed.help()
            }

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
                        dbUser.currency = 0
                        dbUser.bank = 0
                    dbUser.save().catch()
                    return checkmarkText(`У пользователя ${mentuser} был обнулен баланс`, message)
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