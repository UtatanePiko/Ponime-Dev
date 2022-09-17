const chalk = require('chalk')

module.exports = {
    name: "boost",
    description: "Описание команд",
    aliases: ["буст"],
    run: async (bot, message, args) => {

        try{

            const Discord = require('discord.js')
            const Guild = require('../../models/guild')
            const { Embeds, crossText, checkmarkText, noPerms } = require('../../functions/Embed') 
            const { noColor } = require('../../functions/Colours')
            const Util  = require('../../functions/Util') 
            const server = await Guild.findOne({ guildID: message.guild.id })

            if(Util.checkPerm(message.member, "ADMINISTRATOR")) return noPerms(message)

            if(args[0] == "help" || args[0] == "помощь"){
                const embed = new Embeds({
                    message: message,
                    description: `Управление сообщениями о бусте сервера`,
                    embedTitle: "BOOST HELP-MENU",
                    embedColor: noColor(),
                    arguments: `● **\`${server.prefix}boost <message/сообщение> <Сообщение о бусте>\`**\n● **\`${server.prefix}boost <channel/канал> <ID>\`**`,
                    alternatives: `● **\`${server.prefix}boost\`** | **\`${server.prefix}буст\`**`,
                    examples: `● **\`${server.prefix}boost message {user} дал буст этому серверу\`**\n● **\`${server.prefix}boost channel 749517648567468107\`**\n● **\`${server.prefix}boost preview\`**`,
                    hints: `● **\`{user}\`** в message при бусте будет заменено на ник игрока, кто бустит\n● **\`<>\`** - обязательно для заполнения`
                })
    
                return embed.help()
            }

            if(!args[0]) return crossText(`Не указано никаких аргументов\nИспользуйте **\`${message.content.split(" ")[0].toLowerCase()} help\`**, чтобы узнать возможные аргументы`, message)
            if(args[0] != "channel" && args[0] != "message" && args[0] != "preview" && args[0] != "msg" && args[0] != "ch" && args[0] != "канал" && args[0] != "сообщение" && args[0] != "превью") return crossText(`Не найдено указанных аргументов\nИспользуйте **\`${server.prefix}boost help\`**, чтобы узнать возможные аргументы`, message)
            if(args[0] == "channel" || args[0] == "ch" || args[0] == "канал"){
                if(!args[1]) return crossText(`Укажите ID Канала\nПример: **\`${message.content.split(" ")[0].toLowerCase()} channel 914124554518011986\`**`, message)
                let chan = message.mentions.channels.first() || message.guild.channels.cache.find(ch => ch.id == args[1])
                if(!chan) return crossText(`Указанный вами ID канала не был найден`, message)
                server.boost_channel = chan.id
                server.save().catch(err => {console.error(err)})
                return checkmarkText(`Канал бустов был успешно изменен на **\`${chan.name}\`**`, message)
            } else if(args[0] == "message" || args[0] == "msg" || args[0] == "сообщение"){
                if(!args[1]) return crossText(`Введите сообщение\nПример: **\`${message.content.split(" ")[0].toLowerCase()} message Спасибо {user} за буст!\`**`, message)
                let msg = args.splice(1).join(" ")
                server.boost_message = msg
                server.save().catch(err => {console.error(err)})
                return checkmarkText(`Сообщения за буст было успешно установлено на **\`${msg}\`**`, message)
            } else if(args[0] == "preview" || args[0] == "превью"){
                let msg = server.boost_message
                return message.channel.send({content: `${msg.replace(/{user}/g, `${message.author}`)}`})
            }

        }catch(err){
            console.error(chalk.redBright(err.stack))
            console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
        }
    }
}