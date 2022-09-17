const chalk = require('chalk')

module.exports = {
    name: "roles",
    description: "Описание команд",
    run: async (bot, message, args) => {

        try{

            const Discord = require('discord.js')
            const Guild = require('../../models/guild')
            const Roles = require('../../models/roles')
            const MongoFunc = require('../../functions/MongoFunc') 
            const { Embeds, crossText, noPerms, checkmarkText } = require('../../functions/Embed') 
            const { noColor } = require('../../functions/Colours')
            const Util  = require('../../functions/Util') 
            const mongoose = require('mongoose')
            const prefix = bot.server.get(message.guild.id).prefix
    
            if(args[0] == "help" || args[0] == "помощь"){
                const adminEmbed = new Embeds({
                    message: message,
                    description: `В этом меню вы можете выбрать, какие роли сможет выдавать выбранный вами пользователь через эту команду`,
                    embedTitle: "ROLES HELP-MENU [ADMIN]",
                    embedColor: noColor(),
                    arguments: `● **\`${prefix}roles <@user | userID>\`**`,
                    alternatives: `● Отсутствуют`,
                    examples: `● **\`${prefix}roles @user\`**`,
                    hints: `● **\`<>\`** - обязательно для заполнения`
                })

                const embed = new Embeds({
                    message: message,
                    description: `В этом меню вы можете выбрать, какую роль выдать юзеру\nСписок доступных для выдачи ролей может изменить лишь администратор`,
                    embedTitle: "ROLES HELP-MENU",
                    embedColor: noColor(),
                    arguments: `● **\`${prefix}roles <@user/@role>\`**`,
                    alternatives: `● Отсутствуют`,
                    examples: `● **\`${prefix}roles @user\`**\n● **\`${prefix}roles @role\`**`,
                    hints: `Упоминая роль, вы добавляете или удаляете ее из селект меню\n● **\`<>\`** - обязательно для заполнения`
                })
    
                if(Util.checkPerm(message.member, "ADMINISTRATOR")) return embed.help()
                return adminEmbed.help()
            }

            let role = message.mentions.roles.first() || message.guild.roles.cache.find(r => r.id == args[0])
            if(role && !Util.checkPerm(message.member, "ADMINISTRATOR")){
                let roles = bot.server.get(message.guild.id).roles
                if(!roles.includes(role.id)){
                    if(role.tags.botId) return crossText(`Вы не можете добавить роль бота в селект меню`, message)
                    if(roles.length == 25) return crossText(`Нельзя добавить больше 25 ролей`, message)
                    checkmarkText(`Роль ${role} была успешна добавлена в селект меню`, message)
                    let server = await Guild.findOne({guildID: message.guild.id})
                    await roles.push(role.id)
                    server.roles = roles
                    server.save().catch()
                    bot.server.set(message.guild.id, {
                        prefix: bot.server.get(message.guild.id).prefix,
                        actions_channels: bot.server.get(message.guild.id).actions_channels,
                        leveling_channels: bot.server.get(message.guild.id).leveling_channels,
                        moderation_channels: bot.server.get(message.guild.id).moderation_channels,
                        warnID: bot.server.get(message.guild.id).warnID,
                        roles: roles,
                        event_channels: bot.server.get(message.guild.id).event_channels || []
                    })
                } else {
                    checkmarkText(`Роль ${role} была успешна удалена из селект меню`, message)
                    let server = await Guild.findOne({guildID: message.guild.id})
                    let index = roles.indexOf(role.id)
                    await roles.splice(index, 1)
                    server.roles = roles
                    server.save().catch()
                    bot.server.set(message.guild.id, {
                        prefix: bot.server.get(message.guild.id).prefix,
                        actions_channels: bot.server.get(message.guild.id).actions_channels,
                        leveling_channels: bot.server.get(message.guild.id).leveling_channels,
                        moderation_channels: bot.server.get(message.guild.id).moderation_channels,
                        warnID: bot.server.get(message.guild.id).warnID,
                        roles: roles,
                        event_channels: bot.server.get(message.guild.id).event_channels || []
                    })
                }
                return
            }

            let mentuser = args[0] ? message.guild.members.cache.get(args[0].replace('<@', '').replace('>', '')) : null
            if(!mentuser) return crossText(`Не указан или не найден пользователь/роль`, message)
            if(!Util.checkPerm(message.member, "ADMINISTRATOR")){
                var dbUser = await Roles.findOne({guildID: message.guild.id, userID: mentuser.id})
                var dbUserRoles = dbUser ? dbUser.roles : 0
                let roles = bot.server.get(message.guild.id).roles
                if(roles.length == 0) return crossText(`Селект меню пустует\nДобавьте туда роли при помощи ${prefix}roles @role`, message)
                needUpdate = false

                var selectMenu = (state) => {
                    let selectMenu = new Discord.MessageSelectMenu()
                    .setCustomId('select_menu')
                    .setDisabled(state || false)
                    .setPlaceholder('Выберите роль(-и)')
                    .setMinValues(0)
                    .setMaxValues(roles.length)
                    
                    roles.forEach(role => {
                        let findRole = message.guild.roles.cache.get(role)
                        if(!findRole) return
                        selectMenu.addOptions({
                            label: `${findRole.name}`,
                            value: `${findRole.id}`,
                            default: dbUser ? dbUserRoles.includes(role) : false
                        })
                    });

                    return [selectMenu]
                }
                var selectMenuAction = (state) => {
                    let action = new Discord.MessageActionRow().addComponents(selectMenu(state))
                    return action
                };

                let embedCreate = async (needUpdate) => {
                    if(needUpdate){
                        dbUser = await Roles.findOne({guildID: message.guild.id, userID: mentuser.id})
                    }
                    dbUserRoles = dbUser ? dbUser.roles : null
                    let embed = new Discord.MessageEmbed()
                    .setDescription(`Выберите роли, которые пользователь сможет выдавать и забирать при помощи данной команды`)
                    .setTitle(`Список ролей, доступных для выдачи ${mentuser.displayName}`)
                    .setColor(noColor())
                    .setThumbnail(mentuser.user.displayAvatarURL({size: 2048, format: "png"}))

                    return embed
                }

                let initMessage = await message.reply({
                    embeds: [await embedCreate(false)],
                    components: [selectMenuAction()]
                })

                const channelFilter = (m) => m.author.id === message.member.id
                const chooseEventCollector = initMessage.createMessageComponentCollector({channelFilter, time: 300000, errors: ['time']})
                chooseEventCollector.on('collect', async i => {
                    if(i.member.id != message.member.id) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                    if(!dbUser){
                        let newRoles = await new Roles({
                            _id: mongoose.Types.ObjectId(),
                            guildID: message.guild.id,
                            userID: mentuser.id,
                            roles: i.values
                        })
                        await newRoles.save()

                        await initMessage.edit({
                            embeds: [await embedCreate(true)],
                            components: [selectMenuAction()]
                        })
                    } else {
                        dbUser.roles = i.values
                        await dbUser.save()

                        await initMessage.edit({
                            embeds: [await embedCreate(true)],
                            components: [selectMenuAction()]
                        })
                    }

                    i.deferUpdate()
                })
                
            } else {
                if(mentuser.id == message.member.id) return crossText(`Вы не можете управлять своими ролями`, message)
                if(mentuser.roles.highest.position >= message.member.roles.highest.position && message.guild.ownerId != message.member.id) return crossText(`Вы не можете управлять ролями пользователя, выше или равным вам по ролям`, message)
                let dbUser = await Roles.findOne({guildID: message.guild.id, userID: message.member.id})
                if(!dbUser || (dbUser && dbUser.roles.length == 0)) return crossText(`У вас нет доступных ролей для выдачи`, message)
                var dbUserRoles = dbUser.roles
                let allValues = []
                needUpdate = false

                var selectMenu = (state) => {
                    let selectMenu = new Discord.MessageSelectMenu()
                    .setCustomId('select_menu')
                    .setDisabled(state || false)
                    .setPlaceholder('Выберите роль(-и)')
                    .setMinValues(0)
                    .setMaxValues(dbUserRoles.length)
                    
                    dbUserRoles.forEach(role => {
                        let findRole = message.guild.roles.cache.get(role)
                        if(!findRole) return
                        selectMenu.addOptions({
                            label: `${findRole.name}`,
                            value: `${findRole.id}`,
                            default: mentuser.roles.cache.has(findRole.id)
                        })
                        allValues.push(findRole.id)
                    });

                    return [selectMenu]
                }
                var selectMenuAction = (state) => {
                    let action = new Discord.MessageActionRow().addComponents(selectMenu(state))
                    return action
                };

                // let embedCreate = async () => {
                //     dbUserRoles = dbUser.roles
                //     let embed = new Discord.MessageEmbed()
                //     .setDescription(`*Нужно придумать какой-то текст сюда, так как это поле не может быть пустым*`)
                //     .setTitle(`Список ролей, которые вы можете выдать ${mentuser.displayName}`)
                //     .setColor(noColor())
                //     .setThumbnail(mentuser.user.displayAvatarURL({size: 2048, format: "png"}))

                //     return embed
                // }

                let initMessage = await message.reply({
                    content: `Выберите роль(-и), которые хотите выдать или забрать у выбранного пользователя`,
                    //embeds: [await embedCreate()],
                    components: [selectMenuAction()]
                })

                const channelFilter = (m) => m.author.id === message.member.id
                const chooseEventCollector = initMessage.createMessageComponentCollector({channelFilter, time: 300000, errors: ['time']})
                chooseEventCollector.on('collect', async i => {
                    if(i.member.id != message.member.id) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                    allValues.forEach((val) => {
                        if(i.values.includes(val)){
                            mentuser.roles.add(val)
                        } else {
                            mentuser.roles.remove(val)
                        }
                    })
            
                    i.deferUpdate()
                })
            }
    
        }catch(err){
            console.error(chalk.redBright(err.stack))
            console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
        }
    }
}