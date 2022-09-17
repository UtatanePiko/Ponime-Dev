const chalk = require('chalk')

module.exports = {
    name: "bully",
    description: "Описание команд",
    run: async (bot, message, args) => {
        try{
            
            const Discord = require('discord.js')
            const { crossText } = require('../../functions/Embed')
            const Colours = require('../../functions/Colours')
            const axios = require('axios')
            const url = 'https://api.waifu.pics/sfw/bully'
            
            if(!(bot.server.get(message.guild.id).actions_channels).includes(message.channel.id)) return crossText(`Данная команда разрешена лишь в следующих чатах: ${message.guild.channels.cache.find(ch => ch.id == "839971355767865394") || "839971355767865394"} ${message.guild.channels.cache.find(ch => ch.id == "880530956304392262") || "880530956304392262"} ${message.guild.channels.cache.find(ch => ch.id == "841889007654141982") || "841889007654141982"}`, message)
            
            var msg = ''
            
            let target = args[0] ? message.guild.members.cache.get(args[0].replace('<@', '').replace('>', '')) ? message.guild.members.cache.get(args[0].replace('<@', '').replace('>', '')) : message.mentions.members.first() : null
            if(!target || target.id == message.member.id){
                msg = `${message.member} **забулил(а) себя**`
                let text = !target ? args.splice(0).join(" ") : args.splice(1).join(" ")
                if(text) msg = `${msg}\nПотому что **${text}**`
            } else {
                msg = `${message.member} **забулил(а)** ${target}`
                let text = args.splice(1).join(" ")
                if(text) msg = `${msg}\nПотому что **${text}**`
            }
            //if(target.id == message.member.id) return message.channel.send({content: `${message.author}`, embeds: [Embed.crossText(`Вы не можете взаимодействовать сами с собой`)]})

            let response, data;
            try {
                response = await axios.get(url);
                data = response.data;
            } catch (e) {
                return message.channel.send({content: `An error occured!`})
            }
    
            const embed = new Discord.MessageEmbed()
                .setDescription(msg)
                .setColor(Colours.noColor())
                .setImage(data.url)
                
    
            await message.reply({ embeds: [embed] })
        }catch(err){
            console.error(chalk.redBright(err.stack))
            console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
        }
    }
}
