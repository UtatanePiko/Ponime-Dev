const chalk = require('chalk')
module.exports = {
    name: "instagram",
    description: "Описание команд",
    aliases: ["инстаграм", "inst", "инст", "инста", "insta"],
    run: async (bot, message, args) => {

        try{

            const User = require('../../models/user')
            const Guild = require('../../models/guild')
            const { Embeds, crossText, checkmarkText } = require('../../functions/Embed') 
            const { noColor } = require('../../functions/Colours')
            const axios = require('axios')
            const prefix = bot.server.get(message.guild.id).prefix
            if(!(bot.server.get(message.guild.id).leveling_channels).includes(message.channel.id)) return crossText(`Данная команда разрешена лишь в следующих чатах: ${message.guild.channels.cache.find(ch => ch.id == "880530956304392262") || "880530956304392262"} ${message.guild.channels.cache.find(ch => ch.id == "841889007654141982") || "841889007654141982"}`, message)
    
            if(args[0] == "help" || args[0] == "помощь"){
                const embed = new Embeds({
                    message: message,
                    description: `Позволяет установить ссылку на свой инстаграм в информацию о себе`,
                    embedTitle: "INSTAGRAM HELP-MENU",
                    embedColor: noColor(),
                    arguments: `● **\`${prefix}instagram <Ссылка>\`**`,
                    alternatives: `● **\`${prefix}instagram\`** | **\`${prefix}inst\`** | **\`${prefix}insta\`** | **\`${prefix}инст\`**| **\`${prefix}инста\`**`,
                    examples: `● **\`${prefix}inst https://www.instagram.com/Здесь будет ваш id/\`**`,
                    hints: `● Чтобы удалить ссылку с профиля, введите команду без ссылки\n● Альтернативы используются для сокращения написания команды и ничем не отличаются\n● **\`<>\`** - обязательно для заполнения`
                })
          
                return embed.help()
            }

            let dbUser = await User.findOne({guildID: message.guild.id, userID: message.author.id})
            if(!args[0]){
                dbUser.inst = ""
                dbUser.save().catch()
                return checkmarkText(`Ссылка успешно была удалена с вашей информации о себе`, message)
            }

            //let role = message.guild.roles.cache.find(r => r.id == "802518371517726730" || r.id == "914841996823261194")
            //if(!message.member.roles.cache.has(role.id)) return crossText(`У вас нет роли ${role} для установления своего инстаграма`, message)

            let link = args[0]
            if(!link.includes(`https://www.instagram.com/`) && !link.includes(`https://instagram.com/`)) return crossText(`Введенная вами ссылка не является ссылкой на инстаграм профиль`, message)

            dbUser.inst = link
            await dbUser.save().catch()
            return checkmarkText(`Ваша ссылка на инстаграм профиль была успешна изменена`, message)

        }catch(err){
            console.error(chalk.redBright(err.stack))
            console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
        }
    }
}
  