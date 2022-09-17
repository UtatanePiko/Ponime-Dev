const chalk = require('chalk')

module.exports = {
    name: "set",
    description: "Описание команд",
    run: async (bot, message, args) => {

        try{

            const User = require('../../models/user')
            const Guild = require('../../models/guild')
            const MongoFunc = require('../../functions/MongoFunc') 
            const { Embeds, crossText, noPerms, checkmarkText } = require('../../functions/Embed') 
            const { noColor } = require('../../functions/Colours')
            const Util  = require('../../functions/Util') 
            const server = await Guild.findOne({ guildID: message.guild.id })
    
            if(Util.checkPerm(message.member, "ADMINISTRATOR")) return noPerms(message)

            if(args[0] == "help" || args[0] == "помощь"){
                const embed = new Embeds({
                    message: message,
                    description: `Установка значений в базе данных`,
                    embedTitle: "SET HELP-MENU",
                    embedColor: noColor(),
                    arguments: `● **\`${server.prefix}set <@user | userID> coins <Кол-во>\`**`,
                    alternatives: `● Отсутствуют`,
                    examples: `● **\`${server.prefix}set @user coins 1000\`**`,
                    hints: `● **\`<>\`** - обязательно для заполнения`
                })
    
                return embed.help()
            }

            if(!args[0]) return crossText(`Не указано никаких аргументов\nИспользуйте **\`${message.content.split(" ")[0].toLowerCase()} help\`**, чтобы узнать возможные аргументы`, message)
            let mentuser = mentuser = args[0] ? message.guild.members.cache.get(args[0].replace('<@', '').replace('>', '')) : null
            if(!mentuser) return crossText(`Не найден пользователь **\`${args[0]}\`**\nПример: **\`${message.content.split(" ")[0].toLowerCase()} <@user | userID> <coins> <Кол-во>\`**`, message)
            let check = await User.findOne({userID: mentuser.id,guildID: message.guild.id})
            let timeout = 0
            if(!check || check == null){ 
                if(mentuser.id != message.member.id) MongoFunc.createUser(mentuser.id, message.guild.id)
                timeout = 500
            }
    
            setTimeout(async () => {
                try{
                    let dbUser = await User.findOne({guildID: message.guild.id,userID: message.member.id})
                    if(!args[1]) return crossText(`Не указан изменямый параметр\nПример: **\`${message.content.split(" ")[0].toLowerCase()} <@user | userID> <coins> <Кол-во>\`**\nИспользуйте **\`${message.content.split(" ")[0].toLowerCase()} help\`**, чтобы узнать возможные параметры`, message)
                    if(args[1] != "coins") return crossText(`Не найден изменямый параметр\nПример: **\`${message.content.split(" ")[0].toLowerCase()} <@user | userID> <coins> <Кол-во>\`**\nИспользуйте **\`${message.content.split(" ")[0].toLowerCase()} help\`**, чтобы узнать возможные параметры`, message)
                    // if(args[1] == "xp"){
                    //     if(!args[2]) return message.channel.send({content: `${message.author}`, embeds: [Embed.crossText(`Вы не указали количество\nПример: **\`${server.prefix}set <@user | userID> xp 1000\`**`)]})
                    //     if(args[2] % 1 != 0) return message.channel.send({content: `${message.author}`, embeds: [Embed.crossText(`Указанное количество должно быть целым числом`)]})
                    //     if(args[2] <= 0) return message.channel.send({content: `${message.author}`, embeds: [Embed.crossText(`Указанное количество не может быть меньше или равно 0`)]})
                    //     if(args[2] > 2147483647) return message.channel.send({content: `${message.author}`, embeds: [Embed.crossText(`Указанное количество не может быть больше 2147483647`)]})
                    //     dbUser.xp = parseInt(args[2])
                    //     dbUser.
                    //     await dbUser.save().catch(err)
                    //     return message.channel.send({content: `${message.author}`, embeds: [Embed.checkmarkText(`Опыт пользователя ${mentuser} был установлен на **${args[2]}**`)]})
                    // } else
                    if(args[1] == "coins"){
                        if(!args[2]) return crossText(`Вы не указали количество\nПример: **\`${message.content.split(" ")[0].toLowerCase()} <@user | userID> coins 1000\`**`, message)
                        if(parseInt(args[2]) % 1 != 0 || !isFinite(args[2])) return crossText(`Указанное количество должно быть целым числом`, message)
                        //if(parseInt(args[2]) <= 0) return crossText(`Указанное количество не может быть меньше или равно 0`, message)
                        dbUser.currency = 0
                        dbUser.bank = args[2]
                        dbUser.total_currency = parseInt(dbUser.bank) + parseInt(dbUser.currency)
                        await dbUser.save().catch(err => {console.error(err)})
                        return checkmarkText(`Монеты пользователя ${mentuser} были установлены на **${args[2]}**`, message)
                    }
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