const chalk = require('chalk')

module.exports = {
    name: "buy",
    description: "Описание команд",
    run: async (bot, message, args) => {
        try{
            
            const Discord = require('discord.js')
            const User = require('../../models/user')
            const Guild = require('../../models/guild')
            const Temprole = require('../../models/temprole')
            const MongoFunc = require('../../functions/MongoFunc')
            const Util = require('../../functions/Util')
            const coin = Util.findEmoji('CHPOKI_COIN')
            const cross = Util.findEmoji('cross4')
            const checkmark = Util.findEmoji('checkmark4')
            const { Embeds, crossText, checkmarkText, noPerms } = require('../../functions/Embed') 
            const { noColor } = require('../../functions/Colours')
            const { INFINITE_WEEK_DECLINE_BUTTONS } = require('../../functions/Buttons')
            const prefix = bot.server.get(message.guild.id).prefix

            if(message.author.id != "329462919676821504") return

            if(args[0] == "help" || args[0] == "помощь"){

                const embed = new Embeds({
                    message: message,
                    description: `При помощи этой команды вы можете купить предмет из магазина по его ID`,
                    embedTitle: "BUY HELP-MENU",
                    embedColor: noColor(),
                    arguments: `● **\`${prefix}buy <ID>\`**`,
                    alternatives: `● **\`${prefix}buy\`** | **\`${prefix}купить\`**`,
                    examples: `● **\`${prefix}buy 10\`**`,
                })
                return embed.help()
            }

            if(!args[0]) return crossText(`Не был указан ID\nПример: **\`${prefix}buy 2\`**`, message)
            let ID = args[0]
            if(ID % 1 != 0 || ID.includes('+') || ID.includes('.') || ID <= 0) return crossText(`ID должно быть целым положительным числом`, message)
            ID = parseInt(ID)

            async function getDbUser(uid){
                let user = await User.findOne({userID: uid, guildID: message.guild.id}, {inventory: 1, currency: 1})
                return user
            }
            async function getServer(gid){
                let server = await Guild.findOne({guildID: gid}, {shop: 1})
                return server
            }
            async function parallelGet(){
                return await Promise.all([
                    getDbUser(message.member.id),
                    getServer(message.guild.id)
                ])
            }

            let result = await parallelGet()
            let dbUser = result[0]
            let server = result[1]
            let item = server.shop[ID - 1]

            if(!item) return crossText(`Позиции с ID **\`${ID}\`** не было найдено`, message)
            if(
            (dbUser.currency < item.week_price && item.week_price != 0) || 
            (item.week_price == 0 && dbUser.currency < item.infinite_price)
            ) return crossText(`У вас недостаточной койнов на руках\nБаланс: **${dbUser.currency}** ${coin}`, message)

            if(item.week_price == 0 || item.infinite_price == 0){
                let inventory = dbUser.inventory
                let roleID = item.roleID
                let thisItem = inventory.filter(item => item.name == (ID == 1 ? 'Снятие негативной роли' : roleID.toString()))
                let amount = thisItem.length > 0 ? thisItem[0].amount + 1 : 1
                var newItem = {
                    name: `${ID == 1 ? 'Снятие негативной роли' : item.roleID}`,
                    customId: `${ID == 1 ? 'role_removing' : 'role_giving'}`,
                    duration: item.week_price == 0 ? 0 : 1000 * 60 * 60 * 24 * 7,
                    amount: amount
                }

                if(thisItem.length > 0){
                    dbUser.inventory.splice(inventory.indexOf(thisItem), 0, newItem)
                    dbUser.inventory.splice(inventory.indexOf(thisItem), 1)
                } else {
                    dbUser.inventory.push(newItem)
                }
                dbUser.save()
                return checkmarkText(`Вы успешно приобрели **${ID == 1 ? 'Снятие негативной роли' : message.guild.roles.cache.get(item.roleID)}**\nВы можете просмотреть купленные товары и активировать их в своем инвенторе **\`${prefix}inv\`**`, message)
            } else {
                let embed = new Discord.MessageEmbed().setColor(noColor()).setTitle(`Покупка ${ID == 1 ? 'Снятие негативной роли' : message.guild.roles.cache.get(item.roleID).name}`)
                .setDescription(`Выберите, на какой срок хотите приобрести выбранную роль`)

                let initMessage = await message.reply({
                    embeds: [embed],
                    components: [INFINITE_WEEK_DECLINE_BUTTONS(item.infinite_price, item.week_price, Boolean(dbUser.currency < item.infinite_price), false)]
                })
                const filter = (interaction) => interaction.user.id === message.member.id;
                const Collector = initMessage.createMessageComponentCollector({ filter, time: 120000 })

                Collector.on('end', collected => {
                    initMessage.edit({
                        components: [INFINITE_WEEK_DECLINE_BUTTONS(item.infinite_price, item.week_price, true, true)]
                    })
                })

                Collector.on('collect', async interaction => {
                    if(interaction.member.id != message.member.id) return await interaction.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                    let inventory = dbUser.inventory
                    let roleID = item.roleID
                    if(interaction.customId == 'week_button'){
                        if(dbUser.currency < item.week_price) return await interaction.reply({ content: `У вас недостаточно баланса на момент нажатия кнопки`, ephemeral: true });
                        let thisItem = inventory.filter(item => item.name == roleID.toString() && item.duration == 1000 * 60 * 60 * 24 * 7)
                        let amount = thisItem.length > 0 ? thisItem[0].amount + 1 : 1
                        var newItem = {
                            name: `${item.roleID}`,
                            customId: `role_giving`,
                            duration: 1000 * 60 * 60 * 24 * 7,
                            amount: amount
                        }
                        if(thisItem.length > 0){
                            dbUser.inventory.splice(inventory.indexOf(thisItem), 0, newItem)
                            dbUser.inventory.splice(inventory.indexOf(thisItem), 1)
                        } else {
                            dbUser.inventory.push(newItem)
                        }
                        dbUser.save()
                        checkmarkText(`Вы успешно приобрели ${message.guild.roles.cache.get(item.roleID)} на 1 неделю\nВы можете просмотреть купленные товары и активировать их в своем инвенторе **\`${prefix}inv\`**`, initMessage)
                    } else if(interaction.customId == 'infinite_button'){
                        if(dbUser.currency < item.infinite_price) return await interaction.reply({ content: `У вас недостаточно баланса на момент нажатия кнопки`, ephemeral: true });
                        let thisItem = inventory.filter(item => item.name == roleID.toString() && item.duration == 0)
                        if(message.member.roles.cache.has(item.roleID)) return await interaction.reply({ content: `Нельзя приобрести роль навсегда, если у вас она уже имеется`, ephemeral: true });
                        if(thisItem.length > 0) return await interaction.reply({ content: `Нельзя приобрести роль навсегда, если у вас она уже имеется в инвенторе`, ephemeral: true });
                        var newItem = {
                            name: `${item.roleID}`,
                            customId: `role_giving`,
                            duration: 0,
                            amount: 1
                        }
                        dbUser.inventory.push(newItem)
                        dbUser.save()
                        checkmarkText(`Вы успешно приобрели ${message.guild.roles.cache.get(item.roleID)} навсегда\nВы можете просмотреть купленные товары и активировать их в своем инвенторе **\`${prefix}inv\`**`, initMessage)
                    } else {
                        Collector.stop()
                        return await interaction.reply({ content: `Вы отменили покупку роли вручную`, ephemeral: true });
                    }
                    interaction.deferUpdate()
                })
            }
            
        }catch(err){
            console.error(chalk.redBright(err.stack))
            console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
        }
    }
}
