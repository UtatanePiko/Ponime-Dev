const chalk = require('chalk')

module.exports = {
    name: "event",
    description: "Описание команд",
    aliases: ["ивент"],
    run: async (bot, message, args) => {

        try{

            const Discord = require('discord.js')
            const sheduledModels = require('../../models/sheduledModels')
            const mongoose = require("mongoose")
            const { Embeds, crossText, noPerms, checkmarkText, noColorEmbed } = require('../../functions/Embed') 
            const { YES_NO_BUTTONS, CHANGE_OR_NOT_BUTTONS, ARROWS_AND_BACK_BUTTONS } = require('../../functions/Buttons')
            const { noColor, botColorMessage } = require('../../functions/Colours')
            const Util  = require('../../functions/Util')
            const cross = Util.findEmoji("cross4") 
            const checkmark = Util.findEmoji("text_yes")
            const coin = Util.findEmoji('CHPOKI_COIN')
            const prefix = bot.server.get(message.guild.id).prefix
            const Events = require('../../models/events')
            
            let eventRole = message.guild.roles.cache.find(r => r.name.includes('Ивент-менеджер'))
            let moderRole = message.guild.roles.cache.find(r => r.id == `915116241071529995` || r.id == `803053033259794482`)
            if(Util.checkPerm(message.member, "MANAGE_ROLES")
            && !(eventRole && message.member.roles.cache.has(eventRole.id))
            && !(moderRole && message.member.roles.cache.has(moderRole.id))
            && message.member.id != "329462919676821504") return noPerms(message)

            if(args[0] == "help" || args[0] == "помощь"){
                const embed = new Embeds({
                    message: message,
                    description: `Управление ивентами сервера`,
                    embedTitle: "EVENT HELP-MENU",
                    embedColor: noColor(),
                    arguments: `● **\`${prefix}event <create/создать>\`**\n● **\`${prefix}event <list/лист>\`**\n● **\`${prefix}event chan <#channel/channelID>\`**`,
                    alternatives: `● **\`${prefix}event\`** | **\`${prefix}ивент\`**`,
                    examples: `● **\`${prefix}event create\`**\n● **\`${prefix}event list\`**\n● **\`${prefix}event chan 914360388580147211\`**`,
                    hints: `● **\`<>\`** - обязательно для заполнения`
                })
    
                return embed.help()
            }

            if(!args[0]) return crossText(`Не указано никаких аргументов\nИспользуйте **\`${message.content.split(" ")[0].toLowerCase()} help\`**, чтобы узнать возможные аргументы`, message)
            if((args[0]).toLowerCase() == "create" || (args[0]).toLowerCase() == "создать"){
                let declined = false, isActive = false, chan, title, desc, time, place, participation, isWinnersExist, isPrizePlacesExist, winnersAmount, winPlaces = [], winnersPrize, image, rules, roles
                let discordData
                const declineButton = (state) => {
                    let decline = new Discord.MessageButton()
                    .setCustomId('decline_button')
                    .setDisabled(state || false)
                    .setStyle("DANGER")
                    .setLabel('Отмена')
      
                    return decline
                }

                const components = (state) => [
                    new Discord.MessageActionRow().addComponents(declineButton(state)),
                ];

                let eventChannels = message.guild.channels.cache.filter(ch => ch.type == "GUILD_VOICE" &&
                (message.guild.channels.cache.get(ch.parentId).name.toLowerCase().includes("ивенты") || message.guild.channels.cache.get(ch.parentId).name.toLowerCase().includes("кинозал")))
                .sort(function (a, b) {
                    return a.rawPosition - b.rawPosition;
                })

                const channelSelect = (state) => {
                    let select = new Discord.MessageSelectMenu()
                    .setCustomId('channel_select')
                    .setDisabled(state || false)
                    .setMaxValues(1)
                    .setPlaceholder('Выберите войс')
    
                    eventChannels.forEach(chan => {
                        select.addOptions({
                            label: chan.name,
                            value: chan.id,
                        })
                    })
    
                    select.addOptions({
                        label: `❌ Отменить создание ивента ❌`,
                        value: 'decline'
                    })
    
                    return select
                }
    
                const components2 = (state) => [
                    new Discord.MessageActionRow().addComponents(channelSelect(state)),
                ];

                const YesNoDeclineButtons = (state) => {
                    let yes = new Discord.MessageButton()
                    .setCustomId('yes_button')
                    .setDisabled(state || false)
                    .setStyle("PRIMARY")
                    .setLabel('Да')

                    let no = new Discord.MessageButton()
                    .setCustomId('no_button')
                    .setDisabled(state || false)
                    .setStyle("PRIMARY")
                    .setLabel('Нет')

                    let decline = new Discord.MessageButton()
                    .setCustomId('decline_button')
                    .setDisabled(state || false)
                    .setStyle("DANGER")
                    .setLabel('Отмена')
      
                    return [yes, no, decline]
                }
    
                const components3 = (state) => [
                    new Discord.MessageActionRow().addComponents(YesNoDeclineButtons(state)),
                ];

                const OneTwoThreeDeclineButtons = (state) => {
                    let one = new Discord.MessageButton()
                    .setCustomId('one_button')
                    .setDisabled(state || false)
                    .setStyle("PRIMARY")
                    .setEmoji("1️⃣")

                    let two = new Discord.MessageButton()
                    .setCustomId('two_button')
                    .setDisabled(state || false)
                    .setStyle("PRIMARY")
                    .setEmoji("2️⃣")

                    let three = new Discord.MessageButton()
                    .setCustomId('three_button')
                    .setDisabled(state || false)
                    .setStyle("PRIMARY")
                    .setEmoji("3️⃣")

                    let decline = new Discord.MessageButton()
                    .setCustomId('decline_button')
                    .setDisabled(state || false)
                    .setStyle("DANGER")
                    .setLabel('Отмена')
      
                    return [one, two, three, decline]
                }
    
                const components4 = (state) => [
                    new Discord.MessageActionRow().addComponents(OneTwoThreeDeclineButtons(state)),
                ];

                const SkipDeclineButtons = (state) => {
                    let skip = new Discord.MessageButton()
                    .setCustomId('skip_button')
                    .setDisabled(state || false)
                    .setStyle("PRIMARY")
                    .setLabel('Пропустить')

                    let decline = new Discord.MessageButton()
                    .setCustomId('decline_button')
                    .setDisabled(state || false)
                    .setStyle("DANGER")
                    .setLabel('Отмена')
      
                    return [skip, decline]
                }
    
                const components5 = (state) => [
                    new Discord.MessageActionRow().addComponents(SkipDeclineButtons(state)),
                ];

                const publishDeclineButtons = (state, state2) => {
                    let publish = new Discord.MessageButton()
                    .setCustomId('publish_button')
                    .setDisabled(state || false)
                    .setStyle('SUCCESS')
                    .setLabel('Опубликовать')

                    let inList = new Discord.MessageButton()
                    .setCustomId('inlist_button')
                    .setDisabled(state2 || false)
                    .setStyle("PRIMARY")
                    .setLabel('В шаблоны')

                    let decline = new Discord.MessageButton()
                    .setCustomId('decline_button')
                    .setDisabled(state || false)
                    .setStyle("DANGER")
                    .setLabel('Отмена')
      
                    return [publish, inList, decline]
                }
    
                const components6 = (state, state2) => {
                    let action = new Discord.MessageActionRow().addComponents(publishDeclineButtons(state, state2))
                    return action
                }

                const rulesButton = (state) => {
                    let rulesButton = new Discord.MessageButton()
                    .setLabel('Правила')
                    .setStyle("LINK")
                    .setDisabled(state || false)
                    .setURL(rules)

                    return [rulesButton]
                }

                const rulesButtonAction = (state) => {
                    let action = new Discord.MessageActionRow().addComponents(rulesButton(state))
                    return action
                }

                const publishChannelSelect = (state) => {
                    let select = new Discord.MessageSelectMenu()
                    .setCustomId('channel_select')
                    .setDisabled(state || false)
                    .setMaxValues(1)
                    .setPlaceholder('Выберите канал публикациии')

                    let eventChans = bot.server.get(message.guild.id).event_channels
    
                    eventChans.forEach(chan => {
                        let findChan = message.guild.channels.cache.get(chan)
                        if(!findChan) return
                        select.addOptions({
                            label: findChan.name,
                            value: findChan.id,
                        })
                    })
    
                    return select
                }
    
                const publishChannelSelectAction = (state) => [
                    new Discord.MessageActionRow().addComponents(publishChannelSelect(state)),
                ];

                //Канал публикации
                let channelEmbed = new Discord.MessageEmbed()
                .setTitle(`🛠️ Создание ивента 🛠️`)
                .setColor("#2F3136")
                .setDescription(`Выберите канал, в котором будет опубликован ивент`)
                const channelFilter = (m) => m.author.id === message.member.id
                let chanMsg = await message.reply({embeds: [channelEmbed], components: publishChannelSelectAction()}) 
                const chanCollector = chanMsg.createMessageComponentCollector({channelFilter, time: 60000, errors: ['time']})

                chanCollector.on('collect', async i => {
                    if (i.member.id != message.member.id) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                    if(i.values[0] == "decline"){
                        declined = true
                        chanCollector.stop()
                    } else {
                        chan = i.values[0]
                        chanCollector.stop()
                    }
                    i.deferUpdate()
                })

                chanCollector.on('end', async collected => {
                    if(declined) return crossText(`Создание ивента было отменено вручную`, message)
                    if(collected.map(c => c.content).length == 0) return crossText(`Никакого аргумента не было указано в течение 1 минуты. Создание ивента было отменено`, chanMsg)
                    if(isActive) return crossText(`Не было введено подходящего варианта за 1 минуту. Создание ивента было отменено`, message)


                    // Тайтл ивента
                    let titleEmbed = new Discord.MessageEmbed()
                    .setTitle(`🛠️ Создание ивента 🛠️`)
                    .setColor("#2F3136")
                    .setDescription(`Введите тайтл ивента\nПросьба не использовать кастомные эмодзи, так как они не могут отобразиться в мероприятиях сервера`)
                    const channelFilter = (m) => m.author.id === message.member.id
                    let titleMsg = await message.reply({embeds: [titleEmbed], components: components()}) 
                    const titleCollector = message.channel.createMessageCollector({channelFilter, time: 60000, errors: ['time']})
                    const declineTitleCollector = titleMsg.createMessageComponentCollector({channelFilter, time: 60000, errors: ['time']})

                    declineTitleCollector.on('collect', async i => {
                        if (i.member.id != message.member.id) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                        declined = true
                        titleCollector.stop()
                        declineTitleCollector.stop()
                        i.deferUpdate()
                    })
                    declineTitleCollector.on('end', async i => {
                        titleMsg.edit({components: components(true)})
                    })
                    
                    titleCollector.on('collect', async(msg) => {
                        isActive = true
                        if(msg.author.id !== message.author.id) return
                        if(msg.author.bot) return

                        title = msg.content
                        if(!title) return crossText (`Сообщение пустое`, msg)
                        msg.react(checkmark)
                        isActive = false
                        titleCollector.stop()
                    })

                    titleCollector.on('end', async collected => {
                        if(declined) return crossText(`Создание ивента было отменено вручную`, message)
                        if(collected.map(c => c.content).length == 0) return crossText(`Никакого аргумента не было указано в течение 1 минуты. Создание ивента было отменено`, titleMsg)
                        if(isActive) return crossText(`Не было введено подходящего варианта за 1 минуту. Создание ивента было отменено`, message)

                        // Описание ивента/сообщение
                        let descEmbed = new Discord.MessageEmbed()
                        .setTitle(`🛠️ Создание ивента 🛠️`)
                        .setColor("#2F3136")
                        .setDescription(`Введите описание ивента`)
                        const channelFilter = (m) => m.author.id === message.member.id
                        let descMsg = await message.reply({embeds: [descEmbed], components: components()}) 
                        const descCollector = message.channel.createMessageCollector({channelFilter, time: 60000 * 5, errors: ['time']})
                        const declineDescCollector = descMsg.createMessageComponentCollector({channelFilter, time: 60000 * 5, errors: ['time']})
                        declineTitleCollector.stop()

                        declineDescCollector.on('collect', async i => {
                            if (i.member.id != message.member.id) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                            declined = true
                            descCollector.stop()
                            declineDescCollector.stop()
                            i.deferUpdate()
                        })
                        declineDescCollector.on('end', async i => {
                            descMsg.edit({components: components(true)})
                        })
                        
                        descCollector.on('collect', async(msg) => {
                            isActive = true
                            if(msg.author.id !== message.author.id) return
                            if(msg.author.bot) return

                            desc = msg.content
                            if(!desc) return crossText (`Сообщение пустое`, msg)
                            msg.react(checkmark)
                            isActive = false
                            descCollector.stop()
                        })

                        descCollector.on('end', async collected => {
                            if(declined) return crossText(`Создание ивента было отменено вручную`, message)
                            if(collected.map(c => c.content).length == 0) return crossText(`Никакого аргумента не было указано в течение 1 минуты. Создание ивента было отменено`, descMsg)
                            if(isActive) return crossText(`Не было введено подходящего варианта за 5 минут. Создание ивента было отменено`, message)

                            // Время проведения
                            let timeEmbed = new Discord.MessageEmbed()
                            .setTitle(`🛠️ Создание ивента 🛠️`)
                            .setColor("#2F3136")
                            .setDescription(`Введите время проведения ивента в формате \`ЧЧ:ММ\` (Напр.: \`20:00\`)\nЕсли ивент состоится не сегодня, то введите время проведения в полном формате \`дд.мм.гггг ЧЧ:ММ\` (Напр.: \`13.06.2022 20:00\`)`)
                            const channelFilter = (m) => m.author.id === message.member.id
                            let timeMsg = await message.reply({embeds: [timeEmbed], components: components()}) 
                            const timeCollector = message.channel.createMessageCollector({channelFilter, time: 60000, errors: ['time']})
                            const declineTimeCollector = timeMsg.createMessageComponentCollector({channelFilter, time: 60000, errors: ['time']})
                            declineDescCollector.stop()
    
                            declineTimeCollector.on('collect', async i => {
                                if (i.member.id != message.member.id) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                                declined = true
                                timeCollector.stop()
                                declineTimeCollector.stop()
                                i.deferUpdate()
                            })
                            declineTimeCollector.on('end', async i => {
                                timeMsg.edit({components: components(true)})
                            })
                            
                            timeCollector.on('collect', async(msg) => {
                                isActive = true
                                if(msg.author.id !== message.author.id) return
                                if(msg.author.bot) return
    
                                function stringToDateFull(_date, _format, _format2){
                                    if(_date.includes("+") || _date.includes("-")) return
                                    _date = _date.split(" ")
                        
                                    var formatLowerCase = _format.toLowerCase();
                                    var formatItems = formatLowerCase.split('.');
                                    var dateItems = _date[0].split('.');
                                    var monthIndex = formatItems.indexOf("mm");
                                    var dayIndex = formatItems.indexOf("dd");
                                    var yearIndex = formatItems.indexOf("yyyy");
                                    var month = parseInt(dateItems[monthIndex]) - 1;
                                    var day = parseInt(dateItems[dayIndex]);
                        
                                    var format2LowerCase = _format2.toLowerCase();
                                    var format2Items = format2LowerCase.split(':');
                                    var date2Items = _date[1].split(':');
                                    var hoursItems = format2Items.indexOf("hh")
                                    var minutesItems = format2Items.indexOf("mm")
                                    var hours = parseInt(date2Items[hoursItems]) 
                                    var minutes = parseInt(date2Items[minutesItems])
                    
                                    if(day > 31 || month > 11 || hours > 23 || minutes > 59) return
                        
                                    var formatedDate = new Date(dateItems[yearIndex], month, day, hours, minutes);
                                    return formatedDate;
                                }
                    
                                function stringToDateTime(_date, _format){
                                    let now = new Date()
                                    console.log(now.getHours(), now.getDate())
                                    if(_date.includes("+") || _date.includes("-")) return
                        
                                    var formatLowerCase = _format.toLowerCase();
                                    var formatItems = formatLowerCase.split(':');
                                    var dateItems = _date.split(':');
                                    var hoursItems = formatItems.indexOf("hh")
                                    var minutesItems = formatItems.indexOf("mm")
                                    var hours = parseInt(dateItems[hoursItems]) 
                                    var minutes = parseInt(dateItems[minutesItems])
                    
                                    if(hours > 23 || minutes > 59) return
                        
                                    var formatedDate = new Date(now.getFullYear(), now.getMonth(), now.getHours() >= 21 && now.getTimezoneOffset() == 0 >= 21 ? now.getDate() + 1 : now.getDate(), hours, minutes);
                                    return formatedDate;
                                }
                    
                                let data
                                let now = new Date()
                    
                                if(msg.content.split(" ").length == 2){
                                    data = stringToDateFull(`${msg.content}`,"dd.mm.yyyy", "HH:MM")
                                } else if (msg.content.split(" ").length == 1){
                                    data = stringToDateTime(`${msg.content}`,"HH:MM")
                                } else {
                                    crossText(`Дата или время не является правильной, введите снова`, msg)
                                }
                    
                                if(!Date.parse(data)) return crossText(`Дата или время не является правильной, введите снова`, msg)
                                if(Date.now() - (Date.parse(`${data}Z`) - 1000 * 60 * 60 * 3) > -60000 * 10) return crossText(`Ивент не может начаться ранее, чем за 10 минут`, msg)
                                discordData = new Date(Date.parse(`${data}Z`) - 1000 * 60 * 60 * 3)
                                time = msg.content
                                msg.react(checkmark)
                                isActive = false
                                timeCollector.stop()
                            })
    
                            timeCollector.on('end', async collected => {
                                if(declined) return crossText(`Создание ивента было отменено вручную`, message)
                                if(collected.map(c => c.content).length == 0) return crossText(`Никакого аргумента не было указано в течение 1 минуты. Создание ивента было отменено`, timeMsg)
                                if(isActive) return crossText(`Не было введено подходящего варианта за 1 минуту. Создание ивента было отменено`, message)

                                // Картинка ивента
                                let imageEmbed = new Discord.MessageEmbed()
                                .setTitle(`🛠️ Создание ивента 🛠️`)
                                .setColor("#2F3136")
                                .setDescription(`Будет ли у ивента картинка в сообщении?\nЕсли да, то скиньте ее сюда`)
                                const channelFilter = (m) => m.author.id === message.member.id
                                let imageMsg = await message.reply({embeds: [imageEmbed], components: components5()}) 
                                const imageCollector = message.channel.createMessageCollector({channelFilter, time: 60000, errors: ['time']})
                                const skipDeclineTimeCollector = imageMsg.createMessageComponentCollector({channelFilter, time: 60000, errors: ['time']})
                                declineTimeCollector.stop()

                                skipDeclineTimeCollector.on('collect', async i => {
                                    if (i.member.id != message.member.id) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                                    if(i.customId == "decline_button"){
                                        declined = true
                                        imageCollector.stop()
                                        skipDeclineTimeCollector.stop()
                                    } else {
                                        image = false
                                        isActive = false
                                        imageCollector.stop()
                                        skipDeclineTimeCollector.stop()
                                    }
                                    i.deferUpdate()
                                })
                                skipDeclineTimeCollector.on('end', async i => {
                                    imageMsg.edit({components: components5(true)})
                                })

                                imageCollector.on('collect', async msg => {
                                    isActive = true
                                    if(msg.author.id !== message.author.id) return
                                    if(msg.author.bot) return
        
                                    if(msg.attachments.size == 0) {
                                        crossText(`Не было найдено картинки в вашем сообщении`, msg)
                                    } else {
                                        let attach = await msg.attachments.first().attachment
                                        await bot.guilds.cache.get("914124553960194059").channels.cache.get('985644709152182312').send({
                                            files: [attach]
                                        }).then(async msg2 => {
                                            image = msg2.attachments.first().attachment
                                        })
                                        msg.react(checkmark)
                                        isActive = false
                                        imageCollector.stop()
                                    }
                                })

                                imageCollector.on('end', async collected => {
                                    imageMsg.edit({components: components5(true)})
                                    if(declined) return crossText(`Создание ивента было отменено вручную`, message)
                                    if(collected.map(c => c.content).length == 0 && image != false) return crossText(`Никакого аргумента не было указано в течение 1 минуты. Создание ивента было отменено`, imageMsg)
                                    if(isActive) return crossText(`Не было скинуто подходящего варианта за 1 минуту. Создание ивента было отменено`, message)
    

                                    // Правила ивента
                                    let rulesEmbed = new Discord.MessageEmbed()
                                    .setTitle(`🛠️ Создание ивента 🛠️`)
                                    .setColor("#2F3136")
                                    .setDescription(`Укажите ссылку на правила ивента или же пропустите этот пункт`)
                                    const channelFilter = (m) => m.author.id === message.member.id
                                    let rulesMsg = await message.reply({embeds: [rulesEmbed], components: components5()}) 
                                    const rulesCollector = message.channel.createMessageCollector({channelFilter, time: 60000, errors: ['time']})
                                    const skipDeclineRulesCollector = rulesMsg.createMessageComponentCollector({channelFilter, time: 60000, errors: ['time']})
                                    declineTimeCollector.stop()
    
                                    skipDeclineRulesCollector.on('collect', async i => {
                                        if (i.member.id != message.member.id) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                                        if(i.customId == "decline_button"){
                                            declined = true
                                            rulesCollector.stop()
                                            skipDeclineRulesCollector.stop()
                                        } else {
                                            rules = ""
                                            isActive = false
                                            rulesCollector.stop()
                                            skipDeclineRulesCollector.stop()
                                        }
                                        i.deferUpdate()
                                    })
                                    skipDeclineRulesCollector.on('end', async i => {
                                        rulesMsg.edit({components: components5(true)})
                                    })
    
                                    rulesCollector.on('collect', async msg => {
                                        isActive = true
                                        if(msg.author.id !== message.author.id) return
                                        if(msg.author.bot) return
                                        
                                        if(!msg.content.includes('https') && !msg.content.includes('http')) return crossText(`Сообщение должно являться ссылкой на правила`, msg)
                                        rules = msg.content
                                        msg.react(checkmark)
                                        isActive = false
                                        rulesCollector.stop()
                                    })
    
                                    rulesCollector.on('end', async collected => {
                                        rulesMsg.edit({components: components5(true)})
                                        if(declined) return crossText(`Создание ивента было отменено вручную`, message)
                                        if(collected.map(c => c.content).length == 0 && rules != false) return crossText(`Никакого аргумента не было указано в течение 1 минуты. Создание ивента было отменено`, rulesMsg)
                                        if(isActive) return crossText(`Не было отпралвено подходящего варианта за 1 минуту. Создание ивента было отменено`, message)

                                        // Место проведения
                                        let placeEmbed = new Discord.MessageEmbed()
                                        .setTitle(`🛠️ Создание ивента 🛠️`)
                                        .setColor("#2F3136")
                                        .setDescription(`Выберите войс в котором будет проводиться ивент\nКнопка отмены создания находится внизу списка`)
                                        const channelFilter = (m) => m.author.id === message.member.id
                                        let placeMsg = await message.reply({embeds: [placeEmbed], components: components2()}) 
                                        const placeCollector = placeMsg.createMessageComponentCollector({channelFilter, time: 60000, errors: ['time']})
                                        skipDeclineTimeCollector.stop()
                
                                        placeCollector.on('collect', async i => {
                                            if (i.member.id != message.member.id) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                                            if(i.values[0] == "decline"){
                                                declined = true
                                                placeCollector.stop()
                                            } else {
                                                place = i.values[0]
                                                placeCollector.stop()
                                            }
                                            i.deferUpdate()
                                        })
                                        placeCollector.on('end', async i => {
                                            placeMsg.edit({components: components2(true)})
                                            if(declined) return crossText(`Создание ивента было отменено вручную`, message)
                                            if(collected.length == 0) return crossText(`Никакого аргумента не было указано в течение 1 минуты. Создание ивента было отменено`, placeMsg)

                                            // Приз за участие             
                                            let partEmbed = new Discord.MessageEmbed()
                                            .setTitle(`🛠️ Создание ивента 🛠️`)
                                            .setColor("#2F3136")
                                            .setDescription(`Введите приз за участие\nНе надо использовать эмодзи койнов, оно будет добавлено автоматически`)
                                            const channelFilter = (m) => m.author.id === message.member.id
                                            let partMsg = await message.reply({embeds: [partEmbed], components: components()}) 
                                            const partCollector = message.channel.createMessageCollector({channelFilter, time: 60000, errors: ['time']})
                                            const declinePartCollector = partMsg.createMessageComponentCollector({channelFilter, time: 60000, errors: ['time']})
                                            placeCollector.stop()

                                            declinePartCollector.on('collect', async i => {
                                                if (i.member.id != message.member.id) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                                                declined = true
                                                partCollector.stop()
                                                declinePartCollector.stop()
                                                i.deferUpdate()
                                            })
                                            declinePartCollector.on('end', async i => {
                                                partMsg.edit({components: components(true)})
                                            })
                                            
                                            partCollector.on('collect', async(msg) => {
                                                isActive = true
                                                if(msg.author.id !== message.author.id) return
                                                if(msg.author.bot) return

                                                participation = msg.content
                                                if(!isFinite(participation) || participation % 1 !== 0 || participation <= 0 || participation.includes("+")  || participation.includes(".")) return crossText(`Приз за участие должен быть целым положительным числом`, msg)
                                                msg.react(checkmark)
                                                isActive = false
                                                partCollector.stop()
                                            })

                                            partCollector.on('end', async collected => {
                                                if(declined) return crossText(`Создание ивента было отменено вручную`, message)
                                                if(collected.map(c => c.content).length == 0) return crossText(`Никакого аргумента не было указано в течение 1 минуты. Создание ивента было отменено`, partMsg)
                                                if(isActive) return crossText(`Не было введено подходящего варианта за 1 минуту. Создание ивента было отменено`, message)

                                                // Есть ли победители?
                                                let isWinnersExistsEmbed = new Discord.MessageEmbed()
                                                .setTitle(`🛠️ Создание ивента 🛠️`)
                                                .setColor("#2F3136")
                                                .setDescription(`Будут ли победители в ивенте?`)
                                                const channelFilter = (m) => m.author.id === message.member.id
                                                let isWinnersExistsMsg = await message.reply({embeds: [isWinnersExistsEmbed], components: components3()}) 
                                                const isWinnersExistsCollector = isWinnersExistsMsg.createMessageComponentCollector({channelFilter, time: 60000, errors: ['time']})
                                                declineTimeCollector.stop()
                        
                                                isWinnersExistsCollector.on('collect', async i => {
                                                    if (i.member.id != message.member.id) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                                                    if(i.customId == "decline_button"){
                                                        declined = true
                                                        isWinnersExistsCollector.stop()
                                                    } else if (i.customId == "yes_button"){
                                                        isWinnersExist = true
                                                        isWinnersExistsCollector.stop()
                                                    } else {
                                                        isWinnersExist = false
                                                        isWinnersExistsCollector.stop()
                                                    }
                                                    i.deferUpdate()
                                                })
                                                isWinnersExistsCollector.on('end', async i => {
                                                    isWinnersExistsMsg.edit({components: components3(true)})
                                                    if(declined) return crossText(`Создание ивента было отменено вручную`, message)
                                                    if(collected.length == 0) return crossText(`Никакого аргумента не было указано в течение 1 минуты. Создание ивента было отменено`, isWinnersExistsMsg)

                                                    // Если победители в ивенте все же есть
                                                    if(isWinnersExist){
                                                        // Есть ли призовые места?
                                                        let isPrizePlacesExistsEmbed = new Discord.MessageEmbed()
                                                        .setTitle(`🛠️ Создание ивента 🛠️`)
                                                        .setColor("#2F3136")
                                                        .setDescription(`Есть ли призовые места в ивенте?`)
                                                        const channelFilter = (m) => m.author.id === message.member.id
                                                        let isPrizePlacesExistsMsg = await message.reply({embeds: [isPrizePlacesExistsEmbed], components: components3()}) 
                                                        const isPrizePlacesExistsCollector = isPrizePlacesExistsMsg.createMessageComponentCollector({channelFilter, time: 60000, errors: ['time']})
                                                        isWinnersExistsCollector.stop()
                                
                                                        isPrizePlacesExistsCollector.on('collect', async i => {
                                                            if (i.member.id != message.member.id) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                                                            if(i.customId == "decline_button"){
                                                                declined = true
                                                                isPrizePlacesExistsCollector.stop()
                                                            } else if (i.customId == "yes_button"){
                                                                isPrizePlacesExist = true
                                                                isPrizePlacesExistsCollector.stop()
                                                            } else{
                                                                isPrizePlacesExist = false
                                                                isPrizePlacesExistsCollector.stop()
                                                            }
                                                            i.deferUpdate()
                                                        })
                                                        isPrizePlacesExistsCollector.on('end', async i => {
                                                            isPrizePlacesExistsMsg.edit({components: components3(true)})
                                                            if(declined) return crossText(`Создание ивента было отменено вручную`, message)
                                                            if(collected.length == 0) return crossText(`Никакого аргумента не было указано в течение 1 минуты. Создание ивента было отменено`, isPrizePlacesExistsMsg)

                                                            if(isPrizePlacesExist){
                                                                // Сколько призовых мест
                                                                let winnersAmountEmbed = new Discord.MessageEmbed()
                                                                .setTitle(`🛠️ Создание ивента 🛠️`)
                                                                .setColor("#2F3136")
                                                                .setDescription(`Сколько всего будет призовых мест? (Максимум 3)`)
                                                                const channelFilter = (m) => m.author.id === message.member.id
                                                                let winnersAmountMsg = await message.reply({embeds: [winnersAmountEmbed], components: components4()}) 
                                                                const winnersAmountCollector = winnersAmountMsg.createMessageComponentCollector({channelFilter, time: 60000, errors: ['time']})
                                                                isPrizePlacesExistsCollector.stop()
                                        
                                                                winnersAmountCollector.on('collect', async i => {
                                                                    if (i.member.id != message.member.id) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                                                                    if(i.customId == "decline_button"){
                                                                        declined = true
                                                                        winnersAmountCollector.stop()
                                                                    } else if (i.customId == "one_button"){
                                                                        winnersAmount = 1
                                                                        winnersAmountCollector.stop()
                                                                    } else if (i.customId == "two_button"){
                                                                        winnersAmount = 2
                                                                        winnersAmountCollector.stop()
                                                                    } else {
                                                                        winnersAmount = 3
                                                                        winnersAmountCollector.stop()
                                                                    }
                                                                    i.deferUpdate()
                                                                })

                                                                winnersAmountCollector.on('end', async i => {
                                                                    winnersAmountMsg.edit({components: components4(true)})
                                                                    if(declined) return crossText(`Создание ивента было отменено вручную`, message)
                                                                    if(collected.length == 0) return crossText(`Никакого аргумента не было указано в течение 1 минуты. Создание ивента было отменено`, winnersAmountMsg)
                
                                                                    // Введение призов за места
                                                                    var i = 0
                                                                    let winPlacesEmbed = new Discord.MessageEmbed()
                                                                    .setColor(noColor())
                                                                    .setDescription(`Укажите победные места (**${winnersAmount}**), отправляя их поочередно`)
                                                                    let winPlacesMsg = await message.reply({ embeds: [winPlacesEmbed], components: components()}) 
                                                                    const channelFilter = (m) => m.author.id === message.author.id
                                                                    const winPlacesCollector = message.channel.createMessageCollector({channelFilter, time: 60000 * 2, errors: ['time']})
                                                                    const declineWinPlacesCollector = winPlacesMsg.createMessageComponentCollector({channelFilter, time: 60000 * 2, errors: ['time']})
                                                                    
                                                                    declineWinPlacesCollector.on('collect', async i => {
                                                                        if (i.member.id != message.member.id) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                                                                        declined = true
                                                                        winPlacesCollector.stop()
                                                                        declineTimdeclineWinPlacesCollectorCollector.stop()
                                                                        i.deferUpdate()
                                                                    })
                                                                    declineWinPlacesCollector.on('end', async i => {
                                                                        timeMsg.edit({components: components(true)})
                                                                    })
                                                                    
                                                                    winPlacesCollector.on('collect', async(msg) => {
                                                                        isActive = false
                                                                        if(msg.author.id !== message.author.id) return
                                                                        if(msg.author.bot) return
                                                                        if(msg.content.toLowerCase() == "отмена") return winPlacesCollector.stop()

                                                                        var number = msg.content
                                                                        if(!isFinite(number) || number % 1 !== 0 || number <= 0 || number.includes("+")  || number.includes(".")) return crossText(`Призовое место должно быть целым положительным числом`, msg)

                                                                        msg.react(checkmark)
                                                                        i++
                                                                        winPlaces.push(`${msg.content}`)
                                                                        if(winnersAmount == 1) winnersPrize = `${msg.content}`
                                                                        if(winnersAmount == i) { isActive = false; await winPlacesCollector.stop()}
                                                                    })

                                                                    winPlacesCollector.on('end', async collected => {
                                                                        if(declined) return crossText(`Создание ивента было отменено вручную`, message)
                                                                        if(collected.map(c => c.content).length == 0) return crossText(`Никакого аргумента не было указано в течение 1 минуты. Создание ивента было отменено`, descMsg)
                                                                        if(isActive) return crossText(`Не было введено достаточно вариантов или подходящего за 2 минуты. Создание ивента было отменено`, message)
                                                                        winPlacesCollector.stop()

                                                                        let rolesEmbed = new Discord.MessageEmbed()
                                                                        .setTitle(`🛠️ Создание ивента 🛠️`)
                                                                        .setColor("#2F3136")
                                                                        .setDescription(`Введите самое верхнее сообщение перед эмбедом\nПредполагается упоминание ролей, которые должны получить оповещение об ивенте`)
                                                                        const channelFilter = (m) => m.author.id === message.member.id
                                                                        let rolesMsg = await message.reply({embeds: [rolesEmbed], components: components()}) 
                                                                        const rolesCollector = message.channel.createMessageCollector({channelFilter, time: 60000, errors: ['time']})
                                                                        const declineRolesCollector = rolesMsg.createMessageComponentCollector({channelFilter, time: 60000, errors: ['time']})
                                    
                                                                        declineRolesCollector.on('collect', async i => {
                                                                            if (i.member.id != message.member.id) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                                                                            declined = true
                                                                            rolesCollector.stop()
                                                                            declineRolesCollector.stop()
                                                                            i.deferUpdate()
                                                                        })
                                                                        declineRolesCollector.on('end', async i => {
                                                                            rolesMsg.edit({components: components(true)})
                                                                        })
                                                                        
                                                                        rolesCollector.on('collect', async(msg) => {
                                                                            isActive = true
                                                                            if(msg.author.id !== message.author.id) return
                                                                            if(msg.author.bot) return
                                    
                                                                            if(msg.content.includes('@everyone') || msg.content.includes('@here')) return crossText(`Нельзя использовать @everyone и @here в верхнем сообщении`, msg)
                                                                            roles = msg.content
                                                                            if(!roles) return crossText (`Сообщение пустое`, msg)
                                                                            msg.react(checkmark)
                                                                            isActive = false
                                                                            rolesCollector.stop()
                                                                        })
                                    
                                                                        rolesCollector.on('end', async collected => {
                                                                            if(declined) return crossText(`Создание ивента было отменено вручную`, message)
                                                                            if(collected.map(c => c.content).length == 0) return crossText(`Никакого аргумента не было указано в течение 1 минуты. Создание ивента было отменено`, rolesMsg)
                                                                            if(isActive) return crossText(`Не было введено подходящего варианта за 1 минуту. Создание ивента было отменено`, message)
                                                                            rolesCollector.stop()   

                                                                            let embedCreate = (preview) => {
                                                                                let embed = new Discord.MessageEmbed()
                                                                                //.setDescription(`${title}\n\`\`\`${desc}\`\`\`\n${rules ? `**● Ссылка на правила:** [клик](${rules})\n\n` : ""}**● Начало мероприятия:** ${time} по МСК\n\n**● Ведущий:** ${message.member}\n\n**● Место встречи:** <#${place}>\n\n**Награда**`)
                                                                                .setDescription(`${title}\n\`\`\`${desc}\`\`\`\n**● Начало мероприятия:** ${time} по МСК\n\n**● Ведущий:** ${message.member}\n\n**● Место встречи:** <#${place}>\n\n**Награда**`)
                                                                                .setColor(noColor())
                                                                                if(winnersAmount == 1){
                                                                                    embed.addField('Победителю', `${winnersPrize} ${coin}`, true)
                                                                                } else if(winnersAmount == 2){
                                                                                    embed.addField('Первое место', `${winPlaces[0]} ${coin}`, true)
                                                                                    embed.addField('Второе место', `${winPlaces[1]} ${coin}`, true)
                                                                                } else if(winnersAmount == 3){
                                                                                    embed.addField('Первое место', `${winPlaces[0]} ${coin}`, true)
                                                                                    embed.addField('Второе место', `${winPlaces[1]} ${coin}`, true)
                                                                                    embed.addField('Третье место', `${winPlaces[2]} ${coin}`, true)
                                                                                }
                                                                                embed.addField('Участие', `${participation} ${coin}`, winnersAmount == 1 ? true : false)
        
                                                                                if(image) embed.setImage(image)
                                                                                if(preview) embed.setFooter({text:`Это превью ивента`})
                                                                                return embed
                                                                            }
                                                                            let previewMsg = await message.channel.send({
                                                                                content: roles, 
                                                                                embeds: [embedCreate(true)], 
                                                                                components: rules && rules != 'false' ? [rulesButtonAction(), components6()] : [components6()]
                                                                            })
                                                                            const declinePublishCollector = previewMsg.createMessageComponentCollector({channelFilter, time: 300000, errors: ['time']})

                                                                            declinePublishCollector.on('collect', async i => {
                                                                                if(i.member.id != message.member.id) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                                                                                if(i.customId == 'decline_button'){
                                                                                    declinePublishCollector.stop()
                                                                                    previewMsg.edit({
                                                                                        components: rules && rules != 'false' ? [rulesButtonAction(), components6(true)] : [components6(true)]
                                                                                    })
                                                                                    crossText(`Создание ивента было отменено вручную`, message)
                                                                                    i.deferUpdate()
                                                                                } else if(i.customId == "publish_button") {
                                                                                    if(title.replace(/\*/g, "").replace(/\`/g, "").replace(/\_/g, "").length > 100) return await i.reply({content: `Тайтл ивента не может быть больше 100 символов\nЕсли вам кажется, что символов меньше, то кастомные эмодзи занимают 33 символа каждый из-за их уникального id и названия`, ephemeral: true})
                                                                                    let name
                                                                                    let nameEmbed = new Discord.MessageEmbed()
                                                                                    .setTitle(`🛠️ Создание ивента 🛠️`)
                                                                                    .setColor("#2F3136")
                                                                                    .setDescription(`Введите название ивента, которое будет отображаться во вкладке мероприятий сервера`)
                                                                                    const channelFilter = (m) => m.author.id === message.member.id
                                                                                    let nameEmbedMsg = await message.reply({embeds: [nameEmbed], components: components()}) 
                                                                                    const nameCollector = message.channel.createMessageCollector({channelFilter, time: 60000, errors: ['time']})

                                                                                    nameCollector.on('collect', msg => {
                                                                                        isActive = true
                                                                                        if(msg.author.id !== message.author.id) return
                                                                                        if(msg.author.bot) return
                                                
                                                                                        name = msg.content
                                                                                        if(!name) return crossText (`Сообщение пустое`, msg)
                                                                                        msg.react(checkmark)
                                                                                        isActive = false
                                                                                        nameCollector.stop()
                                                                                    })

                                                                                    nameCollector.on('end', async collected => {
                                                                                        if(collected.map(c => c.content).length == 0) return crossText(`Никакого аргумента не было указано в течение 1 минуты. Создание ивента было отменено`, rolesMsg)
                                                                                        if(isActive) return crossText(`Не было введено подходящего варианта за 1 минуту. Создание ивента было отменено`, message)
                                                                                        nameCollector.stop()
                                                                                        declinePublishCollector.stop()
                                                                                        previewMsg.edit({
                                                                                            components: rules && rules != 'false' ? [rulesButtonAction(), components6(true)] : [components6(true)]
                                                                                        })
                                                                                        let findChan = message.guild.channels.cache.get(chan)
                                                                                        findChan.send({content: roles, embeds: [embedCreate(false)]})
                                                                                        
                                                                                        message.guild.scheduledEvents.create({
                                                                                            name: name,
                                                                                            description: desc,
                                                                                            image: image ? image : null,
                                                                                            channel: place,
                                                                                            scheduledStartTime: discordData,
                                                                                            entityType: "VOICE",
                                                                                            privacyLevel: "GUILD_ONLY"
                                                                                        })
                                                                                        return message.channel.send({content: "Уведомление было успешно опубликовано!"})
                                                                                    })
                                                                                    i.deferUpdate()
                                                                                } else {
                                                                                    if(Util.checkPerm(message.member, "ADMINISTRATOR")) return i.reply({content: 'У вас недостаточно прав для сохранения ивентов в шаблоны', ephemeral: true})
                                                                                    let name
                    
                                                                                    previewMsg.edit({
                                                                                        components: rules && rules != 'false' ? [rulesButtonAction(), components6(false, true)] : [components6(false, true)]
                                                                                    })
                    
                                                                                    // Название шаблона ивента
                                                                                    let nameEmbed = new Discord.MessageEmbed()
                                                                                    .setTitle(`💾 Сохранение в шаблоны 💾`)
                                                                                    .setColor("#2F3136")
                                                                                    .setDescription(`Введите название шаблона ивента`)
                                                                                    const channelFilter = (m) => m.author.id === message.member.id
                                                                                    let nameMsg = await message.reply({
                                                                                        embeds: [nameEmbed],
                                                                                        //components: components()
                                                                                    }) 
                                                                                    const nameCollector = message.channel.createMessageCollector({channelFilter, time: 60000, errors: ['time']})
                                                                                    // const declineNameCollector = nameMsg.createMessageComponentCollector({channelFilter, time: 60000, errors: ['time']})
                                    
                                                                                    // declineNameCollector.on('collect', async i => {
                                                                                    //     if (i.member.id != message.member.id) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                                                                                    //     declined = true
                                                                                    //     nameCollector.stop()
                                                                                    //     declineNameCollector.stop()
                                                                                    //     nameMsg.delete()
                                                                                    //     previewMsg.edit({components: components6(false, false)})
                                                                                    //     i.deferUpdate()
                                                                                    // })
                                                                                    // declineNameCollector.on('end', async i => {
                                                                                    //     nameMsg.edit({components: components(true)})
                                                                                    // })
                    
                                                                                    nameCollector.on('collect', async(msg) => {
                                                                                        isActive = true
                                                                                        if(msg.author.id !== message.author.id) return
                                                                                        if(msg.author.bot) return
                    
                                                                                        name = msg.content
                                                                                        if(!name) return crossText (`Сообщение пустое`, msg)
                                                                                        msg.react(checkmark)
                                                                                        isActive = false
                                                                                        nameCollector.stop()
                                                                                    })
                    
                                                                                    nameCollector.on('end', async collected => {
                                                                                        // if(declined) return
                                                                                        if(collected.map(c => c.content).length == 0){
                                                                                            nameMsg.delete()
                                                                                            previewMsg.edit({
                                                                                                components: rules && rules != 'false' ? [rulesButtonAction(), components6()] : [components6()]
                                                                                            })
                                                                                            return crossText(`Никакого аргумента не было указано в течение 1 минуты. Сохранение шаблона было отменено`, winnersPrizeMsg)
                                                                                        }
                                                                                        if(isActive){
                                                                                            nameMsg.delete()
                                                                                            previewMsg.edit({
                                                                                                components: rules && rules != 'false' ? [rulesButtonAction(), components6()] : [components6()]
                                                                                            })
                                                                                            return crossText(`Не было введено подходящего варианта за 1 минуту. Сохранение шаблона было отменено`, message)
                                                                                        }
                                                                                        previewMsg.edit({
                                                                                            components: rules && rules != 'false' ? [rulesButtonAction(), components6(false, true)] : [components6(false, true)]
                                                                                        })
                                                                                        previewMsg.reply({content: `Ивент был успешно сохранен в шаблоны под названием **${name}**`, ephemeral: true})
                                                                                        nameMsg.delete()
                    
                                                                                        let lastEventID = await Events.findOne().sort({"_id":-1}).limit(1)
                                                                                        let newEvent = new Events({
                                                                                            _id: mongoose.Types.ObjectId(),
                                                                                            guildID: message.guild.id,
                                                                                            ID: lastEventID ? lastEventID.ID + 1 : 1,
                                                                                            name: name,
                                                                                            userID: message.member.id,
                                                                                            chan: chan.id,
                                                                                            title: title,
                                                                                            desc: desc,
                                                                                            place: place,
                                                                                            participation: participation,
                                                                                            isPrizePlacesExist: true,
                                                                                            isWinnersExist: true,
                                                                                            winnersAmount: winnersAmount,
                                                                                            winPlaces: winPlaces,
                                                                                            winnersPrize: winnersAmount == 1 ? winnersPrize : null,
                                                                                            image: image,
                                                                                            roles: roles,
                                                                                            rules: rules
                                                                                        })
                        
                                                                                        newEvent.save().catch()
                                                                                    })
                                                                                    i.deferUpdate()
                                                                                }
                                                                            })
                                                                        })  
                                                                    })
                                                                })
                                                            } else {
                                                                // Приз победившему(-им), если нет призоывых мест
                                                                let partEmbed = new Discord.MessageEmbed()
                                                                .setTitle(`🛠️ Создание ивента 🛠️`)
                                                                .setColor("#2F3136")
                                                                .setDescription(`Введите приз за победу в ивенте\nНе надо использовать эмодзи койнов, оно будет добавлено автоматически`)
                                                                const channelFilter = (m) => m.author.id === message.member.id
                                                                let winnersPrizeMsg = await message.reply({embeds: [partEmbed], components: components()}) 
                                                                const winnersPrizeCollector = message.channel.createMessageCollector({channelFilter, time: 60000, errors: ['time']})
                                                                const declineWinnersPrizeCollector = winnersPrizeMsg.createMessageComponentCollector({channelFilter, time: 60000, errors: ['time']})
                            
                                                                declineWinnersPrizeCollector.on('collect', async i => {
                                                                    if (i.member.id != message.member.id) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                                                                    declined = true
                                                                    winnersPrizeCollector.stop()
                                                                    declineWinnersPrizeCollector.stop()
                                                                    i.deferUpdate()
                                                                })
                                                                declineWinnersPrizeCollector.on('end', async i => {
                                                                    winnersPrizeMsg.edit({components: components(true)})
                                                                })
                                                                
                                                                winnersPrizeCollector.on('collect', async(msg) => {
                                                                    isActive = true
                                                                    if(msg.author.id !== message.author.id) return
                                                                    if(msg.author.bot) return
                            
                                                                    winnersPrize = `${msg.content}`
                                                                    if(!isFinite(winnersPrize) || winnersPrize % 1 !== 0 || winnersPrize <= 0 || winnersPrize.includes("+")  || winnersPrize.includes(".")) return crossText(`Приз победившего(-их) должен быть целым положительным числом`, message)
                                                                    msg.react(checkmark)
                                                                    isActive = false
                                                                    winnersPrizeCollector.stop()
                                                                })
                            
                                                                winnersPrizeCollector.on('end', async collected => {
                                                                    if(declined) return crossText(`Создание ивента было отменено вручную`, message)
                                                                    if(collected.map(c => c.content).length == 0) return crossText(`Никакого аргумента не было указано в течение 1 минуты. Создание ивента было отменено`, winnersPrizeMsg)
                                                                    if(isActive) return crossText(`Не было введено подходящего варианта за 1 минуту. Создание ивента было отменено`, message)
                                                                    winnersPrizeCollector.stop()

                                                                    let rolesEmbed = new Discord.MessageEmbed()
                                                                    .setTitle(`🛠️ Создание ивента 🛠️`)
                                                                    .setColor("#2F3136")
                                                                    .setDescription(`Введите самое верхнее сообщение перед эмбедом\nПредполагается упоминание ролей, которые должны получить оповещение об ивенте`)
                                                                    const channelFilter = (m) => m.author.id === message.member.id
                                                                    let rolesMsg = await message.reply({embeds: [rolesEmbed], components: components()}) 
                                                                    const rolesCollector = message.channel.createMessageCollector({channelFilter, time: 60000, errors: ['time']})
                                                                    const declineRolesCollector = rolesMsg.createMessageComponentCollector({channelFilter, time: 60000, errors: ['time']})
                                
                                                                    declineRolesCollector.on('collect', async i => {
                                                                        if (i.member.id != message.member.id) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                                                                        declined = true
                                                                        rolesCollector.stop()
                                                                        declineRolesCollector.stop()
                                                                        i.deferUpdate()
                                                                    })
                                                                    declineRolesCollector.on('end', async i => {
                                                                        rolesMsg.edit({components: components(true)})
                                                                    })
                                                                    
                                                                    rolesCollector.on('collect', async(msg) => {
                                                                        isActive = true
                                                                        if(msg.author.id !== message.author.id) return
                                                                        if(msg.author.bot) return
                                
                                                                        if(msg.content.includes('@everyone') || msg.content.includes('@here')) return crossText(`Нельзя использовать @everyone и @here в верхнем сообщении`, msg)
                                                                        roles = msg.content
                                                                        if(!roles) return crossText (`Сообщение пустое`, msg)
                                                                        msg.react(checkmark)
                                                                        isActive = false
                                                                        rolesCollector.stop()
                                                                    })
                                
                                                                    rolesCollector.on('end', async collected => {
                                                                        if(declined) return crossText(`Создание ивента было отменено вручную`, message)
                                                                        if(collected.map(c => c.content).length == 0) return crossText(`Никакого аргумента не было указано в течение 1 минуты. Создание ивента было отменено`, rolesMsg)
                                                                        if(isActive) return crossText(`Не было введено подходящего варианта за 1 минуту. Создание ивента было отменено`, message)
                                                                        rolesCollector.stop()
                
                                                                        let embedCreate = (preview) => {
                                                                            let embed = new Discord.MessageEmbed()
                                                                            //.setDescription(`${title}\n\`\`\`${desc}\`\`\`\n${rules ? `**● Ссылка на правила:** [клик](${rules})\n\n` : ""}**● Начало мероприятия:** ${time} по МСК\n\n**● Ведущий:** ${message.member}\n\n**● Место встречи:** <#${place}>\n\n**Награда**`)
                                                                            .setDescription(`${title}\n\`\`\`${desc}\`\`\`\n**● Начало мероприятия:** ${time} по МСК\n\n**● Ведущий:** ${message.member}\n\n**● Место встречи:** <#${place}>\n\n**Награда**`)
                                                                            .setColor(noColor())
                                                                            embed.addField('Победителю', `${winnersPrize}  ${coin}`, true)
                                                                            embed.addField('Участие', `${participation} ${coin}`, true)

                                                                            if(image) embed.setImage(image)
                                                                            if(preview) embed.setFooter({text:`Это превью ивента`})
                                                                            return embed
                                                                        }
                                                                        let previewMsg = await message.channel.send({
                                                                            content: roles, 
                                                                            embeds: [embedCreate(true)], 
                                                                            components: rules && rules != 'false' ? [rulesButtonAction(), components6()] : [components6()]
                                                                        })
                                                                        const declinePublishCollector = previewMsg.createMessageComponentCollector({channelFilter, time: 300000, errors: ['time']})
                
                                                                        declinePublishCollector.on('collect', async i => {
                                                                            if(i.member.id != message.member.id) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                                                                            if(i.customId == 'decline_button'){
                                                                                declinePublishCollector.stop()
                                                                                previewMsg.edit({
                                                                                    components: rules && rules != 'false' ? [rulesButtonAction(), components6(true)] : [components6(true)]
                                                                                })
                                                                                crossText(`Создание ивента было отменено вручную`, message)
                                                                                i.deferUpdate()
                                                                            } else if (i.customId == 'publish_button') {
                                                                                if(title.replace(/\*/g, "").replace(/\`/g, "").replace(/\_/g, "").length > 100) return await i.reply({content: `Тайтл ивента не может быть больше 100 символов\nЕсли вам кажется, что символов меньше, то кастомные эмодзи занимают 33 символа каждый из-за их уникального id и названия`, ephemeral: true})
                                                                                
                                                                                let name
                                                                                let nameEmbed = new Discord.MessageEmbed()
                                                                                .setTitle(`🛠️ Создание ивента 🛠️`)
                                                                                .setColor("#2F3136")
                                                                                .setDescription(`Введите название ивента, которое будет отображаться во вкладке мероприятий сервера`)
                                                                                const channelFilter = (m) => m.author.id === message.member.id
                                                                                let nameEmbedMsg = await message.reply({embeds: [nameEmbed], components: components()}) 
                                                                                const nameCollector = message.channel.createMessageCollector({channelFilter, time: 60000, errors: ['time']})

                                                                                nameCollector.on('collect', msg => {
                                                                                    isActive = true
                                                                                    if(msg.author.id !== message.author.id) return
                                                                                    if(msg.author.bot) return
                                            
                                                                                    name = msg.content
                                                                                    if(!name) return crossText (`Сообщение пустое`, msg)
                                                                                    msg.react(checkmark)
                                                                                    isActive = false
                                                                                    nameCollector.stop()
                                                                                })

                                                                                nameCollector.on('end', async collected => {
                                                                                    if(collected.map(c => c.content).length == 0) return crossText(`Никакого аргумента не было указано в течение 1 минуты. Создание ивента было отменено`, rolesMsg)
                                                                                    if(isActive) return crossText(`Не было введено подходящего варианта за 1 минуту. Создание ивента было отменено`, message)
                                                                                    nameCollector.stop()
                                                                                    declinePublishCollector.stop()
                                                                                    previewMsg.edit({
                                                                                        components: rules && rules != 'false' ? [rulesButtonAction(), components6(true)] : [components6(true)]
                                                                                    })
                                                                                    let findChan = message.guild.channels.cache.get(chan)
                                                                                    findChan.send({content: roles, embeds: [embedCreate(false)]})
                                                                                    
                                                                                    message.guild.scheduledEvents.create({
                                                                                        name: name,
                                                                                        description: desc,
                                                                                        image: image ? image : null,
                                                                                        channel: place,
                                                                                        scheduledStartTime: discordData,
                                                                                        entityType: "VOICE",
                                                                                        privacyLevel: "GUILD_ONLY"
                                                                                    })
                                                                                    return message.channel.send({content: "Уведомление было успешно опубликовано!"})
                                                                                })
                                                                                i.deferUpdate()
                                                                            } else {
                                                                                if(Util.checkPerm(message.member, "ADMINISTRATOR")) return i.reply({content: 'У вас недостаточно прав для сохранения ивентов в шаблоны', ephemeral: true})
                                                                                let name
                
                                                                                previewMsg.edit({
                                                                                    components: rules && rules != 'false' ? [rulesButtonAction(), components6(false, true)] : [components6(false, true)]
                                                                                })
                
                                                                                // Название шаблона ивента
                                                                                let nameEmbed = new Discord.MessageEmbed()
                                                                                .setTitle(`💾 Сохранение в шаблоны 💾`)
                                                                                .setColor("#2F3136")
                                                                                .setDescription(`Введите название шаблона ивента`)
                                                                                const channelFilter = (m) => m.author.id === message.member.id
                                                                                let nameMsg = await message.reply({
                                                                                    embeds: [nameEmbed],
                                                                                    //components: components()
                                                                                }) 
                                                                                const nameCollector = message.channel.createMessageCollector({channelFilter, time: 60000, errors: ['time']})
                                                                                // const declineNameCollector = nameMsg.createMessageComponentCollector({channelFilter, time: 60000, errors: ['time']})
                                
                                                                                // declineNameCollector.on('collect', async i => {
                                                                                //     if (i.member.id != message.member.id) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                                                                                //     declined = true
                                                                                //     nameCollector.stop()
                                                                                //     declineNameCollector.stop()
                                                                                //     nameMsg.delete()
                                                                                //     previewMsg.edit({components: components6(false, false)})
                                                                                //     i.deferUpdate()
                                                                                // })
                                                                                // declineNameCollector.on('end', async i => {
                                                                                //     nameMsg.edit({components: components(true)})
                                                                                // })
                
                                                                                nameCollector.on('collect', async(msg) => {
                                                                                    isActive = true
                                                                                    if(msg.author.id !== message.author.id) return
                                                                                    if(msg.author.bot) return
                
                                                                                    name = msg.content
                                                                                    if(!name) return crossText (`Сообщение пустое`, msg)
                                                                                    msg.react(checkmark)
                                                                                    isActive = false
                                                                                    nameCollector.stop()
                                                                                })
                
                                                                                nameCollector.on('end', async collected => {
                                                                                    // if(declined) return
                                                                                    if(collected.map(c => c.content).length == 0){
                                                                                        nameMsg.delete()
                                                                                        previewMsg.edit({
                                                                                            components: rules && rules != 'false' ? [rulesButtonAction(), components6()] : [components6()]
                                                                                        })
                                                                                        return crossText(`Никакого аргумента не было указано в течение 1 минуты. Сохранение шаблона было отменено`, winnersPrizeMsg)
                                                                                    }
                                                                                    if(isActive){
                                                                                        nameMsg.delete()
                                                                                        previewMsg.edit({
                                                                                            components: rules && rules != 'false' ? [rulesButtonAction(), components6()] : [components6()]
                                                                                        })
                                                                                        return crossText(`Не было введено подходящего варианта за 1 минуту. Сохранение шаблона было отменено`, message)
                                                                                    }
                                                                                    previewMsg.edit({
                                                                                        components: rules && rules != 'false' ? [rulesButtonAction(), components6(false, true)] : [components6(false, true)]
                                                                                    })
                                                                                    previewMsg.reply({content: `Ивент был успешно сохранен в шаблоны под названием **${name}**`, ephemeral: true})
                                                                                    nameMsg.delete()
                
                                                                                    let lastEventID = await Events.findOne().sort({"_id":-1}).limit(1)
                                                                                    let newEvent = new Events({
                                                                                        _id: mongoose.Types.ObjectId(),
                                                                                        guildID: message.guild.id,
                                                                                        ID: lastEventID ? lastEventID.ID + 1 : 1,
                                                                                        name: name,
                                                                                        userID: message.member.id,
                                                                                        chan: chan.id,
                                                                                        title: title,
                                                                                        desc: desc,
                                                                                        place: place,
                                                                                        participation: participation,
                                                                                        winnersAmount: 1,
                                                                                        isPrizePlacesExist: false,
                                                                                        isWinnersExist: true,
                                                                                        winnersPrize: winnersPrize,
                                                                                        image: image,
                                                                                        roles: roles,
                                                                                        rules: rules
                                                                                    })
                    
                                                                                    newEvent.save().catch()
                                                                                })
                                                                                i.deferUpdate()
                                                                            }
                                                                        })
                                                                    })    
                                                                })                    
                                                            }
                                                        })
                                                    } else {
                                                        // Если нет победителей вовсе, переход к концу с указанием, какие роли упомянуть
                                                        let rolesEmbed = new Discord.MessageEmbed()
                                                        .setTitle(`🛠️ Создание ивента 🛠️`)
                                                        .setColor("#2F3136")
                                                        .setDescription(`Введите самое верхнее сообщение перед эмбедом\nПредполагается упоминание ролей, которые должны получить оповещение об ивенте`)
                                                        const channelFilter = (m) => m.author.id === message.member.id
                                                        let rolesMsg = await message.reply({embeds: [rolesEmbed], components: components()}) 
                                                        const rolesCollector = message.channel.createMessageCollector({channelFilter, time: 60000, errors: ['time']})
                                                        const declineRolesCollector = rolesMsg.createMessageComponentCollector({channelFilter, time: 60000, errors: ['time']})
                    
                                                        declineRolesCollector.on('collect', async i => {
                                                            if (i.member.id != message.member.id) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                                                            declined = true
                                                            rolesCollector.stop()
                                                            declineRolesCollector.stop()
                                                            i.deferUpdate()
                                                        })
                                                        declineRolesCollector.on('end', async i => {
                                                            rolesMsg.edit({components: components(true)})
                                                        })
                                                        
                                                        rolesCollector.on('collect', async(msg) => {
                                                            isActive = true
                                                            if(msg.author.id !== message.author.id) return
                                                            if(msg.author.bot) return
                    
                                                            if(msg.content.includes('@everyone') || msg.content.includes('@here')) return crossText(`Нельзя использовать @everyone и @here в верхнем сообщении`, msg)
                                                            roles = msg.content
                                                            if(!roles) return crossText (`Сообщение пустое`, msg)   
                                                            msg.react(checkmark)
                                                            isActive = false
                                                            rolesCollector.stop()
                                                        })
                    
                                                        rolesCollector.on('end', async collected => {
                                                            if(declined) return crossText(`Создание ивента было отменено вручную`, message)
                                                            if(collected.map(c => c.content).length == 0) return crossText(`Никакого аргумента не было указано в течение 1 минуты. Создание ивента было отменено`, rolesMsg)
                                                            if(isActive) return crossText(`Не было введено подходящего варианта за 1 минуту. Создание ивента было отменено`, message)
                                                            rolesCollector.stop()

                                                            let embedCreate = (preview) => {
                                                                let embed = new Discord.MessageEmbed()
                                                                //.setDescription(`${title}\n\`\`\`${desc}\`\`\`\n${rules ? `**● Ссылка на правила:** [клик](${rules})\n\n` : ""}**● Начало мероприятия:** ${time} по МСК\n\n**● Ведущий:** ${message.member}\n\n**● Место встречи:** <#${place}>\n\n**Награда**`)
                                                                .setDescription(`${title}\n\`\`\`${desc}\`\`\`\n**● Начало мероприятия:** ${time} по МСК\n\n**● Ведущий:** ${message.member}\n\n**● Место встречи:** <#${place}>\n\n**Награда**`)
                                                                .setColor(noColor())
                                                                .setFields(
                                                                    {name: 'Участие', value: `${participation} ${coin}`, inline: true},
                                                                )
                                                                if(image) embed.setImage(image)
                                                                if(preview) embed.setFooter({text:`Это превью ивента`})
                                                                return embed
                                                            }
                                                            console.log(rules)
                                                            let previewMsg = await message.channel.send({
                                                                content: roles, 
                                                                embeds: [embedCreate(true)], 
                                                                components: rules && rules != 'false' ? [rulesButtonAction(), components6()] : [components6()]
                                                            })
                                                            const declinePublishCollector = previewMsg.createMessageComponentCollector({channelFilter, time: 300000, errors: ['time']})

                                                            declinePublishCollector.on('collect', async i => {
                                                                if(i.member.id != message.member.id) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                                                                if(i.customId == 'decline_button'){
                                                                    declinePublishCollector.stop()
                                                                    previewMsg.edit({
                                                                        components: rules && rules != 'false' ? [rulesButtonAction(), components6(true, true)] : [components6(true, true)]
                                                                    })
                                                                    crossText(`Создание ивента было отменено вручную`, message)
                                                                    i.deferUpdate()
                                                                } else if (i.customId == 'publish_button') {
                                                                    if(title.replace(/\*/g, "").replace(/\`/g, "").replace(/\_/g, "").length > 100) return await i.reply({content: `Тайтл ивента не может быть больше 100 символов\nЕсли вам кажется, что символов меньше, то кастомные эмодзи занимают 33 символа каждый из-за их уникального id и названия`, ephemeral: true})
                                                                    let name
                                                                    let nameEmbed = new Discord.MessageEmbed()
                                                                    .setTitle(`🛠️ Создание ивента 🛠️`)
                                                                    .setColor("#2F3136")
                                                                    .setDescription(`Введите название ивента, которое будет отображаться во вкладке мероприятий сервера`)
                                                                    const channelFilter = (m) => m.author.id === message.member.id
                                                                    let nameEmbedMsg = await message.reply({embeds: [nameEmbed], components: components()}) 
                                                                    const nameCollector = message.channel.createMessageCollector({channelFilter, time: 60000, errors: ['time']})

                                                                    nameCollector.on('collect', msg => {
                                                                        isActive = true
                                                                        if(msg.author.id !== message.author.id) return
                                                                        if(msg.author.bot) return
                                
                                                                        name = msg.content
                                                                        if(!name) return crossText (`Сообщение пустое`, msg)
                                                                        msg.react(checkmark)
                                                                        isActive = false
                                                                        nameCollector.stop()
                                                                    })

                                                                    nameCollector.on('end', async collected => {
                                                                        if(collected.map(c => c.content).length == 0) return crossText(`Никакого аргумента не было указано в течение 1 минуты. Создание ивента было отменено`, rolesMsg)
                                                                        if(isActive) return crossText(`Не было введено подходящего варианта за 1 минуту. Создание ивента было отменено`, message)
                                                                        nameCollector.stop()
                                                                        declinePublishCollector.stop()
                                                                        previewMsg.edit({
                                                                            components: rules && rules != 'false' ? [rulesButtonAction(), components6(true)] : [components6(true)]
                                                                        })
                                                                        let findChan = message.guild.channels.cache.get(chan)
                                                                        findChan.send({content: roles, embeds: [embedCreate(false)]})
                                                                        
                                                                        message.guild.scheduledEvents.create({
                                                                            name: name,
                                                                            description: desc,
                                                                            image: image ? image : null,
                                                                            channel: place,
                                                                            scheduledStartTime: discordData,
                                                                            entityType: "VOICE",
                                                                            privacyLevel: "GUILD_ONLY"
                                                                        })
                                                                        return message.channel.send({content: "Уведомление было успешно опубликовано!"})
                                                                    })
                                                                    i.deferUpdate()
                                                                } else if (i.customId == 'inlist_button'){
                                                                    if(Util.checkPerm(message.member, "ADMINISTRATOR")) return i.reply({content: 'У вас недостаточно прав для сохранения ивентов в шаблоны', ephemeral: true})
                                                                    let name

                                                                    previewMsg.edit({
                                                                        components: rules && rules != 'false' ? [rulesButtonAction(), components6(false, true)] : [components6(false, true)]
                                                                    })

                                                                    // Название шаблона ивента
                                                                    let nameEmbed = new Discord.MessageEmbed()
                                                                    .setTitle(`💾 Сохранение в шаблоны 💾`)
                                                                    .setColor("#2F3136")
                                                                    .setDescription(`Введите название шаблона ивента`)
                                                                    const channelFilter = (m) => m.author.id === message.member.id
                                                                    let nameMsg = await message.reply({
                                                                        embeds: [nameEmbed],
                                                                        //components: components()
                                                                    }) 
                                                                    const nameCollector = message.channel.createMessageCollector({channelFilter, time: 60000, errors: ['time']})
                                                                    // const declineNameCollector = nameMsg.createMessageComponentCollector({channelFilter, time: 60000, errors: ['time']})
                    
                                                                    // declineNameCollector.on('collect', async i => {
                                                                    //     if (i.member.id != message.member.id) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                                                                    //     declined = true
                                                                    //     nameCollector.stop()
                                                                    //     declineNameCollector.stop()
                                                                    //     nameMsg.delete()
                                                                    //     previewMsg.edit({components: components6(false, false)})
                                                                    //     i.deferUpdate()
                                                                    // })
                                                                    // declineNameCollector.on('end', async i => {
                                                                    //     nameMsg.edit({components: components(true)})
                                                                    // })

                                                                    nameCollector.on('collect', async(msg) => {
                                                                        isActive = true
                                                                        if(msg.author.id !== message.author.id) return
                                                                        if(msg.author.bot) return

                                                                        name = msg.content
                                                                        if(!name) return crossText (`Сообщение пустое`, msg)
                                                                        msg.react(checkmark)
                                                                        isActive = false
                                                                        nameCollector.stop()
                                                                    })

                                                                    nameCollector.on('end', async collected => {
                                                                        // if(declined) return
                                                                        if(collected.map(c => c.content).length == 0){
                                                                            nameMsg.delete()
                                                                            previewMsg.edit({
                                                                                components: rules && rules != 'false' ? [rulesButtonAction(), components6()] : [components6()]
                                                                            })
                                                                            return crossText(`Никакого аргумента не было указано в течение 1 минуты. Сохранение шаблона было отменено`, winnersPrizeMsg)
                                                                        }
                                                                        if(isActive){
                                                                            nameMsg.delete()
                                                                            previewMsg.edit({
                                                                                components: rules && rules != 'false' ? [rulesButtonAction(), components6()] : [components6()]
                                                                            })
                                                                            return crossText(`Не было введено подходящего варианта за 1 минуту. Сохранение шаблона было отменено`, message)
                                                                        }
                                                                        previewMsg.edit({
                                                                            components: rules && rules != 'false' ? [rulesButtonAction(), components6(false, true)] : [components6(false, true)]
                                                                        })
                                                                        previewMsg.reply({content: `Ивент был успешно сохранен в шаблоны под названием **${name}**`, ephemeral: true})
                                                                        nameMsg.delete()

                                                                        let lastEventID = await Events.findOne().sort({"_id":-1}).limit(1)
                                                                        let newEvent = new Events({
                                                                            _id: mongoose.Types.ObjectId(),
                                                                            guildID: message.guild.id,
                                                                            ID: lastEventID ? lastEventID.ID + 1 : 1,
                                                                            name: name,
                                                                            userID: message.member.id,
                                                                            chan: chan.id,
                                                                            title: title,
                                                                            desc: desc,
                                                                            place: place,
                                                                            participation: participation,
                                                                            image: image,
                                                                            roles: roles,
                                                                            rules: rules
                                                                        })
        
                                                                        newEvent.save().catch()
                                                                    })
                                                                    i.deferUpdate()
                                                                }
                                                            })
                                                        })    
                                                    }
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })

            } else if((args[0]).toLowerCase() == "list" || (args[0]).toLowerCase() == "список" || (args[0]).toLowerCase() == "лист"){
                if(!message.channel.name.toLowerCase().includes('тест')) return
                let grabEvents = await Events.find({guildID: message.guild.id}).sort({ID: 1})
                let event, eventID, chan, title, desc, time, place, participation, isWinnersExist, isPrizePlacesExist, winnersAmount, winPlaces, winnersPrize, image, roles, rules

                const selectMenu = (state) => {
                    let selectMenu = new Discord.MessageSelectMenu()
                    .setCustomId('select_menu')
                    .setDisabled(state || false)
                    .setMaxValues(1)
                    .setPlaceholder('Выберите ивент')

                    if(grabEvents.length <= pg * 10){
                        for(i = pg * 10 - 10; i < grabEvents.length; i++){
                            let event = grabEvents[i]
                            selectMenu.addOptions({
                                label: `${event.name}`,
                                value: `${event.ID}`
                            })
                        }
                    } else {
                        for(i = pg * 10 - 10; i < pg * 10; i++){
                            let event = grabEvents[i]
                            selectMenu.addOptions({
                                label: `${event.name}`,
                                value: `${event.ID}`
                            })
                        }
                    }
                    return [selectMenu]
                }

                const action = (state) => {
                    let action = new Discord.MessageActionRow().addComponents(selectMenu(state))
                    return action
                }

                const left = Util.findEmoji('leftarrow')
                const right = Util.findEmoji('rightarrow')

                const defaultEmojis = {
                    previous: left,
                    next: right,
                };

                let pg = 1
                let page = Math.ceil(grabEvents.length / 10)

                const generateButtons = (state) => {
                    const checkState = (name) => {
                        if (["previous"].includes(name) &&
                            pg === 1)
                            return true;
                        if (["next"].includes(name) &&
                            pg >= page)
                            return true;
                        return false;
                    };
                    let names = ["previous", "next"];
                    return names.reduce((accumulator, name) => {
                        accumulator.push(new Discord.MessageButton()
                            .setEmoji(defaultEmojis[name])
                            .setCustomId(name)
                            .setDisabled(state || checkState(name))
                            .setStyle("PRIMARY"));
                        return accumulator;
                    }, []);
                };

                const arrowsAction = (state) => {
                    let action = new Discord.MessageActionRow().addComponents(generateButtons(state))
                    return action
                };

                const selectRedactionMenu = (state) => {
                    let selectMenu = new Discord.MessageSelectMenu()
                    .setCustomId('select_redaction_menu')
                    .setDisabled(state || false)
                    .setMaxValues(1)
                    .setPlaceholder('Выберите параметр для изменения')
                    .setOptions(
                        {
                            label: `Канал публикации`,
                            value: `chan`
                        },
                        {
                            label: `Тайтл`,
                            value: `title`
                        },
                        {
                            label: `Описание`,
                            value: `desc`
                        },
                        {
                            label: `Начало мероприятия`,
                            value: `time`
                        },
                        {
                            label: `Место встречи`,
                            value: `place`
                        },
                        {
                            label: `Награда за участие`,
                            value: `participation`
                        },
                        {
                            label: `Количество победителей`,
                            value: `winners_amount`
                        }
                    )

                    if(winnersAmount == 1){
                        selectMenu.addOptions({
                            label: `Награда за победу`,
                            value: `first_place`
                        })
                    } else if(winnersAmount == 2){
                        selectMenu.addOptions(
                            {
                                label: `Награда за первое место`,
                                value: `first_place`
                            },
                            {
                                label: `Награда за второе место`,
                                value: `second_place`
                            },
                        )
                    } else if(winnersAmount == 3){
                        selectMenu.addOptions(
                            {
                                label: `Награда за первое место`,
                                value: `first_place`
                            },
                            {
                                label: `Награда за второе место`,
                                value: `second_place`
                            },
                            {
                                label: `Награда за третье место`,
                                value: `third_place`
                            },
                        )
                    }
                    selectMenu.addOptions(
                        {
                            label: `Картинка`,
                            value: `image`
                        },
                        {
                            label: `Верхнее сообщение`,
                            value: `roles`
                        },
                        {
                            label: `Правила`,
                            value: `rules`
                        },
                    )

                    return [selectMenu]
                }
                const action2 = (state) => {
                    let action = new Discord.MessageActionRow().addComponents(selectRedactionMenu(state))
                    return action
                };

                const eventButtons = (state, state2) => {
                    let publishButton = new Discord.MessageButton()
                    .setLabel('Опубликовать')
                    .setStyle("SUCCESS")
                    .setCustomId('publish_button')
                    .setDisabled(state || false)

                    let saveButton = new Discord.MessageButton()
                    .setLabel('Сохранить')
                    .setStyle("PRIMARY")
                    .setCustomId('save_button')
                    .setDisabled(state2 || false)

                    let deleteButton = new Discord.MessageButton()
                    .setLabel('Удалить')
                    .setStyle("DANGER")
                    .setCustomId('delete_button')
                    .setDisabled(state || false)

                    let backButton = new Discord.MessageButton()
                    .setLabel('Назад')
                    .setStyle('PRIMARY')
                    .setCustomId('back_button')
                    .setDisabled(state || false)

                    return [publishButton, saveButton, deleteButton,backButton]
                }

                const eventButtonsAction = (state, state2) => {
                    let action = new Discord.MessageActionRow().addComponents(eventButtons(state,state2))
                    return action
                }

                const winnersAmountButtons = (state) => {
                    let zero = new Discord.MessageButton()
                    .setCustomId('zero_button')
                    .setDisabled(state || false)
                    .setStyle("PRIMARY")
                    .setEmoji("0️⃣")

                    let one = new Discord.MessageButton()
                    .setCustomId('one_button')
                    .setDisabled(state || false)
                    .setStyle("PRIMARY")
                    .setEmoji("1️⃣")

                    let two = new Discord.MessageButton()
                    .setCustomId('two_button')
                    .setDisabled(state || false)
                    .setStyle("PRIMARY")
                    .setEmoji("2️⃣")

                    let three = new Discord.MessageButton()
                    .setCustomId('three_button')
                    .setDisabled(state || false)
                    .setStyle("PRIMARY")
                    .setEmoji("3️⃣")
      
                    return [zero, one, two, three]
                }
    
                const winnersAmountAction = (state) => {
                    let action = new Discord.MessageActionRow().addComponents(winnersAmountButtons(state))
                    return action
                }

                const backButton = (state) => {
                    let backButton = new Discord.MessageButton()
                    .setLabel('Назад')
                    .setStyle('PRIMARY')
                    .setCustomId('back_button2')
                    .setDisabled(state || false)

                    return [backButton]
                }

                const backButtonAction = (state) => {
                    let action = new Discord.MessageActionRow().addComponents(backButton(state))
                    return action
                }
                
                let eventChannels = message.guild.channels.cache.filter(ch => ch.type == "GUILD_VOICE" &&
                (message.guild.channels.cache.get(ch.parentId).name.toLowerCase().includes("ивенты") || message.guild.channels.cache.get(ch.parentId).name.toLowerCase().includes("кинозал")))

                const channelSelect = (state) => {
                    let select = new Discord.MessageSelectMenu()
                    .setCustomId('channel_select')
                    .setDisabled(state || false)
                    .setMaxValues(1)
                    .setPlaceholder('Выберите войс')
    
                    eventChannels.forEach(chan => {
                        select.addOptions({
                            label: chan.name,
                            value: chan.id,
                        })
                    })
    
                    return select
                }
    
                const channelSelectAction = (state) => {
                    let action = new Discord.MessageActionRow().addComponents(channelSelect(state))
                    return action
                }

                let eventChans = bot.server.get(message.guild.id).event_channels

                const channelSelect2 = (state) => {
                    let select = new Discord.MessageSelectMenu()
                    .setCustomId('publish_channel_select')
                    .setDisabled(state || false)
                    .setMaxValues(1)
                    .setPlaceholder('Выберите канал публикации')
    
                    eventChans.forEach(chan => {
                        let findChan = message.guild.channels.cache.get(chan)
                        if(!findChan) return
                        select.addOptions({
                            label: findChan.name,
                            value: findChan.id,
                        })
                    })
    
                    return select
                }
    
                const channelSelectAction2 = (state) => {
                    let action = new Discord.MessageActionRow().addComponents(channelSelect2(state))
                    return action
                }

                const rulesButton = (state) => {
                    let rulesButton = new Discord.MessageButton()
                    .setLabel('Правила')
                    .setStyle("LINK")
                    .setDisabled(state || false)
                    .setURL(rules)

                    return [rulesButton]
                }

                const rulesButtonAction = (state) => {
                    let action = new Discord.MessageActionRow().addComponents(rulesButton(state))
                    return action
                }

                
                // grabEvents.forEach(event => {
                //     embed.addField(`${event.title}`, `\`\`\`${event.desc}\`\`\``)
                // })

                const changeToMain = async (update) => {
                    if(grabEvents.length == 0){
                        let embed = new Discord.MessageEmbed()
                        .setTitle('Список шаблонов ивентов сервера')
                        .setColor(noColor())
                        .setDescription('Список шаблонов пуст')
                        .setThumbnail(message.guild.iconURL({size: 2048, format: "png", dynamic: true}))

                        return embed
                    } else {
                        needUpdate = false
                        if(update){
                            grabEvents = await Events.find({guildID: message.guild.id})
                            page = Math.ceil(grabEvents.length / 10)
                        }  
                        var text = ""
                        var end = pg * 10
                        var start = pg * 10 - 10
                        let embed = new Discord.MessageEmbed()
                        .setTitle('Список шаблонов ивентов сервера')
                        .setColor(noColor())
                        .setThumbnail(message.guild.iconURL({size: 2048, format: "png", dynamic: true}))
                        .setFooter({text: `Стр. ${pg} из ${page}`})
                        if(grabEvents.length <= end){
                            for(i = start; i < grabEvents.length; i++){ 
                                let event = grabEvents[i]
                                text = `${text}\n**${i + 1}. ${event.name}**`
                                embed.setDescription(text)
                                //embed.addField(`${event.name}`, `• **Канал публикации:** <#${event.chan}>`)
                               // embed.addField(`${event.name}`, `• Тайтл ивента: ${event.title}\n• Канал публикации: <#${event.chan}>\n• Место проведения: <#${event.place}>\n• Награда за участие: **${event.participation} ${coin}**${event.winnersAmount ? event.winnersAmount == 3 ? `\n• Первое место: **${event.winPlaces[0]} ${coin}**\n• Второе место: **${event.winPlaces[1]} ${coin}**\n• Третье место: **${event.winPlaces[2]} ${coin}**` : event.winnersAmount == 2 ? `\n• Первое место: **${event.winPlaces[0]} ${coin}**\n• Второе место: **${event.winPlaces[1]} ${coin}**` : event.winnersAmount == 1 ? `\n• Победителю: **${event.winnersPrize} ${coin}**` : null : ""}\n• Верхнее сообщение: ${event.roles}\n\`\`\`${event.desc}\`\`\``)
                            }
                        } else {
                            for(i = start; i < end; i++){
                                let event = grabEvents[i]
                                text = `${text}\n**${i + 1}. ${event.name}**`
                                embed.setDescription(text)
                                //embed.addField(`${event.name}`, `• **Тайтл ивента:** <#${event.chan}>`)
                                //embed.addField(`${event.name}`, `• Тайтл ивента: ${event.title}\n• Канал публикации: <#${event.chan}>\n• Место проведения: <#${event.place}>\n• Награда за участие: **${event.participation} ${coin}**${event.winnersAmount ? event.winnersAmount == 3 ? `\n• Первое место: **${event.winPlaces[0]} ${coin}**\n• Второе место: **${event.winPlaces[1]} ${coin}**\n• Третье место: **${event.winPlaces[2]} ${coin}**` : event.winnersAmount == 2 ? `\n• Первое место: **${event.winPlaces[0]} ${coin}**\n• Второе место: **${event.winPlaces[1]} ${coin}**` : event.winnersAmount == 1 ? `\n• Победителю: **${event.winnersPrize} ${coin}**` : null : ""}\n• Верхнее сообщение: ${event.roles}\n\`\`\`${event.desc}\`\`\``)
                            }
                        }
    
                        return embed
                    }
                }

                let embedCreate = (title, desc, time, place, participation, isWinnersExist, isPrizePlacesExist, winnersAmount, winPlaces, winnersPrize, image, roles, rules, preview) => {
                    let embed = new Discord.MessageEmbed()
                    //.setDescription(`${title}\n\`\`\`${desc}\`\`\`\n${rules ? `**● Ссылка на правила:** [клик](${rules})\n\n` : ""}**● Начало мероприятия:** ${!time ? `Требуется указать` : `${time} по МСК`}\n\n**● Ведущий:** ${message.member}\n\n**● Место встречи:** <#${place}>\n\n**Награда**`)
                    .setDescription(`${title}\n\`\`\`${desc}\`\`\`\n**● Начало мероприятия:** ${!time ? `Требуется указать` : `${time} по МСК`}\n\n**● Ведущий:** ${message.member}\n\n**● Место встречи:** <#${place}>\n\n**Награда**`)
                    .setColor(noColor())
                    if(image) embed.setImage(image)

                    if(winnersAmount != 1){
                        if(winnersAmount == 3){
                            embed.addField(`Первое место`, winPlaces ? winPlaces[0] + ` ${coin}` : 'Требуется указать', true)
                            embed.addField(`Второе место`, winPlaces ? winPlaces[1] + ` ${coin}` : 'Требуется указать', true)
                            embed.addField(`Третье место`, winPlaces ? winPlaces[2] + ` ${coin}` : 'Требуется указать', true)
                        } else if(winnersAmount == 2) {
                            embed.addField(`Первое место`, winPlaces ? winPlaces[0] + ` ${coin}` : 'Требуется указать', true)
                            embed.addField(`Второе место`, winPlaces ? winPlaces[1] + ` ${coin}` : 'Требуется указать', true)
                        }
                    }
                    if(winnersAmount == 1) embed.addField(`Победителю:`, `${winPlaces[0] != null ? winPlaces[0] + ` ${coin}` : winnersPrize ? winnersPrize + ` ${coin}` : 'Требуется указать'}`, true)
                    
                    embed.addField('Участие', `${participation} ${coin}`, winnersAmount == 1 ? true : false)

                    if(preview) embed.setFooter({text:`Это превью ивента`})
                    return embed
                }

                const changeToEvent = (title, desc, time, place, participation, isWinnersExist, isPrizePlacesExist, winnersAmount, winPlaces, winnersPrize, image, roles, rules) => {
                    return embedCreate(title, desc, time, place, participation, isWinnersExist, isPrizePlacesExist, winnersAmount, winPlaces, winnersPrize, image, roles, rules, true)
                }

                let exited

                function chanChange(){
                    let embed = new Discord.MessageEmbed()
                    .setTitle(`Смена канала публикации ивента`)
                    .setDescription(`Выберите канал публикации из списка ниже\nНынешний канал публикации: ${message.guild.channels.cache.get(chan)}`)
                    .setColor(noColor())
                    initMessage.edit({
                        content: null,
                        embeds: [embed],
                        components: [channelSelectAction2(), backButtonAction()]
                    })
                }

                function titleChange(){
                    let embed = new Discord.MessageEmbed()
                    .setTitle(`Смена тайтла ивента`)
                    .setDescription(`Введите новый тайтл ивента\nПросьба не использовать кастомные эмодзи, так как они не могут отобразиться в мероприятиях сервера\nНынешний тайтл: **${title}**`)
                    .setColor(noColor())
                    initMessage.edit({
                        content: null,
                        embeds: [embed],
                        components: [backButtonAction()]
                    })
                    const Collector = message.channel.createMessageCollector({channelFilter, time: 60000, errors: ['time']})
                    isActive = true
                    exited = false
                    let si = setInterval(() => {
                        if(exited){
                            Collector.stop()
                            isActive = false
                            clearInterval(si)
                        }
                    }, 100)
                    Collector.on('collect', async msg => {
                        if(msg.author.id !== message.author.id) return
                        if(msg.author.bot) return
                        setTimeout(() => {
                            msg.delete().catch()
                        }, 5000)
                        title = `${msg.content}`
                        isActive = false
                        // msg.react(checkmark)
                        Collector.stop()
                        initMessage.edit({
                            content: roles,
                            embeds: [changeToEvent(title, desc, time, place, participation, isWinnersExist, isPrizePlacesExist, winnersAmount, winPlaces, winnersPrize, image, roles, rules)],
                            components: rules && rules != 'false' ? [rulesButtonAction(), action2(), eventButtonsAction()] : [action2(), eventButtonsAction()]
                        })
                    })

                    Collector.on('end', async collected => {
                        if(collected.map(c => c.content).length == 0 && !exited) return crossText(`Никакого аргумента не было указано в течение 1 минуты. Изменение ивента было отменено`, initMessage)
                        if(collected.map(c => c.content).length == 0 && !exited){ 
                            initMessage.edit({
                                components: [backButtonAction(true)]
                            })
                            return crossText(`Не было введено подходящего варианта за 1 минуту. Изменение ивента было отменено`, initMessage)
                        }
                    })
                }

                function descChange(){
                    let embed = new Discord.MessageEmbed()
                    .setTitle(`Смена описания ивента`)
                    .setDescription(`Введите новое описание ивента\nНынешнее описание: **${desc}**`)
                    .setColor(noColor())
                    initMessage.edit({
                        content: null,
                        embeds: [embed],
                        components: [backButtonAction()]
                    })
                    const Collector = message.channel.createMessageCollector({channelFilter, time: 60000, errors: ['time']})
                    isActive = true
                    exited = false
                    let si = setInterval(() => {
                        if(exited){
                            Collector.stop()
                            isActive = false
                            clearInterval(si)
                        }
                    }, 100)
                    Collector.on('collect', async msg => {
                        if(msg.author.id !== message.author.id) return
                        if(msg.author.bot) return
                        setTimeout(() => {
                            msg.delete().catch()
                        }, 5000)
                        desc = `${msg.content}`
                        isActive = false
                        // msg.react(checkmark)
                        Collector.stop()
                        initMessage.edit({
                            content: roles,
                            embeds: [changeToEvent(title, desc, time, place, participation, isWinnersExist, isPrizePlacesExist, winnersAmount, winPlaces, winnersPrize, image, roles, rules)],
                            components: rules && rules != 'false' ? [rulesButtonAction(), action2(), eventButtonsAction()] : [action2(), eventButtonsAction()]
                        })
                    })

                    Collector.on('end', async collected => {
                        if(collected.map(c => c.content).length == 0 && !exited) return crossText(`Никакого аргумента не было указано в течение 1 минуты. Изменение ивента было отменено`, initMessage)
                        if(isActive && !exited){ 
                            initMessage.edit({
                                components: [backButtonAction(true)]
                            })
                            return crossText(`Не было введено подходящего варианта за 1 минуту. Изменение ивента было отменено`, initMessage)
                        }

                    })
                }

                function timeChange(){
                    let embed = new Discord.MessageEmbed()
                    .setTitle(`Смена начала ивента`)
                    .setDescription(`Введите начало мероприятия по МСК\nНынешнее время: **${time == null ? 'Отсутсвутет' : time + " по МСК"}**`)
                    .setColor(noColor())
                    initMessage.edit({
                        content: null,
                        embeds: [embed],
                        components: [backButtonAction()]
                    })
                    const Collector = message.channel.createMessageCollector({channelFilter, time: 60000, errors: ['time']})
                    isActive = true
                    exited = false
                    let si = setInterval(() => {
                        if(exited){
                            Collector.stop()
                            isActive = false
                            clearInterval(si)
                        }
                    }, 100)
                    Collector.on('collect', async msg => {
                        if(msg.author.id !== message.author.id) return
                        if(msg.author.bot) return
                        setTimeout(() => {
                            msg.delete().catch()
                        }, 5000)
                        function stringToDateFull(_date, _format, _format2){
                            if(_date.includes("+") || _date.includes("-")) return
                            _date = _date.split(" ")
                
                            var formatLowerCase = _format.toLowerCase();
                            var formatItems = formatLowerCase.split('.');
                            var dateItems = _date[0].split('.');
                            var monthIndex = formatItems.indexOf("mm");
                            var dayIndex = formatItems.indexOf("dd");
                            var yearIndex = formatItems.indexOf("yyyy");
                            var month = parseInt(dateItems[monthIndex]) - 1;
                            var day = parseInt(dateItems[dayIndex]);
                
                            var format2LowerCase = _format2.toLowerCase();
                            var format2Items = format2LowerCase.split(':');
                            var date2Items = _date[1].split(':');
                            var hoursItems = format2Items.indexOf("hh")
                            var minutesItems = format2Items.indexOf("mm")
                            var hours = parseInt(date2Items[hoursItems]) 
                            var minutes = parseInt(date2Items[minutesItems])
            
                            if(day > 31 || month > 11 || hours > 23 || minutes > 59) return
                
                            var formatedDate = new Date(dateItems[yearIndex], month, day, hours, minutes);
                            return formatedDate;
                        }
            
                        function stringToDateTime(_date, _format){
                            let now = new Date()
                            if(_date.includes("+") || _date.includes("-")) return
                
                            var formatLowerCase = _format.toLowerCase();
                            var formatItems = formatLowerCase.split(':');
                            var dateItems = _date.split(':');
                            var hoursItems = formatItems.indexOf("hh")
                            var minutesItems = formatItems.indexOf("mm")
                            var hours = parseInt(dateItems[hoursItems]) 
                            var minutes = parseInt(dateItems[minutesItems])
            
                            if(hours > 23 || minutes > 59) return
                
                            var formatedDate = new Date(now.getFullYear(), now.getMonth(), now.getHours() >= 21 && now.getTimezoneOffset() == 0 >= 21 ? now.getDate() + 1 : now.getDate(), hours, minutes);
                            return formatedDate;
                        }
            
                        let data
            
                        if(msg.content.split(" ").length == 2){
                            data = stringToDateFull(`${msg.content}`,"dd.mm.yyyy", "HH:MM")
                        } else if (msg.content.split(" ").length == 1){
                            data = stringToDateTime(`${msg.content}`,"HH:MM")
                        } else {
                            return msg.reply({embeds: [new Discord.MessageEmbed().setColor("#922a37").setDescription(`${cross} Дата или время не является правильной, введите снова`)]}).then(mes => {
                                setTimeout(() => mes.delete(), 5000)
                            })
                        }
            
                        if(!Date.parse(data)){
                            return msg.reply({embeds: [new Discord.MessageEmbed().setColor("#922a37").setDescription(`${cross} Дата или время не является правильной, введите снова`)]}).then(mes => {
                                setTimeout(() => mes.delete(), 5000)
                            })
                        }
                        if(Date.now() - (Date.parse(`${data}Z`) - 1000 * 60 * 60 * 3) > -60000 * 10){
                            return msg.reply({embeds: [new Discord.MessageEmbed().setColor("#922a37").setDescription(`${cross} Ивент не может начаться ранее, чем за 10 минут`)]}).then(mes => {
                                setTimeout(() => mes.delete(), 5000)
                            })
                        }
                        discordData = new Date(Date.parse(`${data}Z`) - 1000 * 60 * 60 * 3)
                        time = msg.content
                        isActive = false
                        // msg.react(checkmark)
                        Collector.stop()
                        initMessage.edit({
                            content: roles,
                            embeds: [changeToEvent(title, desc, time, place, participation, isWinnersExist, isPrizePlacesExist, winnersAmount, winPlaces, winnersPrize, image, roles, rules)],
                            components: rules && rules != 'false' ? [rulesButtonAction(), action2(), eventButtonsAction()] : [action2(), eventButtonsAction()]
                        })
                    })

                    Collector.on('end', async collected => {
                        if(collected.map(c => c.content).length == 0 && !exited) return crossText(`Никакого аргумента не было указано в течение 1 минуты. Изменение ивента было отменено`, initMessage)
                        if(isActive && !exited){ 
                            initMessage.edit({
                                components: [backButtonAction(true)]
                            })
                            return crossText(`Не было введено подходящего варианта за 1 минуту. Изменение ивента было отменено`, initMessage)
                        }

                    })
                }

                function placeChange(){
                    let embed = new Discord.MessageEmbed()
                    .setTitle(`Смена места встречи ивента`)
                    .setDescription(`Выберите новое место встречи ивента\nНынешнее место встречи: ${message.guild.channels.cache.get(place)}`)
                    .setColor(noColor())
                    initMessage.edit({
                        content: null,
                        embeds: [embed],
                        components: [channelSelectAction(), backButtonAction()]
                    })
                }

                function participationChange(){
                    let embed = new Discord.MessageEmbed()
                    .setTitle(`Смена награды за участие ивента`)
                    .setDescription(`Введите новую награду за участие\nНынешняя награда за участие: **${participation}**`)
                    .setColor(noColor())
                    initMessage.edit({
                        content: null,
                        embeds: [embed],
                        components: [backButtonAction()]
                    })
                    const Collector = message.channel.createMessageCollector({channelFilter, time: 60000, errors: ['time']})
                    isActive = true
                    exited = false
                    let si = setInterval(() => {
                        if(exited){
                            Collector.stop()
                            isActive = false
                            clearInterval(si)
                        }
                    }, 100)
                    Collector.on('collect', async msg => {
                        if(msg.author.id !== message.author.id) return
                        if(msg.author.bot) return
                        setTimeout(() => {
                            msg.delete().catch()
                        }, 5000) 
                        if(!isFinite(msg.content) || msg.content % 1 !== 0 || msg.content <= 0 || msg.content.includes("+")  || msg.content.includes(".")){
                            return msg.reply({embeds: [new Discord.MessageEmbed().setColor("#922a37").setDescription(`${cross} Приз за участие должен быть целым положительным числом`)]}).then(mes => {
                                setTimeout(() => mes.delete(), 5000)
                            })
                        }
                        participation = msg.content
                        // msg.react(checkmark)
                        isActive = false
                        Collector.stop()
                        initMessage.edit({
                            content: roles,
                            embeds: [changeToEvent(title, desc, time, place, participation, isWinnersExist, isPrizePlacesExist, winnersAmount, winPlaces, winnersPrize, image, roles, rules)],
                            components: rules && rules != 'false' ? [rulesButtonAction(), action2(), eventButtonsAction()] : [action2(), eventButtonsAction()]
                        })
                    })

                    Collector.on('end', async collected => {
                        if(collected.map(c => c.content).length == 0 && !exited) return crossText(`Никакого аргумента не было указано в течение 1 минуты. Изменение ивента было отменено`, initMessage)
                        if(isActive && !exited){ 
                            initMessage.edit({
                                components: [backButtonAction(true)]
                            })
                            return crossText(`Не было введено подходящего варианта за 1 минуту. Изменение ивента было отменено`, initMessage)
                        }

                    })
                }

                function winnersAmountChange(){
                    let embed = new Discord.MessageEmbed()
                    .setTitle(`Смена количества победителей ивента`)
                    .setDescription(`Выберите новое количество победителей в ивенте\nНынешнее количество победителей: **${winnersAmount ? winnersAmount : 0}**`)
                    .setColor(noColor())
                    initMessage.edit({
                        content: null,
                        embeds: [embed],
                        components: [winnersAmountAction(), backButtonAction()]
                    })
                }

                function firstPlaceChange(){
                    let embed = new Discord.MessageEmbed()
                    .setTitle(`Смена награды победителя/за первое место`)
                    .setDescription(`Введите новую награду победителя/за первое место\nНынешняя награда: **${winPlaces[0] != null ? winPlaces[0] + `${coin}` : winnersPrize ? winnersPrize + `${coin}` : 'Отсутствует'}**`)
                    .setColor(noColor())
                    initMessage.edit({
                        content: null,
                        embeds: [embed],
                        components: [backButtonAction()]
                    })
                    const Collector = message.channel.createMessageCollector({channelFilter, time: 60000, errors: ['time']})
                    isActive = true
                    exited = false
                    let si = setInterval(() => {
                        if(exited){
                            Collector.stop()
                            isActive = false
                            clearInterval(si)
                        }
                    }, 100)
                    Collector.on('collect', async msg => {
                        if(msg.author.id !== message.author.id) return
                        if(msg.author.bot) return
                        setTimeout(() => {
                            msg.delete().catch()
                        }, 5000) 
                        if(!isFinite(msg.content) || msg.content % 1 !== 0 || msg.content <= 0 || msg.content.includes("+")  || msg.content.includes(".")){
                            return msg.reply({embeds: [new Discord.MessageEmbed().setColor("#922a37").setDescription(`${cross} Награда должна быть целым положительным числом`)]}).then(mes => {
                                setTimeout(() => mes.delete(), 5000)
                            })
                        }
                        if(!winPlaces[0]) winPlaces = [null, null, null]
                        winPlaces[0] = msg.content
                        winnersPrize = msg.content
                        // msg.react(checkmark)
                        isActive = false
                        Collector.stop()
                        initMessage.edit({
                            content: roles,
                            embeds: [changeToEvent(title, desc, time, place, participation, isWinnersExist, isPrizePlacesExist, winnersAmount, winPlaces, winnersPrize, image, roles, rules)],
                            components: rules && rules != 'false' ? [rulesButtonAction(), action2(), eventButtonsAction()] : [action2(), eventButtonsAction()]
                        })
                    })

                    Collector.on('end', async collected => {
                        if(collected.map(c => c.content).length == 0 && !exited) return crossText(`Никакого аргумента не было указано в течение 1 минуты. Изменение ивента было отменено`, initMessage)
                        if(isActive && !exited){ 
                            initMessage.edit({
                                components: [backButtonAction(true)]
                            })
                            return crossText(`Не было введено подходящего варианта за 1 минуту. Изменение ивента было отменено`, initMessage)
                        }

                    })
                }

                function secondPlaceChange(){
                    let embed = new Discord.MessageEmbed()
                    .setTitle(`Смена награды за второе место`)
                    .setDescription(`Введите новую награду за второе место\nНынешняя награда: **${winPlaces[1]}**`)
                    .setColor(noColor())
                    initMessage.edit({
                        content: null,
                        embeds: [embed],
                        components: [backButtonAction()]
                    })
                    const Collector = message.channel.createMessageCollector({channelFilter, time: 60000, errors: ['time']})
                    isActive = true
                    exited = false
                    let si = setInterval(() => {
                        if(exited){
                            Collector.stop()
                            isActive = false
                            clearInterval(si)
                        }
                    }, 100)
                    Collector.on('collect', async msg => {
                        if(msg.author.id !== message.author.id) return
                        if(msg.author.bot) return
                        setTimeout(() => {
                            msg.delete().catch()
                        }, 5000) 
                        if(!isFinite(msg.content) || msg.content % 1 !== 0 || msg.content <= 0 || msg.content.includes("+")  || msg.content.includes(".")){
                            return msg.reply({embeds: [new Discord.MessageEmbed().setColor("#922a37").setDescription(`${cross} Награда должна быть целым положительным числом`)]}).then(mes => {
                                setTimeout(() => mes.delete(), 5000)
                            })
                        }
                        winPlaces[1] = msg.content
                        // msg.react(checkmark)
                        isActive = false
                        Collector.stop()
                        initMessage.edit({
                            content: roles,
                            embeds: [changeToEvent(title, desc, time, place, participation, isWinnersExist, isPrizePlacesExist, winnersAmount, winPlaces, winnersPrize, image, roles, rules)],
                            components: rules && rules != 'false' ? [rulesButtonAction(), action2(), eventButtonsAction()] : [action2(), eventButtonsAction()]
                        })
                    })

                    Collector.on('end', async collected => {
                        if(collected.map(c => c.content).length == 0 && !exited) return crossText(`Никакого аргумента не было указано в течение 1 минуты. Изменение ивента было отменено`, initMessage)
                        if(isActive && !exited){ 
                            initMessage.edit({
                                components: [backButtonAction(true)]
                            })
                            return crossText(`Не было введено подходящего варианта за 1 минуту. Изменение ивента было отменено`, initMessage)
                        }

                    })
                }

                function thirdPlaceChange(){
                    let embed = new Discord.MessageEmbed()
                    .setTitle(`Смена награды за третье место`)
                    .setDescription(`Введите новую награду за третье место\nНынешняя награда: **${winPlaces[2]}**`)
                    .setColor(noColor())
                    initMessage.edit({
                        content: null,
                        embeds: [embed],
                        components: [backButtonAction()]
                    })
                    const Collector = message.channel.createMessageCollector({channelFilter, time: 60000, errors: ['time']})
                    isActive = true
                    exited = false
                    let si = setInterval(() => {
                        if(exited){
                            Collector.stop()
                            isActive = false
                            clearInterval(si)
                        }
                    }, 100)
                    Collector.on('collect', async msg => {
                        if(msg.author.id !== message.author.id) return
                        if(msg.author.bot) return
                        setTimeout(() => {
                            msg.delete().catch()
                        }, 5000) 
                        if(!isFinite(msg.content) || msg.content % 1 !== 0 || msg.content <= 0 || msg.content.includes("+")  || msg.content.includes(".")){
                            return msg.reply({embeds: [new Discord.MessageEmbed().setColor("#922a37").setDescription(`${cross} Награда должна быть целым положительным числом`)]}).then(mes => {
                                setTimeout(() => mes.delete(), 5000)
                            })
                        }
                        winPlaces[2] = msg.content
                        // msg.react(checkmark)
                        isActive = false
                        Collector.stop()
                        initMessage.edit({
                            content: roles,
                            embeds: [changeToEvent(title, desc, time, place, participation, isWinnersExist, isPrizePlacesExist, winnersAmount, winPlaces, winnersPrize, image, roles, rules)],
                            components: rules && rules != 'false' ? [rulesButtonAction(), action2(), eventButtonsAction()] : [action2(), eventButtonsAction()]
                        })
                    })

                    Collector.on('end', async collected => {
                        if(collected.map(c => c.content).length == 0 && !exited) return crossText(`Никакого аргумента не было указано в течение 1 минуты. Изменение ивента было отменено`, initMessage)
                        if(isActive && !exited){ 
                            initMessage.edit({
                                components: [backButtonAction(true)]
                            })
                            return crossText(`Не было введено подходящего варианта за 1 минуту. Изменение ивента было отменено`, initMessage)
                        }

                    })
                }

                function imageChange(){
                    let embed = new Discord.MessageEmbed()
                    .setTitle(`Смена картинки ивента`)
                    .setDescription(`Скиньте новую картинку ивента\nНынешняя картинка: ${image == 'false' || !image ? `**Отсутствует**` : ""}`)
                    .setColor(noColor())
                    if(image) embed.setImage(image)
                    initMessage.edit({
                        content: null,
                        embeds: [embed],
                        components: [backButtonAction()]
                    })
                    const Collector = message.channel.createMessageCollector({channelFilter, time: 60000, errors: ['time']})
                    isActive = true
                    exited = false
                    let si = setInterval(() => {
                        if(exited){
                            Collector.stop()
                            isActive = false
                            clearInterval(si)
                        }
                    }, 100)
                    Collector.on('collect', async msg => {
                        if(msg.author.id !== message.author.id) return
                        if(msg.author.bot) return
                        setTimeout(() => {
                            try{
                                msg.delete().catch()
                            }catch(err){
                                console.error(err)
                            }
                        }, 5000)
                        if(exited) return
                        if(msg.attachments.size == 0) {
                            return msg.reply({embeds: [new Discord.MessageEmbed().setColor("#922a37").setDescription(`${cross} Не было найдено картинки в вашем сообщении`)]}).then(mes => {
                                setTimeout(() => mes.delete(), 5000)
                            })
                        } else {
                            let attach = await msg.attachments.first().attachment
                            await bot.guilds.cache.get("914124553960194059").channels.cache.get('985644709152182312').send({
                                files: [attach]
                            }).then(async msg => {
                                image = msg.attachments.first().attachment
                            })
                            // msg.react(checkmark)
                            isActive = false
                            Collector.stop()
                            initMessage.edit({
                                content: roles,
                                embeds: [changeToEvent(title, desc, time, place, participation, isWinnersExist, isPrizePlacesExist, winnersAmount, winPlaces, winnersPrize, image, roles, rules)],
                                components: rules && rules != 'false' ? [rulesButtonAction(), action2(), eventButtonsAction()] : [action2(), eventButtonsAction()]
                            })
                        }
                    })

                    Collector.on('end', async collected => {
                        if(collected.map(c => c.content).length == 0 && !exited) return crossText(`Никакого аргумента не было указано в течение 1 минуты. Изменение ивента было отменено`, initMessage)
                        if(isActive && !exited){ 
                            initMessage.edit({
                                components: [backButtonAction(true)]
                            })
                            return crossText(`Не было введено подходящего варианта за 1 минуту. Изменение ивента было отменено`, initMessage)
                        }
                    })
                }

                function rolesChange(){
                    let embed = new Discord.MessageEmbed()
                    .setTitle(`Смена верхнего сообщения ивента`)
                    .setDescription(`Введите новое верхнее сообщение ивента\nНынешнее верхнее сообщение: **${roles}**`)
                    .setColor(noColor())
                    initMessage.edit({
                        content: null,
                        embeds: [embed],
                        components: [backButtonAction()]
                    })
                    const Collector = message.channel.createMessageCollector({channelFilter, time: 60000, errors: ['time']})
                    isActive = true
                    exited = false
                    let si = setInterval(() => {
                        if(exited){
                            Collector.stop()
                            isActive = false
                            clearInterval(si)
                        }
                    }, 100)
                    Collector.on('collect', async msg => {
                        if(msg.author.id !== message.author.id) return
                        if(msg.author.bot) return
                        setTimeout(() => {
                            try{
                                msg.delete().catch()
                            }catch(err){
                                console.error(err)
                            }
                        }, 5000)
                        if(msg.content.includes('@everyone') || msg.content.includes('@here')) return crossText(`Нельзя использовать @everyone и @here в верхнем сообщении`, msg)
                        roles = `${msg.content}`
                        isActive = false
                        // msg.react(checkmark)
                        Collector.stop()
                        initMessage.edit({
                            content: roles,
                            embeds: [changeToEvent(title, desc, time, place, participation, isWinnersExist, isPrizePlacesExist, winnersAmount, winPlaces, winnersPrize, image, roles, rules)],
                            components: rules && rules != 'false' ? [rulesButtonAction(), action2(), eventButtonsAction()] : [action2(), eventButtonsAction()]
                        })
                    })

                    Collector.on('end', async collected => {
                        if(collected.map(c => c.content).length == 0 && !exited) return crossText(`Никакого аргумента не было указано в течение 1 минуты. Изменение ивента было отменено`, initMessage)
                        if(isActive && !exited){ 
                            initMessage.edit({
                                components: [backButtonAction(true)]
                            })
                            return crossText(`Не было введено подходящего варианта за 1 минуту. Изменение ивента было отменено`, initMessage)
                        }

                    })
                }


                function rulesChange(){
                    let embed = new Discord.MessageEmbed()
                    .setTitle(`Смена правил ивента`)
                    .setDescription(`Введите новую ссылку на правила ивента\nНынешнее ссылка: ${rules}`)
                    .setColor(noColor())
                    initMessage.edit({
                        content: null,
                        embeds: [embed],
                        components: [backButtonAction()]
                    })
                    const Collector = message.channel.createMessageCollector({channelFilter, time: 60000, errors: ['time']})
                    isActive = true
                    exited = false
                    let si = setInterval(() => {
                        if(exited){
                            Collector.stop()
                            isActive = false
                            clearInterval(si)
                        }
                    }, 100)
                    Collector.on('collect', async msg => {
                        if(msg.author.id !== message.author.id) return
                        if(msg.author.bot) return
                        setTimeout(() => {
                            msg.delete().catch()
                        }, 5000)
                        
                        if(!msg.content.includes('https') && !msg.content.includes('http')) return crossText(`Сообщение должно являться ссылкой на правила`, msg)
                        rules = `${msg.content}`
                        isActive = false
                        // msg.react(checkmark)
                        Collector.stop()
                        initMessage.edit({
                            content: roles,
                            embeds: [changeToEvent(title, desc, time, place, participation, isWinnersExist, isPrizePlacesExist, winnersAmount, winPlaces, winnersPrize, image, roles, rules)],
                            components: rules && rules != 'false' ? [rulesButtonAction(), action2(), eventButtonsAction()] : [action2(), eventButtonsAction()]
                        })
                    })

                    Collector.on('end', async collected => {
                        if(collected.map(c => c.content).length == 0 && !exited) return crossText(`Никакого аргумента не было указано в течение 1 минуты. Изменение ивента было отменено`, initMessage)
                        if(isActive && !exited){ 
                            initMessage.edit({
                                components: [backButtonAction(true)]
                            })
                            return crossText(`Не было введено подходящего варианта за 1 минуту. Изменение ивента было отменено`, initMessage)
                        }

                    })
                }
                
                let needUpdate = false

                const initMessage = await message.reply({
                    embeds: [await changeToMain(false)],
                    components: grabEvents.length != 0 ? [action(), arrowsAction()] : null
                })
                const channelFilter = (m) => m.author.id === message.member.id
                const chooseEventCollector = initMessage.createMessageComponentCollector({channelFilter, errors: ['time']})
                chooseEventCollector.on('collect', async i => {
                    if (i.member.id != message.member.id) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                    if(i.customId == 'next'){
                        pg++
                        initMessage.edit({
                            content: null,
                            embeds: [await changeToMain(false)],
                            components: [action(), arrowsAction()]
                        })
                        i.deferUpdate()
                    } else if(i.customId == 'previous'){
                        pg--
                        initMessage.edit({
                            content: null,
                            embeds: [await changeToMain(false)],
                            components: [action(), arrowsAction()]
                        })
                        i.deferUpdate()
                    } else if(i.componentType == "SELECT_MENU" && typeof parseInt(i.values[0]) == 'number' && i.values[0] % 1 == 0 && !message.guild.channels.cache.get(i.values[0])){
                            event = grabEvents.filter(e => e.ID === parseInt(i.values[0]))[0]
                            eventID = event.ID
                            chan = event.chan
                            title = event.title
                            desc = event.desc
                            time = null
                            place = event.place
                            participation = event.participation
                            isWinnersExist = event.isWinnersExist
                            isPrizePlacesExist = event.isPrizePlacesExist
                            winnersAmount = event.winnersAmount
                            winPlaces = isPrizePlacesExist ? event.winPlaces : [null, null, null]
                            winnersPrize = isWinnersExist ? event.winnersPrize : null
                            image = event.image == 'false' ? null : event.image
                            roles = event.roles
                            rules = event.rules
                            initMessage.edit({
                                content: roles,
                                embeds: [changeToEvent(title, desc, time, place, participation, isWinnersExist, isPrizePlacesExist, winnersAmount, winPlaces, winnersPrize, image, roles, rules)],
                                components: rules ? [rulesButtonAction(), action2(), eventButtonsAction()] : rules && rules != 'false' ? [rulesButtonAction(), action2(), eventButtonsAction()] : [action2(), eventButtonsAction()]
                            })
                            i.deferUpdate()
                        } else if(i.componentType == "SELECT_MENU" && typeof parseInt(i.values[0]) == 'number' && i.values[0] % 1 == 0 && message.guild.channels.cache.get(i.values[0]).type == "GUILD_VOICE"){
                            place = i.values[0]
                            initMessage.edit({
                                content: roles,
                                embeds: [changeToEvent(title, desc, time, place, participation, isWinnersExist, isPrizePlacesExist, winnersAmount, winPlaces, winnersPrize, image, roles, rules)],
                                components: rules && rules != 'false' ? [rulesButtonAction(), action2(), eventButtonsAction()] : [action2(), eventButtonsAction()]
                            })
                            i.deferUpdate()
                        } else if(i.componentType == "SELECT_MENU" && typeof parseInt(i.values[0]) == 'number' && i.values[0] % 1 == 0 && (message.guild.channels.cache.get(i.values[0]).type == "GUILD_TEXT" || message.guild.channels.cache.get(i.values[0]).type == "GUILD_NEWS")){
                            chan = i.values[0]
                            initMessage.edit({
                                content: roles,
                                embeds: [changeToEvent(title, desc, time, place, participation, isWinnersExist, isPrizePlacesExist, winnersAmount, winPlaces, winnersPrize, image, roles, rules)],
                                components: rules && rules != 'false' ? [rulesButtonAction(), action2(), eventButtonsAction()] : [action2(), eventButtonsAction()]
                            })
                            i.deferUpdate()
                        } else if(i.customId == 'zero_button'){
                            winnersAmount = 0
                            initMessage.edit({
                                content: roles,
                                embeds: [changeToEvent(title, desc, time, place, participation, isWinnersExist, isPrizePlacesExist, winnersAmount, winPlaces, winnersPrize, image, roles, rules)],
                                components: rules && rules != 'false' ? [rulesButtonAction(), action2(), eventButtonsAction()] : [action2(), eventButtonsAction()]
                            })
                            i.deferUpdate()
                        } else if(i.customId == 'one_button'){
                            winnersAmount = 1
                            winPlaces = winPlaces ? winPlaces : [null, null, null]
                            initMessage.edit({
                                content: roles,
                                embeds: [changeToEvent(title, desc, time, place, participation, isWinnersExist, isPrizePlacesExist, winnersAmount, winPlaces, winnersPrize, image, roles, rules)],
                                components: rules && rules != 'false' ? [rulesButtonAction(), action2(), eventButtonsAction()] : [action2(), eventButtonsAction()]
                            })
                            i.deferUpdate()
                        } else if(i.customId == 'two_button'){
                            winnersAmount = 2
                            winPlaces = winPlaces ? winPlaces : [null, null, null]
                            initMessage.edit({
                                content: roles,
                                embeds: [changeToEvent(title, desc, time, place, participation, isWinnersExist, isPrizePlacesExist, winnersAmount, winPlaces, winnersPrize, image, roles, rules)],
                                components: rules && rules != 'false' ? [rulesButtonAction(), action2(), eventButtonsAction()] : [action2(), eventButtonsAction()]
                            })
                            i.deferUpdate()
                        } else if(i.customId == 'three_button'){
                            winnersAmount = 3
                            winPlaces = winPlaces ? winPlaces : [null, null, null]
                            initMessage.edit({
                                content: roles,
                                embeds: [changeToEvent(title, desc, time, place, participation, isWinnersExist, isPrizePlacesExist, winnersAmount, winPlaces, winnersPrize, image, roles, rules)],
                                components: rules && rules != 'false' ? [rulesButtonAction(), action2(), eventButtonsAction()] : [action2(), eventButtonsAction()]
                            })
                            i.deferUpdate()
                        } else if (i.customId == 'back_button'){
                            initMessage.edit({
                                content: null,
                                embeds: [needUpdate == false ? await changeToMain(false) : await changeToMain(true)],
                                components: [action(), arrowsAction()]
                            })
                            i.deferUpdate()
                        } else if (i.customId == 'back_button2'){
                            exited = true
                            initMessage.edit({
                                content: roles,
                                embeds: [changeToEvent(title, desc, time, place, participation, isWinnersExist, isPrizePlacesExist, winnersAmount, winPlaces, winnersPrize, image, roles, rules)],
                                components: rules && rules != 'false' ? [rulesButtonAction(), action2(), eventButtonsAction()] : [action2(), eventButtonsAction()]
                            })
                            i.deferUpdate()
                        } else if (i.customId == 'delete_button'){
                            if(Util.checkPerm(message.member, "ADMINISTRATOR")) return i.reply({content: 'У вас недостаточно прав для удаления шаблона', ephemeral: true})
                            
                            let embed = new Discord.MessageEmbed()
                            .setTitle(`🗑️ Удаление ивента 🗑️`).setColor(0xFF0000)
                            .setDescription(`Вы действительно хотите удалить ивент **\`${event.name}\`**?`)

                            await initMessage.edit({
                                content: null,
                                embeds: [embed],
                                components: [YES_NO_BUTTONS()]
                            })
                            i.deferUpdate()
                        } else if (i.customId == "publish_button"){
                            if(!time) return await i.reply({content: `Время проведения не было указано`, ephemeral: true})
                            if(title.replace(/\*/g, "").replace(/\`/g, "").replace(/\_/g, "").length > 100) return await i.reply({content: `Тайтл ивента не может быть больше 100 символов\nЕсли вам кажется, что символов меньше, то кастомные эмодзи занимают 33 символа каждый из-за их уникального id и названия`, ephemeral: true})
                            if(!message.guild.channels.cache.get(chan)) return await i.reply({content: `Указанный канал не был найден`, ephemeral: true})
                            if(winnersAmount == 1 && winPlaces && !winPlaces[0]) return await i.reply({content: `Не указан приз победителя/за первое место`, ephemeral: true})
                            if(winnersAmount == 2 && winPlaces && (!winPlaces[0] || !winPlaces[1])) return await i.reply({content: `Не все призовые места имеют целое положительное число`, ephemeral: true})
                            if(winnersAmount == 3 && winPlaces && (!winPlaces[0] || !winPlaces[1] || !winPlaces[2])) return await i.reply({content: `Не все призовые места имеют целое положительное число`, ephemeral: true})
                            initMessage.edit({
                                components: [action2(true), eventButtonsAction(true)]
                            })
                            message.guild.channels.cache.get(chan).send({
                                content: roles,
                                embeds: [embedCreate(title, desc, time, place, participation, isWinnersExist, isPrizePlacesExist, winnersAmount, winPlaces, winnersPrize, image, roles, rules, false)],
                                components: rules ? [rulesButtonAction()] : null
                            })

                            message.guild.scheduledEvents.create({
                                name: event.name,
                                description: desc,
                                image: image ? image : null,
                                channel: place,
                                scheduledStartTime: discordData,
                                scheduledEndTime: new Date(Date.parse(discordData) + 1000 * 60 * 60 * 3),
                                entityType: "VOICE",
                                privacyLevel: "GUILD_ONLY"
                            }).then(event => {
                                let newShedule = new sheduledModels({
                                    _id: mongoose.Types.ObjectId(),
                                    eventID: event.id,
                                    guildID: message.guild.id,
                                    startDate: event.scheduledStartTimestamp,
                                    endDate: event.scheduledEndTimestamp,
                                    activated: false
                                })
                                newShedule.save()
                            })
                            return message.channel.send({content: "Уведомление было успешно опубликовано!"})
                            //i.deferUpdate()
                        } else if (i.customId == "save_button"){
                            if(Util.checkPerm(message.member, "ADMINISTRATOR")) return i.reply({content: 'У вас недостаточно прав для сохранения ивентов в шаблоны', ephemeral: true})

                            let embed = new Discord.MessageEmbed()
                            .setTitle(`💾 Сохранение измененного шаблона 💾`).setColor("#2F3136")
                            .setDescription('Вы хотите оставить прежнее название шаблона или изменить?')

                            initMessage.edit({
                                content: null,
                                embeds: [embed],
                                components: [CHANGE_OR_NOT_BUTTONS()]
                            })  
                            i.deferUpdate()
                        } else if (i.componentType == "SELECT_MENU" && i.values[0] == 'chan'){
                            chanChange()
                            i.deferUpdate()
                        } else if (i.componentType == "SELECT_MENU" && i.values[0] == 'title'){
                            titleChange()
                            i.deferUpdate()
                        } else if (i.componentType == "SELECT_MENU" && i.values[0] == 'desc'){
                            descChange()
                            i.deferUpdate()
                        } else if (i.componentType == "SELECT_MENU" && i.values[0] == 'time'){
                            timeChange()
                            i.deferUpdate()
                        } else if (i.componentType == "SELECT_MENU" && i.values[0] == 'place'){
                            placeChange()
                            i.deferUpdate()
                        } else if (i.componentType == "SELECT_MENU" && i.values[0] == 'participation'){
                            participationChange()
                            i.deferUpdate()
                        } else if (i.componentType == "SELECT_MENU" && i.values[0] == 'winners_amount'){
                            winnersAmountChange()
                            i.deferUpdate()
                        } else if (i.componentType == "SELECT_MENU" && i.values[0] == 'first_place'){
                            firstPlaceChange()
                            i.deferUpdate()
                        } else if (i.componentType == "SELECT_MENU" && i.values[0] == 'second_place'){
                            secondPlaceChange()
                            i.deferUpdate()
                        } else if (i.componentType == "SELECT_MENU" && i.values[0] == 'third_place'){
                            thirdPlaceChange()
                            i.deferUpdate()
                        } else if (i.componentType == "SELECT_MENU" && i.values[0] == 'image'){
                            imageChange()
                            i.deferUpdate()
                        } else if (i.componentType == "SELECT_MENU" && i.values[0] == 'roles'){
                            rolesChange()
                            i.deferUpdate()
                        } else if (i.componentType == "SELECT_MENU" && i.values[0] == 'rules'){
                            rulesChange()
                            i.deferUpdate()
                        } else if (i.customId == "yes_button"){
                            let title = event.name
                            await i.reply({content: `Ивент **${title}** был успешно удален`, ephemeral: true})
                            pg = 1  
                            await Events.findOneAndDelete({guildID: message.guild.id, ID: event.ID})
                            initMessage.edit({
                                content: null,
                                embeds: [await changeToMain(true)],
                                components: [action(), arrowsAction()]
                            })
                        } else if (i.customId == "no_button"){
                            initMessage.edit({
                                content: roles,
                                embeds: [changeToEvent(title, desc, time, place, participation, isWinnersExist, isPrizePlacesExist, winnersAmount, winPlaces, winnersPrize, image, roles, rules)],
                                components: rules ? [rulesButtonAction(), action2(), eventButtonsAction()] : rules && rules != 'false' ? [rulesButtonAction(), action2(), eventButtonsAction()] : [action2(), eventButtonsAction()]
                            })
                            i.deferUpdate()
                        } else if (i.customId == "change_button"){
                            initMessage.edit({components: [CHANGE_OR_NOT_BUTTONS(true)]})
                            let name
                            let nameEmbed = new Discord.MessageEmbed()
                            .setTitle(`💾 Сохранение измененного шаблона 💾`)
                            .setColor("#2F3136")
                            .setDescription(`Введите новое название шаблона`)
                            const channelFilter = (m) => m.author.id === message.member.id
                            let nameMsg = await message.reply({
                                embeds: [nameEmbed],
                                //components: components()
                            }) 
                            const nameCollector = message.channel.createMessageCollector({channelFilter, time: 60000, errors: ['time']})

                            nameCollector.on('collect', async(msg) => {
                                isActive = true
                                if(msg.author.id !== message.author.id) return
                                if(msg.author.bot) return
                                msg.delete()
                                if(!msg.content) return crossText (`Сообщение пустое`, msg)
                                name = msg.content
                                // msg.react(checkmark)
                                isActive = false
                                nameCollector.stop()
                            })
                            
                            nameCollector.on('end', async collected => {
                                initMessage.edit({
                                    content: roles,
                                    embeds: [changeToEvent(title, desc, time, place, participation, isWinnersExist, isPrizePlacesExist, winnersAmount, winPlaces, winnersPrize, image, roles, rules)],
                                    components: rules ? [rulesButtonAction(), action2(), eventButtonsAction()] : rules && rules != 'false' ? [rulesButtonAction(), action2(), eventButtonsAction()] : [action2(), eventButtonsAction()]
                                })
                                nameMsg.delete()
                                if(collected.map(c => c.content).length == 0){
                                    return crossText(`Никакого аргумента не было указано в течение 1 минуты. Сохранение шаблона было отменено`, initMessage)
                                }
                                if(isActive){
                                    return crossText(`Не было введено подходящего варианта за 1 минуту. Сохранение шаблона было отменено`, initMessage)
                                }
                                
                                needUpdate = true
                                await initMessage.reply({content: `Шаблон был успешно изменен и сохранен`, ephemeral: true})
                                let findEvent = await Events.findOne({guildID: message.guild.id, ID: eventID})
                                findEvent.name = name
                                findEvent.chan = chan
                                findEvent.title = title
                                findEvent.desc = desc
                                findEvent.place = place
                                findEvent.participation = participation
                                findEvent.isWinnersExist = isWinnersExist
                                findEvent.isPrizePlacesExist = isPrizePlacesExist
                                findEvent.winnersAmount = winnersAmount
                                findEvent.winPlaces = winPlaces ? winPlaces : null
                                findEvent.winnersPrize = winnersPrize ? winnersPrize : null
                                findEvent.image = image == 'false' ? null : image
                                findEvent.roles = roles
                                findEvent.rules = rules
                                findEvent.save().catch()
                            })
                            i.deferUpdate()
                        } else if(i.customId == "no_change_button") {
                            needUpdate = true
                            initMessage.edit({
                                content: roles,
                                embeds: [changeToEvent(title, desc, time, place, participation, isWinnersExist, isPrizePlacesExist, winnersAmount, winPlaces, winnersPrize, image, roles, rules)],
                                components: rules ? [rulesButtonAction(), action2(), eventButtonsAction()] : rules && rules != 'false' ? [rulesButtonAction(), action2(), eventButtonsAction()] : [action2(), eventButtonsAction()]
                            })
                            await initMessage.reply({content: `Шаблон был успешно изменен и сохранен`, ephemeral: true})
                            let findEvent = await Events.findOne({guildID: message.guild.id, ID: eventID})
                            findEvent.chan = chan
                            findEvent.title = title
                            findEvent.desc = desc
                            findEvent.place = place
                            findEvent.participation = participation
                            findEvent.isWinnersExist = isWinnersExist
                            findEvent.isPrizePlacesExist = isPrizePlacesExist
                            findEvent.winnersAmount = winnersAmount
                            findEvent.winPlaces = winPlaces ? winPlaces : null
                            findEvent.winnersPrize = winnersPrize ? winnersPrize : null
                            findEvent.image = image == 'false' ? null : image
                            findEvent.roles = roles
                            findEvent.rules = rules
                            findEvent.save().catch()
                            i.deferUpdate()
                        }
                })

            } else if(args[0] == "chan") {
                if(Util.checkPerm(message.member, "ADMINISTRATOR")) return crossText('У вас недостаточно прав для изменения каналов публикации', message)
                let chan = message.mentions.channels.first() || message.guild.members.cache.get(args[1]) || null
                if(!chan) return crossText(`Канал не был указан или найден`, message)
                if(chan.type != "GUILD_TEXT" && chan.type != "GUILD_NEWS") return crossText(`Канал не является текстовым`, message)
                let eventChans = bot.server.get(message.guild.id).event_channels
                if(!eventChans.includes(chan.id)){
                    if(eventChans.length == 25) return crossText(`Селект меню не может состоять больше, чем из 25 элементов`, message)
                    checkmarkText(`Канал ${chan} был успешно добавлен в селект меню выбора канала публикации`, message, `Добавление канала`)
                    let server = await Guild.findOne({guildID: message.guild.id})
                    await eventChans.push(chan.id)
                    server.event_channels = eventChans
                    server.save().catch()
                    bot.server.set(message.guild.id, {
                        prefix: bot.server.get(message.guild.id).prefix,
                        actions_channels: bot.server.get(message.guild.id).actions_channels,
                        leveling_channels: bot.server.get(message.guild.id).leveling_channels,
                        moderation_channels: bot.server.get(message.guild.id).moderation_channels,
                        warnID: bot.server.get(message.guild.id).warnID,
                        roles: bot.server.get(message.guild.id).roles,
                        event_channels: eventChans
                    })
                } else {
                    if(eventChans.length == 1) return crossText(`Селект меню не может состоять меньше, чем из 1 элемента`, message)
                    checkmarkText(`Канал ${chan} был успешно удален из селект меню выбора канала публикации`, message, `Удаление канала`)
                    let server = await Guild.findOne({guildID: message.guild.id})
                    let index = eventChans.indexOf(chan.id)
                    await eventChans.splice(index, 1)
                    server.event_channels = eventChans
                    server.save().catch()
                    bot.server.set(message.guild.id, {
                        prefix: bot.server.get(message.guild.id).prefix,
                        actions_channels: bot.server.get(message.guild.id).actions_channels,
                        leveling_channels: bot.server.get(message.guild.id).leveling_channels,
                        moderation_channels: bot.server.get(message.guild.id).moderation_channels,
                        warnID: bot.server.get(message.guild.id).warnID,
                        roles: bot.server.get(message.guild.id).roles,
                        event_channels: eventChans
                    })
                }
            } else {
                return crossText(`Аргумент **${args[0]}** не был найден`, message)
            }

    
        }catch(err){
            console.error(chalk.redBright(err.stack))
            console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
        }
    }
}