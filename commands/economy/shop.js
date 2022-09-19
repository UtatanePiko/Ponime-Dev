const chalk = require('chalk')

module.exports = {
    name: "shop",
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
            const { ARROWS_BUTTONS } = require('../../functions/Buttons')
            const prefix = bot.server.get(message.guild.id).prefix

            if(message.author.id != "329462919676821504") return

            if(args[0] == "help" || args[0] == "помощь"){
                    
                let helpEmbed = new Discord.MessageEmbed()
                .setTitle(`SHOP HELP-MENU`)
                .setColor(noColor())
                .setDescription(`Магазин ролей, которые вы можете приобрести за серверную валюту`)

                let helpAdminEmbed = new Discord.MessageEmbed()
                .setTitle(`SHOP HELP-MENU [ADMIN]`)
                .setColor(noColor())
                .setDescription(`Позволяет совершить преступление и получить или проиграть деньги\nПерезарядка: **10 часов**\nБудучи администратором вы можете управлять списком ответов`)
                .setFields(
                    {name: `Аргументы`, value: `● **\`${prefix}shop [add | delete | edit] [ID]\`**`},
                    {name: "Примеры", value: `● **\`${prefix}shop\`**\n● **\`${prefix}shop add <@role | roleID> <Цена навсегда> <Цена за неделю>\`**\n● **\`${prefix}shop edit <ID> <Цена навсегда> <Цена за неделю>\`**\n● **\`${prefix}shop delete <ID>\`**`},
                    {name: "Пояснение", value: `● Если цена навсегда или цена за неделю будет 0, то возможность покупки этого варианта будет недоступна\n● **\`[]\`** - необязательно для заполнения\n● **\`<>\`** - обязательно для заполнения`}
                )

                if(Util.checkPerm(message.member, "ADMINISTRATOR")) return message.channel.send({ content: `${message.author}`, embeds: [helpEmbed] })
                return message.channel.send({ content: `${message.author}`, embeds: [helpAdminEmbed] })
            }
            let server = await Guild.findOne({guildID: message.guild.id}, {shop: 1})
            let shopArr = server.shop
            if(shopArr.length == 0){
                shopArr.push({
                    customId: 'removing_role',
                    infinite_price: 2500,
                    week_price: 0
                })
                server.save().catch()
            }

            if(!args[0]){

                page = Math.ceil(shopArr.length / 5)
                var pg = 1

                const generateShop = () => {
                    var end = pg * 5
                    var start = pg * 5 - 5

                    let embed = new Discord.MessageEmbed()
                    .setThumbnail(message.guild.iconURL({dynamic: true}))
                    .setColor(noColor())
                    if(server.shop.length == 0){
                        embed.setDescription(`В магазине пока нет никаких ролей`)
                    } else {
                        embed.setTitle(`⁣⁣ ⁣⁣ ⁣⁣ ⁣⁣ ⁣⁣ ⁣⁣ ⁣⁣ ⁣⁣ ⁣⁣ ⁣⁣ ⁣⁣ ⁣⁣ ⁣⁣ ⁣⁣ ⁣⁣ ⁣⁣ ⁣⁣ ⁣⁣ ⁣⁣ ⁣⁣ ⁣ ⁣ ⁣ PONIME SHOP⁣⁣ ⁣⁣ ⁣⁣ ⁣⁣ ⁣⁣ ⁣⁣ ⁣⁣ ⁣⁣ ⁣⁣ ⁣⁣ ⁣⁣ ⁣⁣ ⁣⁣ ⁣⁣ ⁣⁣ ⁣⁣ ⁣⁣ ⁣⁣ ⁣⁣ ⁣⁣ ⁣ ⁣ ⁣ `)
                        embed.setFooter({text: `Стр. ${pg} из ${page} | Купить: ${prefix}buy ID`})
                        //`⁣⁣ ⁣⁣ ⁣⁣ ⁣⁣ ⁣⁣ ⁣⁣ ⁣⁣ ⁣⁣ ⁣⁣ ⁣⁣ ⁣⁣ ⁣⁣ ⁣⁣ ⁣⁣ ⁣⁣ ⁣⁣ ⁣⁣ ⁣⁣ ⁣⁣ ⁣⁣ ⁣ ⁣ ⁣ `
    
                        let FullArr = []

                        if(shopArr.length <= end){
                            for(i = start; i < shopArr.length; i++){
                                let item = shopArr[i]
                                if(item.customId == 'removing_role' || item.customId == 'role_removing'){
                                    FullArr.push(`**ID:** ${i + 1}\nСнятие негативной роли\n**Цена**: ${item.infinite_price} ${coin}`)
                                } else {
                                    FullArr.push(`**ID:** ${i + 1}\n**Роль:** <@&${item.roleID}>\n**Цена**: ${item.infinite_price > 0 && item.week_price > 0 ? `${item.infinite_price} ${coin} | ${item.week_price} ${coin} 1 нед.` :
                                                                                                    item.infinite_price > 0 && item.week_price == 0 ? `${item.infinite_price} ${coin} навсегда` :
                                                                                                    `${item.week_price} ${coin} 1 нед.`}`)
                                }
                            }
                        } else {
                            for(i = start; i < end; i++){
                                let item = shopArr[i]
                                if(item.customId == 'removing_role' || item.customId == 'role_removing'){
                                    FullArr.push(`**ID:** ${i + 1}\nСнятие негативной роли\n**Цена**: ${item.infinite_price} ${coin}`)
                                } else {
                                    FullArr.push(`**ID:** ${i + 1}\n**Роль:** <@&${item.roleID}>\n**Цена**: ${item.infinite_price > 0 && item.week_price > 0 ? `${item.infinite_price} ${coin} | ${item.week_price} ${coin} 1 нед.` :
                                                                                                    item.infinite_price > 0 && item.week_price == 0 ? `${item.infinite_price} ${coin} навсегда` :
                                                                                                    `${item.week_price} ${coin} 1 нед.`}`)
                                }
                            }
                        }

                        embed.setDescription(`${FullArr.join('\n\n')}`)
                    }
                    return embed
                }
            
                
                let initMessage = await message.reply({
                    embeds: [generateShop()],
                    components: [ARROWS_BUTTONS(pg, page)]
                })
                const channelFilter = (m) => m.author.id === message.member.id
                const Collector = initMessage.createMessageComponentCollector({channelFilter, time: 60000 * 5, errors: ['time']})

                Collector.on('collect', async interaction => {
                    if (interaction.member.id != message.member.id) return await interaction.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                    if(interaction.customId == 'next_button'){
                        pg++
                        initMessage.edit({
                          embeds: [generateShop()],
                          components: [ARROWS_BUTTONS(pg, page)],
                        })
                    } else if(interaction.customId == 'previous_button'){
                        pg--
                        initMessage.edit({
                          embeds: [generateShop()],
                          components: [ARROWS_BUTTONS(pg, page)],
                        })
                    }
                    interaction.deferUpdate()
                })

            } else if(args[0] == "add"){
                let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1])
                if(!role) return crossText(`Роль не найдена или не указана`, message)
                let check = false
                shopArr.forEach(el => {
                    if(el.roleID == role.id){
                        check = true
                    }
                })
                if(check == true) return crossText(`Эта роль уже находится в магазине\nВы можете изменить ее цену, использую **\`${prefix}shop edit ID цена\`**`, message)
                let inf_price = args[2]
                if(inf_price % 1 != 0  || inf_price < 0 || !args[2]) return crossText(`Цена навсегда не указана или не является целым положительным числом\nПример: **\`${prefix}shop add @role 2500 1000\`**`, message)
                let week_price = args[3]
                if(week_price % 1 != 0  || week_price < 0 || !args[3]) return crossText(`Цена за неделю не указана или не является целым положительным числом\nПример: **\`${prefix}shop add @role 2500 1000\`**`, message)
                if(inf_price == 0 && week_price == 0) return crossText(`Хотя бы одна из цен должна быть положительным числом`, message)
                let info = {
                    customId: `role_giving`,
                    roleID: role.id,
                    infinite_price: parseInt(inf_price),
                    week_price: parseInt(week_price)
                    }
                shopArr.push(info)
                server.save().catch(err => console.error(err))
                return checkmarkText(`Роль ${role} добавлена в магазин`, message)

            } else if(args[0] == "delete" || args[0] == "remove"){
                let index = args[1]
                if(!shopArr[index - 1]) return crossText(`ID не был указан или такого нет в магазине\nПример: **\`${prefix}shop remove <ID>\`**`, message)
                let item = shopArr[index - 1]
                if(item.customId != 'role_giving') return crossText(`Невозможно удалить особые позиции в магазине`, message)
                shopArr.splice(index - 1, 1)
                server.save().catch(err => console.error(err))
                return checkmarkText(`Роль под ID **${index}** была убрана с магазина`, message)
            } else if(args[0] == "edit"){
                let index = args[1]
                if(!shopArr[index - 1]) return crossText(`ID не был указан или такого нет в магазине\nПример: **\`${prefix}shop edit ID <Новая цена>\`**`, message)
                let item = shopArr[index - 1]
                if(item.customId != 'role_giving') return crossText(`Невозможно изменить особые позиции в магазине`, message)
                let inf_price = args[2]
                if(inf_price % 1 != 0  || inf_price < 0 || !args[2]) return crossText(`Цена навсегда не указана или не является целым положительным числом\nПример: **\`${prefix}shop add @role 1000\`**`, message)
                let week_price = args[3]
                if(week_price % 1 != 0  || week_price < 0 || !args[3]) return crossText(`Цена за неделю не указана или не является целым положительным числом\nПример: **\`${prefix}shop add @role 1000\`**`, message)
                if(inf_price == 0 && week_price == 0) return crossText(`Хотя бы одна из цен должна быть положительным числом`, message)
                let lastRoleID = shopArr[index - 1].roleID
                let newInfo = {
                    customId: `role_giving`,
                    roleID: lastRoleID,
                    infinite_price: parseInt(inf_price),
                    week_price: parseInt(week_price)
                }
                await shopArr.splice(index - 1, 1)
                await server.save()
                await shopArr.splice(index - 1, 0, newInfo)
                await server.save()
                return checkmarkText(`Цена роли под ID **${index}** изменена на **${price}**`,message)
            } else if(args[0] == "buy"){
                let index = args[1]
                if(!shopArr[index - 1]) return crossText(`ID не был указан или такого нет в магазине\nПример: **\`${prefix}shop buy ID\`**`, message)
                let dbUser = await User.findOne({userID: message.member.id, guildID: message.guild.id})
                if(dbUser.currency < parseInt(shopArr[index - 1].price) && dbUser.currency < (parseInt(shopArr[index - 1].price) / 100 * 25)) return crossText(`У вас недостаточно средств для покупки этой роли навсегда и временно`, message)
                let TF = false
                if(dbUser.currency < shopArr[index - 1].price) TF = true
                let role = message.guild.roles.cache.find(r => r.id === shopArr[index - 1].roleID)
                if(message.member.roles.cache.has(role.id)) return crossText(`У вас уже имеется данная роль`, message)

                let embed = new Discord.MessageEmbed()
                .setColor(noColor())
                .setTitle(`Покупка роли "${role.name}"`)
                .setDescription(`Выберите срок на который хотите купить роль`)

                const action = {
                    type: "ACTION_ROW",
                    components:[
                        {
                            type: "BUTTON",
                            label: `${shopArr[index - 1].price} Навсегда`,
                            customId: "b1",
                            style: "PRIMARY",
                            emoji: coin,
                            disabled: TF
                        },
                        {
                            type: "BUTTON",
                            label: `${Math.floor(shopArr[index - 1].price / 100 * 25)} 1 нед.`,
                            customId: "b2",
                            style: "PRIMARY",
                            emoji: coin,
                            disabled: false
                        },
                        {
                            type: "BUTTON",
                            label: `Отменить`,
                            customId: "b3",
                            style: "DANGER",
                            disabled: false
                        }
                    ]
                }

                const initMessage = await message.reply({
                    embeds: [embed],
                    components: [action],
                });

                const filter = (interaction) => interaction.user.id === message.member.id;
                const collector = await initMessage.createMessageComponentCollector({ filter, time: 120000 })

                collector.on('collect', async (Interaction) => {
                    if(Interaction.customId == "b1"){
                        if(dbUser.currency < parseInt(shopArr[index - 1].price)) return message.channel.send({content: `${message.author}`, embeds: [Embed.crossText(`У вас недостаточно средств для покупки этой роли навсегда`)]})
                        initMessage.edit({
                            embeds: [Embed.checkmarkText(`Вы успешно приобрели роль ${role} навсегда`)],
                            components: []
                        });
                        Interaction.member.roles.add(role)
                        dbUser.currency -= shopArr[index - 1].price
                        dbUser.save().catch(err => console.error(err))
                    }

                    if(Interaction.customId == "b2"){
                        if(dbUser.currency < (parseInt(shopArr[index - 1].price) / 100 * 25)) return message.channel.send({content: `${message.author}`, embeds: [Embed.crossText(`У вас недостаточно средств для покупки этой роли на 7 дней`)]})
                        initMessage.edit({
                            embeds: [Embed.checkmarkText(`Вы успешно приобрели роль ${role} на **7** дней`)],
                            components: []
                        });
                        let newTempRole = await new Temprole({
                            _id: mongoose.Types.ObjectId(),
                            guildID: message.guild.id,
                            userID: Interaction.member.id,
                            gived_by: 'shop',
                            roleID: role.id,
                            date: Date.now(),
                            duration: 1000 * 60 * 60 * 24 * 7,
                        })
            
                        await newTempRole.save()
                    }

                    if(Interaction.customId == "b3"){
                        initMessage.edit({
                            embeds: [Embed.crossText(`Вы отклонили покупку`)],
                            components: []
                        });
                    }
                    await Interaction.deferUpdate()
                })
            }



        }catch(err){
            console.error(chalk.redBright(err.stack))
            console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
        }
    }
}
