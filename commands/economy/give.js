const chalk = require('chalk')

module.exports = {
    name: "give",
    description: "Описание команд",
    aliases: ["дать", "передать", "перевести"],
    run: async (bot, message, args) => {
        try{
            
            const Discord = require('discord.js')
            const User = require('../../models/user')
            const Guild = require('../../models/guild')
            const MongoFunc = require('../../functions/MongoFunc')
            const Util = require('../../functions/Util')
            const coin = Util.findEmoji('CHPOKI_COIN')
            const checkmark = Util.findEmoji('checkmark4')
            const { Embeds, crossText, checkmarkText } = require('../../functions/Embed') 
            const { noColor, successColor } = require('../../functions/Colours')
            const prefix = bot.server.get(message.guild.id).prefix

            if(message.author.id != "329462919676821504") return

            if(args[0] == "help" || args[0] == "помощь"){
                const embed = new Embeds({
                    message: message,
                    description: `Передать пользователю валюту`,
                    embedTitle: "GIVE HELP-MENU",
                    embedColor: noColor(),
                    arguments: `● **\`${prefix}give <@user | userID> <Сумма | all>\`**`,
                    alternatives: `● **\`${prefix}give\`** | **\`${prefix}дать\`** | **\`${prefix}передать\`** | **\`${prefix}перевести\`**`,
                    examples: `● **\`${prefix}user @user 5000\`**\n● **\`${prefix}user @user all\`**`,
                    hints: `● **\`<>\`** - обязательно для заполнения`
                })
    
                return embed.help()
            }

            let mentuser = message.member
            if(args[0]) mentuser = args[0] ? message.guild.members.cache.get(args[0].replace('<@', '').replace('>', '')) : null
            if(!mentuser) return crossText(`Не найден указанный пользователь!\nПример: **\`${message.content.split(" ")[0].toLowerCase()} [@user | userID]\`**`, message)
// .then(msg => { message.delete(); setTimeout(() => {msg.delete()}, 10000)})
            if(mentuser.id != message.member.id) MongoFunc.createUser(mentuser.id, message.guild.id)
            let check = await User.findOne({userID: mentuser.id,guildID: message.guild.id})
            let timeout = 0
            if(!check || check == null) timeout = 500

            setTimeout(async() => {
                async function getDbUser(uid){
                    let user = await User.findOne({userID: uid, guildID: message.guild.id})
                    return user
                }
                async function parallelGet(){
                    return await Promise.all([
                        getDbUser(message.member.id),
                        getDbUser(mentuser.id)
                    ])
                }
                let result = await parallelGet()
                let fromUser = result[0]
                let toUser = result[1]

                if(mentuser.id == message.member.id) return crossText(`Вы не можете передать койны самому себе`, message)
                if(!args[1]) return crossText(`Не было введено суммы для перевода`, message)
                let summa = args[1]
                if((summa % 1 != 0 || summa.includes('.') || summa.includes('+') || summa <= 0) && summa.toLowerCase() != 'all') return crossText(`Передаваемая сумма должна быть целым положительным числом или аргументом \`all\``, message)
                summa = args[1].toLowerCase() == 'all' ? fromUser.currency : parseInt(args[1])
                if(summa > fromUser.currency) return crossText(`У вас недостаточно койнов на руках\nБаланс на руках: **${fromUser.currency}** ${coin}`, message)
                fromUser.currency -= summa
                toUser.currency += summa
                Promise.all([fromUser.save(), toUser.save()])

                let successEmbed = new Discord.MessageEmbed().setColor(successColor())
                .setAuthor({
                    name: `${message.author.username}#${message.author.discriminator}`,
                    iconURL: message.member.displayAvatarURL({size: 512, format: 'png', dynamic: true})
                })
                .setDescription(`${checkmark} Вы успешно передали ${summa} ${coin} ${mentuser}`)

                return message.reply({embeds: [successEmbed]})

                
            }, timeout)
        }catch(err){
            console.error(chalk.redBright(err.stack))
            console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
        }
    }
}
