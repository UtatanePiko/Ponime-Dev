const chalk = require('chalk')

module.exports = {
    name: "autorole",
    category: "administration",
    description: "Настройка авторолей\nВведите это команду без значений, чтобы узнать подробней",
    aliases: ["ar", "авто-роль", "автороль"],
    run: async (bot, message, args) => {

        try{
        
            const Discord = require("discord.js");
            const { noColor } = require('../../functions/Colours')
            const Guild = require('../../models/guild')
            const { Embeds, crossText, checkmarkText, noPerms } = require('../../functions/Embed') 
            const Util  = require('../../functions/Util') 
            const server = await Guild.findOne({ guildID: message.guild.id })
            const rolearr = server.autorole
            
            if(Util.checkPerm(message.member, "ADMINISTRATOR")) return noPerms(message)
    
            if(args[0] == "help" || args[0] == "помощь"){
                const embed = new Embeds({
                    message: message,
                    description: `Управление авто-ролями сервера`,
                    embedTitle: "AUTOROLE HELP-MENU",
                    embedColor: noColor(),
                    arguments: `● **\`${server.prefix}autorole <add/добавить> <@role>\`**\n● **\`${server.prefix}autorole <remove/удалить> <@role>\`**\n● **\`${server.prefix}autorole <list/список>\`**`,
                    alternatives: `● **\`${server.prefix}autorole\`** | **\`${server.prefix}ar\`** | **\`${server.prefix}автороль\`**`,
                    examples: `● **\`${server.prefix}autorole add @role\`**\n● **\`${server.prefix}ar list\`**`,
                    hints: `● **\`<>\`** - обязательно для заполнения`
                })
    
                return embed.help()
            }
    
            if(!args[0]) return crossText(`Не указано никаких аргументов\nИспользуйте **\`${message.content.split(" ")[0].toLowerCase()} help\`**, чтобы узнать возможные аргументы`, message)
            if(args[0] != "add" && args[0] != "remove" && args[0] != "list" && args[0] != "добавить" && args[0] != "удалить" && args[0] != "список") return crossText(`Не найдено указанных аргументов\nИспользуйте **\`${message.content.split(" ")[0].toLowerCase()} help\`**, чтобы узнать возможные аргументы`, message)
            if(args[0] == "list" || args[0] == "список"){
                if(rolearr.length != 0){
                    rolearr.forEach(role => {
                        rid = message.guild.roles.cache.find(r => r.id === role)
                        if(rid){} else {server.autorole.pull(role); server.save()}
                    });
                    let roleslist = new Array
                    rolearr.forEach(async role => {
                        roleslist.push(`<@&${role}>`)
                    });
                    let embed = new Discord.MessageEmbed()
                    .setTitle(`Список добавленных ролей`)
                    .setColor(noColor())
                    .setDescription(`${roleslist.join(", ")}`)
                    .setTimestamp()
                    message.channel.send({embeds: [embed]})
                } else {
                    let embed = new Discord.MessageEmbed()
                    .setTitle(`Список добавленных ролей`)
                    .setColor(noColor())
                    .setDescription(`Этот список пустует\nВы можете пополнить его, добавив сюда роль: \`${message.content.split(" ")[0].toLowerCase()} add @Участник\``)
                    .setTimestamp()
                    message.channel.send({embeds: [embed]})
                }
            }
            if(args[0] == "add" || args[0] == "добавить"){
                let role = message.mentions.roles.first() || message.guild.roles.cache.find(r => r.name == args[1])
                if(!role) return crossText(`Роль не указана или не была найдена`, message) 
                if(!rolearr.includes(role.id)){
                    server.autorole.push(role.id)
                    server.save()
                    return checkmarkText(`Роль ${role} теперь автоматически выдается каждому новому пользователю`, message)
                } else {
                    return crossText(`Эта роль уже автоматически выдается новым участникам`, message)
                }
            }
            if(args[0] == "remove" || args[0] == "удалить"){
                let role = message.mentions.roles.first() || message.guild.roles.cache.find(r => r.name == args[1])
                if(!role) return crossText(`Роль не указана или не была найдена`, message)
                if(rolearr.includes(role)){
                    server.autorole.pull(role.id)
                    server.save()
                    return checkmarkText(`Роль ${role} больше не выдается автоматически`, message)
                } else {
                    return crossText(`Этой роли нет в списке`, message)
                }
            }
        }catch(err){
            console.error(chalk.redBright(err.stack))
            console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
        }
    }
}