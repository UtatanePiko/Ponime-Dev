const chalk = require('chalk')
module.exports = {
    name: "age",
    description: "Описание команд",
    aliases: ["возраст"],
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
                    description: `Позволяет установить возраст в информации о себе`,
                    embedTitle: "AGE HELP-MENU",
                    embedColor: noColor(),
                    arguments: `● **\`${prefix}age <Возраст>\`**`,
                    alternatives: `● **\`${prefix}age\`** | **\`${prefix}возраст\`**`,
                    examples: `● **\`${prefix}age 18\`**`,
                    hints: `● Возраст должен быть целым натуральным числом не меньше 1 и больше 100\n● Альтернативы используются для сокращения написания команды и ничем не отличаются\n● **\`<>\`** - обязательно для заполнения`
                })
          
                return embed.help()
            }

            if(!args[0]){
                await message.delete()
                let embed = new Discord.MessageEmbed()
                .setDescription(`${cross} Вы не указали возраст!\nПример: **\`${message.content.split(" ")[0].toLowerCase()} 17\`**`)
                .setColor("#922a37")

                return message.reply({embeds: [embed]})
// .then(msg => {setTimeout(() => {msg.delete()}, 10000)})
            }
  
            User.findOne({
              guildID: message.guild.id,
              userID: message.author.id
            }, (err, user) => {
              if(err) console.error(err)

              if(!isFinite(args[0]) || args[0].includes("+") || parseInt(args[0]) % 1 !== 0 || args[0].includes(".")){
                  let wrongEmbed = new Discord.MessageEmbed()
                  .setColor("#8f0000")
                  .setDescription(`${cross} Можно указать лишь положительное целое число`)
                  return message.reply({embeds: [wrongEmbed] })
              }

              if(parseInt(args[0]) < 1 || parseInt(args[0]) > 99){
                let wrongEmbed = new Discord.MessageEmbed()
                .setColor("#8f0000")
                .setDescription(`${cross} Возраст может быть лишь в диапазоне от 1 до 100`)
                return message.reply({embeds: [wrongEmbed] })
              }

              user.age = args[0]

              let embed = new Discord.MessageEmbed()
              .setColor("#43d490")
              //.setThumbnail('https://i.imgur.com/Nwi19rd.png')
              .setDescription(`${checkmark} Ваш возраст в профиле был успешно изменен на \`${args[0]}\``)
              message.reply({embeds: [embed] })
              user.save()
              .catch(err)
              .then(`${message.member.displayName} установил возраст в профиле на ${args[0]}`)
            })

        } catch(err){
            console.error(err)
        }
    }
}
  