const chalk = require('chalk')
module.exports = {
    name: "steam",
    description: "Описание команд",
    aliases: ["стим"],
    run: async (bot, message, args) => {

        try{

            const User = require('../../models/user')
            const Guild = require('../../models/guild')
            const { Embeds, crossText, checkmarkText } = require('../../functions/Embed') 
            const { noColor } = require('../../functions/Colours')
            const axios = require('axios')
            const prefix = bot.server.get(message.guild.id).prefix
            if(!(bot.server.get(message.guild.id).leveling_channels).includes(message.channel.id)) return crossText(`Данная команда разрешена лишь в следующих чатах: ${message.guild.channels.cache.find(ch => ch.id == "880530956304392262") || "880530956304392262"} ${message.guild.channels.cache.find(ch => ch.id == "841889007654141982") || "841889007654141982"}`, message)
    
            let checkmark = await bot.guilds.cache.get('914124553960194059').emojis.cache.find(e => e.name == "checkmark4")
            let cross = await bot.guilds.cache.get('914124553960194059').emojis.cache.find(e => e.name == "cross4")
          
            if(args[0] == "help" || args[0] == "помощь"){
                const embed = new Embeds({
                    message: message,
                    description: `Позволяет установить ссылку на свой стим в информации о себе`,
                    embedTitle: "STEAM HELP-MENU",
                    embedColor: noColor(),
                    arguments: `● **\`${prefix}steam <Ссылка>\`**`,
                    alternatives: `● **\`${prefix}steam\`** | **\`${prefix}стим\`**`,
                    examples: `● **\`${prefix}steam https://steamcommunity.com/id/Здесь будет ваш id/\`**`,
                    hints: `● Чтобы удалить ссылку с профиля, введите команду без ссылки\n● Альтернативы используются для сокращения написания команды и ничем не отличаются\n● **\`<>\`** - обязательно для заполнения`
                })
          
                return embed.help()
            }

            let dbUser = await User.findOne({guildID: message.guild.id, userID: message.author.id})
            if(!args[0]){
                dbUser.steam = ""
                dbUser.save().catch()
                return checkmarkText(`Ссылка успешно была удалена с вашей информации о себе`, message)
            }

            let link = args[0]
            if(!link.includes(`https://steamcommunity.com/id/`) && !link.includes(`https://steamcommunity.com/profiles/`)) return crossText(`Введенная вами ссылка не является ссылкой на стим профиль`, message)

            let response, data;
            try {
                response = await axios.get(link);
                data = response.data;
            } catch (e) {
                console.log(e)
                return message.channel.send({content: `An error occured!`})
            }
    
            if(!data.includes(`Level`)) return crossText(`Не удалось найти профиль с данной ссылкой`, message)

            dbUser.steam = link
            await dbUser.save().catch()
            return checkmarkText(`Ваша ссылка на стим профиль была успешна изменена`, message)

        }catch(err){
            console.error(chalk.redBright(err.stack))
            console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
        }
    }
}
  