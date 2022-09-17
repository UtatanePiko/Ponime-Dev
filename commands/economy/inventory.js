const chalk = require('chalk')

module.exports = {
    name: "inventory",
    description: "Описание команд",
    aliases: ["inv", "$", "баланс", "бал"],
    run: async (bot, message, args) => {
        try{
            
            const Discord = require('discord.js')
            const User = require('../../models/user')
            const Guild = require('../../models/guild')
            const MongoFunc = require('../../functions/MongoFunc')
            const Util = require('../../functions/Util')
            const coin = Util.findEmoji('CHPOKI_COIN')
            const { Embeds, crossText } = require('../../functions/Embed') 
            const { noColor } = require('../../functions/Colours')
            const { INVENTORY_SELECT_MENU } = require('../../functions/Buttons')
            const prefix = bot.server.get(message.guild.id).prefix

            if(message.author.id != "329462919676821504") return

            if(args[0] == "help" || args[0] == "помощь"){
                const embed = new Embeds({
                    message: message,
                    description: `Здесь вы можете посмотреть свои покупки из **\`${prefix}shop\`**`,
                    embedTitle: "INVENTORY HELP-MENU",
                    embedColor: noColor(),
                    alternatives: `● **\`${prefix}inventory\`** | **\`${prefix}inv\`**`,
                    examples: `● **\`${prefix}inv\`**`,
                })
    
                return embed.help()
            }

            let dbUser = await User.findOne({guildID: message.guild.id, userID: message.author.id}, {inventory: 1})
            let inventory = dbUser.inventory

            let embed = new Discord.MessageEmbed().setColor(noColor()).setTitle(`Инвентарь пользователя ${message.member.displayName}`).setThumbnail(message.member.user.displayAvatarURL({format: 'png', size: 2048, dynamic: true}))
            let FullArr = []
            inventory.forEach(item => {
                if(item.customId == 'role_removing'){
                    FullArr.push(`**Предмет:** Снятие негативной роли\n**Количество**: ${item.amount}`)
                } else {
                    FullArr.push(`**Предмет:** ${message.guild.roles.cache.get(item.name)}\n**Длительность:** ${item.duration == 0 ? 'Навсегда' : '7 дней'}\n**Количество:** ${item.amount}`)
                }
            });

            embed.setDescription(FullArr.join('\n\n'))

            message.reply({
                embeds: [embed],
                components: [INVENTORY_SELECT_MENU(message, inventory)]
            })
        }catch(err){
            console.error(chalk.redBright(err.stack))
            console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
        }
    }
}
