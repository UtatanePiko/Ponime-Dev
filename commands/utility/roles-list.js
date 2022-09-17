const chalk = require('chalk')

module.exports = {
    name: "roles-list",
    description: "Описание команд",
    aliases: ['список-ролей', 'role-list'],
    run: async (bot, message, args) => {

        try{

            const Discord = require('discord.js')
            const Guild = require('../../models/guild')
            const { Embeds, crossText } = require('../../functions/Embed') 
            const { noColor } = require('../../functions/Colours')
            const prefix = bot.server.get(message.guild.id).prefix

            if(args[0] == "help" || args[0] == "помощь"){
                const embed = new Embeds({
                    message: message,
                    description: `Узнать, сколько человек имеет каждую роль`,
                    embedTitle: "ROLES-LIST HELP-MENU",
                    embedColor: noColor(),
                    arguments: `● **\`${prefix}role-list\`**`,
                    alternatives: `● **\`${prefix}roles-list\`** | **\`${prefix}role-list\`** | **\`${prefix}список ролей\`**`,
                    examples: `● **\`${prefix}role-list\`**`,
                    // hints: `● **\`[]\`** - необязательно для заполнения`
                })
                return embed.help()
            }
    
            let embed1 = new Discord.MessageEmbed().setColor(noColor())
            let embed2 = new Discord.MessageEmbed().setColor(noColor())
            let list1 = []
            let list2 = []
               
            let allRoles = message.guild.roles.cache.sort((a, b) => b.rawPosition - a.rawPosition)
            await allRoles.forEach(role => {
                list1.push(`<@&${role.id}> - **${role.members.size}** человек`)
                list2.push(`<@&${role.id}> - **${role.members.size}** человек`)
            });
            const half = Math.ceil(list1.length / 2); 
            const Arr1 = list1.slice(0, half)
            const Arr2 = list2.slice(half)
            embed1.setDescription(Arr1.join(`\n`))
            embed2.setDescription(Arr2.join(`\n`))

            message.reply({
                embeds: [embed1, embed2]
            })


        }catch(err){
            console.error(chalk.redBright(err.stack))
            console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
        }
    }
}
