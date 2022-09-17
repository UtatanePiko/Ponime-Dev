const chalk = require('chalk')

module.exports = {
    name: "avatar",
    description: "Описание команд",
    aliases: ['аватар', 'ава', 'ava'],
    run: async (bot, message, args) => {

        try{

            const Discord = require('discord.js')
            const { Embeds, crossText } = require('../../functions/Embed') 
            const { noColor } = require('../../functions/Colours')
            const prefix = bot.server.get(message.guild.id).prefix

            if(args[0] == "help" || args[0] == "помощь"){
                const embed = new Embeds({
                    message: message,
                    description: `Запросить аватар пользователя`,
                    embedTitle: "AVATAR HELP-MENU",
                    embedColor: noColor(),
                    arguments: `● **\`${prefix}avatar [@user | userID]\`**`,
                    alternatives: `● **\`${prefix}avatar\`** | **\`${prefix}ava\`** | **\`${prefix}аватар\`** | **\`${prefix}ава\`**`,
                    examples: `● **\`${prefix}avatar\`** или **\`${prefix}avatar @user\`**`,
                    hints: `● **\`[]\`** - необязательно для заполнения`
                })
                return embed.help()
            }
    
            mentuser = args[0] ? message.guild.members.cache.get(args[0].replace('<@', '').replace('>', '')) : null
            if(args[0] && !mentuser) return crossText(`Указанный пользователь **${args[0]}** не был найден`, message)
            if(!args[0]) mentuser = message.member
    
            let embed = new Discord.MessageEmbed()
            .setTitle(`Аватар пользователя ${mentuser.displayName}`)
            .setColor(noColor())
            .setImage(mentuser.user.displayAvatarURL({size: 4096, format: "png", dynamic: true}))
            return message.reply({embeds: [embed]})

        }catch(err){
            console.error(chalk.redBright(err.stack))
            console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
        }
    }
}
