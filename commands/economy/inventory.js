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
            const { INVENTORY_SELECT_MENU, ARROWS_BUTTONS, NEGATIVE_SELECT_MENU, DECLINE_BUTTON } = require('../../functions/Buttons')
            const prefix = bot.server.get(message.guild.id).prefix
            const negative_roles = bot.negative_roles.get(message.guild.id)
            console.log(negative_roles)

            //

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

            page = Math.ceil(inventory.length / 5)
            var pg = 1

            const generateEmbed = async () => {
                var end = pg * 5
                var start = pg * 5 - 5
                
                let embed = new Discord.MessageEmbed().setColor(noColor())
                .setTitle(`Инвентарь пользователя ${message.member.displayName}`)
                .setThumbnail(message.member.user.displayAvatarURL({format: 'png', size: 2048, dynamic: true}))
                if(inventory.length == 0){
                    embed.setDescription(`Ваш инвентарь пустует. Вы можете приобрести разные плюшки в магазине **\`${prefix}shop\`**`)
                } else {
                    let FullArr = []
                    if(inventory.length <= end){
                        for(i = start; i < inventory.length; i++){
                            let item = inventory[i]
                            if(item.customId == 'role_removing'){
                                FullArr.push(`**Предмет:** Снятие негативной роли\n**Количество**: ${item.amount}`)
                            } else {
                                FullArr.push(`**Предмет:** ${message.guild.roles.cache.get(item.name)}\n**Длительность:** ${item.duration == 0 ? 'Навсегда' : '7 дней'}\n**Количество:** ${item.amount}`)
                            }
                        }
                    } else {
                        for(i = start; i < end; i++){
                            let item = inventory[i]
                            if(item.customId == 'role_removing'){
                                FullArr.push(`**Предмет:** Снятие негативной роли\n**Количество**: ${item.amount}`)
                            } else {
                                FullArr.push(`**Предмет:** ${message.guild.roles.cache.get(item.name)}\n**Длительность:** ${item.duration == 0 ? 'Навсегда' : '7 дней'}\n**Количество:** ${item.amount}`)
                            }
                        }
                    }
                    embed.setFooter({text: `Стр. ${pg} из ${page}`})
                    embed.setDescription(FullArr.join('\n\n'))
                }
    
                return embed
            }

            // let embed = new Discord.MessageEmbed().setColor(noColor()).setTitle(`Инвентарь пользователя ${message.member.displayName}`).setThumbnail(message.member.user.displayAvatarURL({format: 'png', size: 2048, dynamic: true}))
            // let FullArr = []
            // inventory.forEach(item => {
            //     if(item.customId == 'role_removing'){
            //         FullArr.push(`**Предмет:** Снятие негативной роли\n**Количество**: ${item.amount}`)
            //     } else {
            //         FullArr.push(`**Предмет:** ${message.guild.roles.cache.get(item.name)}\n**Длительность:** ${item.duration == 0 ? 'Навсегда' : '7 дней'}\n**Количество:** ${item.amount}`)
            //     }
            // });

            // embed.setDescription(FullArr.join('\n\n'))

            let initMessage = await message.reply({
                embeds: [await generateEmbed()],
                components: inventory.length != 0 ? [INVENTORY_SELECT_MENU(message, inventory.slice(pg * 5 - 5, pg * 5)), ARROWS_BUTTONS(pg, page)] : null
            })

            const filter = (m) => m.author.id === message.member.id
            const Collector = initMessage.createMessageComponentCollector(filter, {time: 1000 * 60 * 5})

            Collector.on('collect', async i => {
                return await i.reply({ content: `Находится в стадии доработки...`, ephemeral: true });
                if(i.member.id != message.member.id) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                console.log(i.customId ? i.customId : "Отсутствутет", i.values ? i.values[0] : "Отсутствутет")

                if(i.customId == "next_button"){
                    pg++
                    initMessage.edit({
                        embeds: [await generateEmbed()],
                        components: [INVENTORY_SELECT_MENU(message, inventory.slice(pg * 5 - 5, pg * 5)), ARROWS_BUTTONS(pg, page)]
                    })
                } else if(i.customId == "previous_button"){
                    pg--
                    initMessage.edit({
                        embeds: [await generateEmbed()],
                        components: [INVENTORY_SELECT_MENU(message, inventory.slice(pg * 5 - 5, pg * 5)), ARROWS_BUTTONS(pg, page)]
                    })
                } else if(i.customId == "decline_button"){
                    pg = 1
                    initMessage.edit({
                        embeds: [await generateEmbed()],
                        components: [INVENTORY_SELECT_MENU(message, inventory.slice(pg * 5 - 5, pg * 5)), ARROWS_BUTTONS(pg, page)]
                    })
                } else if(i.values[0] == '0'){
                    let memberNegativeRoles = []
                    if (negative_roles.length == 0) return await i.reply({content: `В данный момент список негативных ролей пустует. Обратитесть к администрации сервера`, ephemeral: true})

                    await negative_roles.forEach(role => {
                        let findRole = message.member.roles.cache.has(role)
                        if(findRole) memberNegativeRoles.push(role)
                    });

                    if(memberNegativeRoles.length == 0) return await i.reply({content: `У вас отсутствуют негативные роли`, ephemeral: true})
                    
                    let negativeSelectEmbed = new Discord.MessageEmbed()
                    .setTitle(`Снятие негативной роли`)
                    .setColor(noColor())
                    .setDescription(`Выберите из списка ниже, какую негативную роль хотите снять`)

                    initMessage.edit({
                        embeds: [negativeSelectEmbed],
                        components: [NEGATIVE_SELECT_MENU(message, memberNegativeRoles), DECLINE_BUTTON()]
                    })
                } else if(negative_roles.includes(i.values[0])){
                    let item = inventory.filter(item => item.name == "Снятие негативной роли")[0]
                    var newItem = {
                        name: `Снятие негативной роли`,
                        customId: `role_removing`,
                        amount: item.amount - 1
                    }
                    let index = inventory.indexOf(item)
                    console.log(inventory)
                    if(item.amount - 1 == 0){
                        inventory = inventory.splice(index, 1)
                    } else {
                        inventory = inventory.splice(index, 0, newItem)
                        inventory = inventory.splice(index, 1)
                    }
                    
                    // dbUser.inventory = inventory    
                    // dbUser.save()

                    // message.member.roles.remove(i.values[0])

                    console.log(inventory)
                    pg = 1
                    initMessage.edit({
                        embeds: [await generateEmbed()],
                        components: [INVENTORY_SELECT_MENU(message, inventory.slice(pg * 5 - 5, pg * 5)), ARROWS_BUTTONS(pg, page)]
                    })

                    return await i.reply({
                        content: `${message.member} Успешно была снята роль <@&${i.values[0]}>`,
                        ephemeral: true
                    })
                }
                i.deferUpdate()
            })
        }catch(err){
            console.error(chalk.redBright(err.stack))
            console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
        }
    }
}
