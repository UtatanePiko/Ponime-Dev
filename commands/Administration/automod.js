const chalk = require('chalk')

module.exports = {
    name: "automod",
    description: "Описание команд",
    aliases: ["автомод"],
    run: async (bot, message, args) => {

        try{

            const Discord = require('discord.js')
            const User = require('../../models/user')
            const Guild = require('../../models/guild')
            const MongoFunc = require('../../functions/MongoFunc') 
            const { Embeds, crossText, noPerms, checkmarkText } = require('../../functions/Embed') 
            const { noColor } = require('../../functions/Colours')
            const Util  = require('../../functions/Util') 
            const server = await Guild.findOne({ guildID: message.guild.id })
            const ms = require('ms')
    
            if(Util.checkPerm(message.member, "ADMINISTRATOR")) return noPerms(message)

            if(args[0] == "help" || args[0] == "помощь"){
                const embed = new Embeds({
                    message: message,
                    description: `Настройка авто-модерации на сервере`,
                    embedTitle: "AUTO-MODERATION HELP-MENU",
                    embedColor: noColor(),
                    arguments: `● **\`${server.prefix}automod [block | unblock | list]\`**`,
                    alternatives: `● **\`automod\`** | **\`автомод\`**`,
                    examples: `● **\`${server.prefix}automod\`**\n● **\`${server.prefix}automod block #channel\`** \n● **\`${server.prefix}automod list\`**`,
                    hints: `● **\`[]\`** - необязательно для заполнения`
                })
    
                return embed.help()
            }

            if(args[0]){
                let blockedList = server.blocked_channels
                if(args[0] == "block"){
                    let chan = message.mentions.channels.first() || message.guild.channels.cache.find(ch => ch.id === args[1])
                    if(!chan) return crossText(`Не было указано никакого канала`, message)
                    if(!blockedList.includes(chan.id)){
                        await blockedList.push(chan.id)
                        await server.save().catch()
                        return checkmarkText(`Канал ${chan} был успешно добавлен в исключения авто-модерации`, message)
                    }
                    return crossText(`Канал ${chan} уже находится в списке исключений`, message)
                } else if (args[0] == "unblock"){
                    let chan = message.mentions.channels.first() || message.guild.channels.cache.find(ch => ch.id === args[1])
                    if(!chan) return crossText(`Не было указано никакого канала`, message)
                    if(blockedList.includes(chan.id)){
                        let index = await blockedList.indexOf(chan.id)
                        await blockedList.splice(index, 1)
                        await server.save().catch()
                        return checkmarkText(`Канал ${chan} был успешно убран из исключений авто-модерации`, message)
                    }
                    return crossText(`Канал ${chan} не был найден в списке иключений`, message)
                } else if(args[0] == "list"){
                    if(blockedList.length == 0){
                        let embed = new Discord.MessageEmbed()
                        .setTitle(`Список исключенных каналов`)
                        .setDescription(`Этот список пустует в данный момент`)

                        return message.reply({embeds: [embed]})
                    } else {
                        let Arr = []
                        await blockedList.forEach(async element => {
                            if(message.guild.channels.cache.get(element)){
                                Arr.push(`<#${element}>`)
                            } else {
                                let index = await blockedList.indexOf(element)
                                await blockedList.splice(index, 1)
                                await server.save().catch()
                            }
                        });
                        let embed = new Discord.MessageEmbed()
                        .setTitle(`Список исключенных каналов`)
                        .setDescription(Arr.join(" "))
    
                        return message.reply({embeds: [embed]})
                    }
                } else {
                    return message.reply(`Не было найдено указанного аргумента`, message)
                }
            } else {
                if(!server.automod || server.automod == "off"){
                    server.automod = "on"
                    checkmarkText(`Авто-модерация была включена`, message)
                } else {
                    server.automod = "off"
                    crossText(`Авто-модерация была отключена`, message)
                }
                server.save().catch()
            }

        }catch(err){
            console.error(chalk.redBright(err.stack))
            console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
        }
    }
}