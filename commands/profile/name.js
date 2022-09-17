module.exports = {
    name: "name",
    description: "Описание команд",
    aliases: ["имя"],
    run: async (bot, message, args) => {

        try{

            const User = require('../../models/user')
            const Guild = require('../../models/guild')
            const { Embeds, crossText, checkmarkText } = require('../../functions/Embed') 
            const { noColor } = require('../../functions/Colours')
            const Discord = require('discord.js')
            const MongoFunc = require('../../functions/MongoFunc')
            const prefix = bot.server.get(message.guild.id).prefix
            if(!(bot.server.get(message.guild.id).leveling_channels).includes(message.channel.id)) return crossText(`Данная команда разрешена лишь в следующих чатах: ${message.guild.channels.cache.find(ch => ch.id == "880530956304392262") || "880530956304392262"} ${message.guild.channels.cache.find(ch => ch.id == "841889007654141982") || "841889007654141982"}`, message)
    
            let checkmark = await bot.guilds.cache.get('914124553960194059').emojis.cache.find(e => e.name == "checkmark4")
            let cross = await bot.guilds.cache.get('914124553960194059').emojis.cache.find(e => e.name == "cross4")
          
          if(args[0] == "help" || args[0] == "помощь"){
            const embed = new Embeds({
                message: message,
                description: `Позволяет установить имя в информации о себе`,
                embedTitle: "NAME HELP-MENU",
                embedColor: noColor(),
                arguments: `● **\`${prefix}name <Имя>\`**`,
                alternatives: `● **\`${prefix}name\`** | **\`${prefix}имя\`**`,
                examples: `● **\`${prefix}name Женя\`**`,
                hints: `● Имя должно содержать лишь русские буквы, не содержать пробелов и не быть длиннее 12 символов\n● Альтернативы используются для сокращения написания команды и ничем не отличаются\n● **\`<>\`** - обязательно для заполнения`
            })
      
            return embed.help()
        }

        let name = args[0]

            if(!args[0]) return crossText(`Вы не указали имя!\nПример: **\`${message.content.split(" ")[0].toLowerCase()} <Имя>\`**`, message)
            let dbUser = await User.findOne({guildID: message.guild.id, userID: message.author.id})
            if(args[0].length > 12 || args[1]) return crossText(`Имя не должно быть больше 12 символов или содержать пробелов`, message)
            if(!/^[а-яА-ЯёЁ]+$/.test(name) && !/^[a-zA-Z]+$/.test(name)) return crossText(`Имя не должно содержать никаких символов`, message)
            dbUser.name = args[0]
            dbUser.save().catch()
            checkmarkText(`Ваше имя в профиле успешно было изменено на **\`${args[0]}\`**`, message)

        } catch(err){
            console.error(err)
        }
    }
}
  