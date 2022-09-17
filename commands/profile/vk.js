const chalk = require('chalk')
module.exports = {
    name: "vk",
    description: "Описание команд",
    aliases: ["vk", "вк"],
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
                    description: `Позволяет установить ссылку на свой вк в информации о себе`,
                    embedTitle: "VK HELP-MENU",
                    embedColor: noColor(),
                    arguments: `● **\`${prefix}vk <Ссылка>\`**`,
                    alternatives: `● **\`${prefix}vk\`** | **\`${prefix}вк\`**`,
                    examples: `● **\`${prefix}vk https://vk.com/Здесь будет ваш id/\`**`,
                    hints: `● Чтобы удалить ссылку с профиля, введите команду без ссылки\n● Альтернативы используются для сокращения написания команды и ничем не отличаются\n● **\`<>\`** - обязательно для заполнения`
                })
          
                return embed.help()
            }

            let dbUser = await User.findOne({guildID: message.guild.id, userID: message.author.id})
            if(!args[0]){
                dbUser.vk = ""
                dbUser.save().catch()
                return checkmarkText(`Ссылка успешно была удалена с вашей информации о себе`, message)
            }

            let link = args[0]
            if(!link.includes(`https://vk.com/`)) return crossText(`Введенная вами ссылка не является ссылкой на вк профиль`, message)

            var id = args[0].replace(`https://vk.com/`, "")
            const url = `https://api.vk.com/method/users.get?user_ids=${id}&fields=bdate&access_token=7e70399b7e70399b7e70399b337e0c790277e707e70399b1c2f924e90e499046090afe3&v=5.131`
    
            let response, data;
            try {
                response = await axios.get(url);
                data = response.data;
            } catch (e) {
                return message.channel.send({content: `An error occured!`})
            }
    
            if(!data.response[0]) return crossText (`Не удалось найти профиль с данной ссылкой`, message)

            dbUser.vk = link
            await dbUser.save().catch()
            return checkmarkText(`Ваша ссылка на вк профиль была успешна изменена`, message)

        }catch(err){
            console.error(chalk.redBright(err.stack))
            console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
        }
    }
}
  