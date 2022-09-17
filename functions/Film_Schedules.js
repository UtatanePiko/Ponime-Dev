const bot = require('..')
const Discord = require('discord.js')
const dateFormat = require("dateformat")
const ms = require('ms')
const Util  = require('../functions/Util')
const { stringToDateFull, stringToDateTime} = require('../functions/Util')
const { noColor, botColorMessage } = require('../functions/Colours')
const {PUBLISH_CHANNEL_SELECTMENU, DECLINE_BUTTON, PLACE_CHANNEL_SELECT_MENU, PUBLISH_DECLINE_BUTTONS, FILM_OR_SERIAL_BUTTONS} = require('../functions/Buttons')
const { Embeds, crossText, noPerms, checkmarkText, noColorEmbed } = require('../functions/Embed') 

const cross = Util.findEmoji("cross4") 
const checkmark = Util.findEmoji("text_yes")
const coin = Util.findEmoji('CHPOKI_COIN')
module.exports = {
    async ONE_FILM_SCHEDULE(message, memberID){
        let declined = false, isActive = false, chan, isFilm = Boolean, title, year, genre, duration, series_amount, time, place, participation, image, roles
        let event_channels = bot.server.get(message.guild.id).event_channels
        let discordData

        const channelFilter = (m) => m.author.id === memberID

        let chanEmbed = new Discord.MessageEmbed().setTitle(`📽️ Создание фильма/сериала 📽️`).setColor("#2F3136")
        .setDescription(`Выберите канал, в котором будет опубликовано созданное сообщение`)
        let chanMsg = await message.reply({
            embeds: [chanEmbed], 
            components: [PUBLISH_CHANNEL_SELECTMENU(message, event_channels), DECLINE_BUTTON()]
        }) 
        const chanCollector = chanMsg.createMessageComponentCollector({channelFilter, time: 60000, errors: ['time']})
        chanCollector.on('collect', async i => {
            console.log(i.member.id, memberID)
            if (i.member.id != memberID) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
            if(i.customId == "decline_button"){
                declined = true
                chanCollector.stop()
            } else {
                chan = i.values[0]
                chanCollector.stop()
            }
            chanMsg.edit({components: [PUBLISH_CHANNEL_SELECTMENU(message, event_channels, true), DECLINE_BUTTON(true)]})
            i.deferUpdate()
        })

        chanCollector.on('end', async collected => {
            if(declined) return crossText(`Создание ивента было отменено вручную`, message)
            if(collected.map(c => c.content).length == 0) return crossText(`Никакого аргумента не было выбрано в течение 1 минуты. Создание ивента было отменено`, chanMsg)
            // if(isActive) return crossText(`Не было введено подходящего варианта за 1 минуту. Создание ивента было отменено`, message)

            let filmOrSerialEmbed = new Discord.MessageEmbed().setTitle(`📽️ Создание фильма/сериала 📽️`).setColor("#2F3136")
            .setDescription(`Вы хотите создать шаблон для фильма или сериала?`)

            let filmOrSerialMsg = await message.reply({
                embeds: [filmOrSerialEmbed], 
                components: [FILM_OR_SERIAL_BUTTONS(), DECLINE_BUTTON()]
            }) 

            const filmOrSeialCollector = filmOrSerialMsg.createMessageComponentCollector({channelFilter, time: 60000, errors: ['time']})

            filmOrSeialCollector.on('collect', async i => {
                if (i.member.id != memberID) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                if(i.customId == 'decline_button'){
                    declined = true
                } else if(i.customId == 'film_button') {
                    isFilm = true
                } else {
                    isFilm = false
                }
                filmOrSeialCollector.stop()
                i.deferUpdate()
            })

            filmOrSeialCollector.on('end', async collected => {
                filmOrSerialMsg.edit({ components: [FILM_OR_SERIAL_BUTTONS(true), DECLINE_BUTTON(true)] })
                if(declined) return crossText(`Создание ивента было отменено вручную`, message)
                if(collected.map(c => c.content).length == 0) return crossText(`Никакого аргумента не было выбрано в течение 1 минуты. Создание ивента было отменено`, chanMsg)
            
                let titleEmbed = new Discord.MessageEmbed().setTitle(`📽️ Создание ${isFilm ? "фильма" : "сериала"} 📽️`).setColor("#2F3136")
                .setDescription(`Введите название ${isFilm ? "фильма" : "сериала"}`)
                
                let titleMsg = await message.reply({
                    embeds: [titleEmbed], 
                    components: [DECLINE_BUTTON()]
                }) 
                const titleCollector = message.channel.createMessageCollector({channelFilter, time: 60000, errors: ['time']})
                const titleDeclineCollector = titleMsg.createMessageComponentCollector({channelFilter, time: 60000, errors: ['time']})
    
                titleDeclineCollector.on('collect', async i => {
                    if (i.member.id != memberID) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                    declined = true
                    titleCollector.stop()
                    titleDeclineCollector.stop()
                    i.deferUpdate()
                })
    
                titleCollector.on('collect', async(msg) => {
                    isActive = true
                    if(msg.author.id !== message.author.id) return
                    if(msg.author.bot) return
    
                    if(!msg.content) return crossText (`Сообщение пустое`, msg)
                    title = msg.content
                    msg.react(checkmark)
                    isActive = false
                    titleCollector.stop()
                })
    
                titleCollector.on('end', async collected => {
                    titleMsg.edit({components: [DECLINE_BUTTON(true)]})
                    if(declined) return crossText(`Создание ивента было отменено вручную`, message)
                    if(collected.map(c => c.content).length == 0) return crossText(`Никакого аргумента не было указано в течение 1 минуты. Создание ивента было отменено`, chanMsg)
                    if(isActive) return crossText(`Не было введено подходящего варианта за 1 минуту. Создание ивента было отменено`, message)
    
                    let yearEmbed = new Discord.MessageEmbed().setTitle(`📽️ Создание ${isFilm ? "фильма" : "сериала"} 📽️`).setColor("#2F3136")
                    .setDescription(`Введите год выхода ${isFilm ? "фильма" : "сериала"}`)
                    
                    let yearMsg = await message.reply({
                        embeds: [yearEmbed], 
                        components: [DECLINE_BUTTON()]
                    }) 
                    const yearCollector = message.channel.createMessageCollector({channelFilter, time: 60000, errors: ['time']})
                    const yearDeclineCollector = yearMsg.createMessageComponentCollector({channelFilter, time: 60000, errors: ['time']})
    
                    yearDeclineCollector.on('collect', async i => {
                        if (i.member.id != memberID) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                        declined = true
                        yearCollector.stop()
                        yearDeclineCollector.stop()
                        i.deferUpdate()
                    })
    
                    yearCollector.on('collect', async(msg) => {
                        isActive = true
                        if(msg.author.id !== message.author.id) return
                        if(msg.author.bot) return
    
                        let now = new Date
                        if(!isFinite(msg.content) || msg.content % 1 !== 0 || msg.content <= 0 || msg.content.includes("+")  || msg.content.includes(".") || msg.content > now.getFullYear()) return crossText(`Год выхода фильма должен быть целым положительным числом и не больше текущего года`, message)
                        if(!msg.content) return crossText (`Сообщение пустое`, msg)
                        year = msg.content
                        msg.react(checkmark)
                        isActive = false
                        yearCollector.stop()
                        yearDeclineCollector.stop()
                    })
    
                    yearCollector.on('end', async collected => {
                        yearMsg.edit({components: [DECLINE_BUTTON(true)]})
                        if(declined) return crossText(`Создание ивента было отменено вручную`, message)
                        if(collected.map(c => c.content).length == 0) return crossText(`Никакого аргумента не было указано в течение 1 минуты. Создание ивента было отменено`, chanMsg)
                        if(isActive) return crossText(`Не было введено подходящего варианта за 1 минуту. Создание ивента было отменено`, message)
    
                        let genreEmbed = new Discord.MessageEmbed().setTitle(`📽️ Создание ${isFilm ? "фильма" : "сериала"} 📽️`).setColor("#2F3136")
                        .setDescription(`Введите жанр(-ы) ${isFilm ? "фильма" : "сериала"}`)
                        
                        let genreMsg = await message.reply({
                            embeds: [genreEmbed], 
                            components: [DECLINE_BUTTON()]
                        }) 
                        const genreCollector = message.channel.createMessageCollector({channelFilter, time: 60000, errors: ['time']})
                        const genreDeclineCollector = genreMsg.createMessageComponentCollector({channelFilter, time: 60000, errors: ['time']})
    
                        genreDeclineCollector.on('collect', async i => {
                            if (i.member.id != memberID) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                            declined = true
                            genreCollector.stop()
                            genreDeclineCollector.stop()
                            i.deferUpdate()
                        })
    
                        genreCollector.on('collect', async(msg) => {
                            isActive = true
                            if(msg.author.id !== message.author.id) return
                            if(msg.author.bot) return
    
                            if(!msg.content) return crossText (`Сообщение пустое`, msg)
                            genre = msg.content
                            msg.react(checkmark)
                            isActive = false
                            genreCollector.stop()
                            genreDeclineCollector.stop()
                        })
                    
                        genreCollector.on('end', async collected => {
                            genreMsg.edit({components: [DECLINE_BUTTON(true)]})
                            if(declined) return crossText(`Создание ивента было отменено вручную`, message)
                            if(collected.map(c => c.content).length == 0) return crossText(`Никакого аргумента не было указано в течение 1 минуты. Создание ивента было отменено`, chanMsg)
                            if(isActive) return crossText(`Не было введено подходящего варианта за 1 минуту. Создание ивента было отменено`, message)
    
                                let seriesAmountEmbed = new Discord.MessageEmbed().setTitle(`📽️ Создание ${isFilm ? "фильма" : "сериала"} 📽️`).setColor("#2F3136")
                                .setDescription(`Введите количество серий в ${isFilm ? "фильме" : "сериале"}`)

                                let seriesAmountMsg = await message.reply({
                                    embeds: [seriesAmountEmbed],
                                    components: [DECLINE_BUTTON()]
                                }) 
                                const seriesAmountCollector = message.channel.createMessageCollector({channelFilter, time: 60000, errors: ['time']})
                                const declineSeriesAmountCollector = seriesAmountMsg.createMessageComponentCollector({channelFilter, time: 60000, errors: ['time']})
        

                                declineSeriesAmountCollector.on('collect', async i => {
                                    if (i.member.id != memberID) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                                    declined = true
                                    seriesAmountCollector.stop()
                                    declineSeriesAmountCollector.stop()
                                    i.deferUpdate()
                                })
                                
                                seriesAmountCollector.on('collect', async(msg) => {
                                    isActive = true
                                    if(msg.author.id !== message.author.id) return
                                    if(msg.author.bot) return
                        
                                    if(!isFinite(msg.content) || msg.content % 1 !== 0 || msg.content <= 0 || msg.content.includes("+")  || msg.content.includes(".")) return crossText(`Количество серий должно быть целым положительным числом`, message)
                                    if(!msg.content) return crossText (`Сообщение пустое`, msg)
                                    series_amount = msg.content
                                    msg.react(checkmark)
                                    isActive = false
                                    seriesAmountCollector.stop()
                                })

                                seriesAmountCollector.on('end', async collected => {
                                    seriesAmountMsg.edit({ components: [DECLINE_BUTTON(true)] })
                                    if(declined) return crossText(`Создание ивента было отменено вручную`, message)
                                    if(collected.map(c => c.content).length == 0) return crossText(`Никакого аргумента не было указано в течение 1 минуты. Создание ивента было отменено`, chanMsg)
                                    if(isActive) return crossText(`Не было введено подходящего варианта за 1 минуту. Создание ивента было отменено`, message)

                                    let durationEmbed = new Discord.MessageEmbed().setTitle(`📽️ Создание ${isFilm ? "фильма" : "сериала"} 📽️`).setColor("#2F3136")
                                    .setDescription(`Введите длительность ${series_amount > 1 ? "1 серии" : ""}\nПример: \`${series_amount == 1 ? "1ч 35м" : "45м"}\``)
                                    
                                    let durationMsg = await message.reply({
                                        embeds: [durationEmbed], 
                                        components: [DECLINE_BUTTON()]
                                    }) 
                                    const durationCollector = message.channel.createMessageCollector({channelFilter, time: 60000, errors: ['time']})
                                    const durationDeclineCollector = durationMsg.createMessageComponentCollector({channelFilter, time: 60000, errors: ['time']})
            
                                    durationDeclineCollector.on('collect', async i => {
                                        if (i.member.id != memberID) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                                        declined = true
                                        durationCollector.stop()
                                        durationDeclineCollector.stop()
                                        i.deferUpdate()
                                    })
            
                                    durationCollector.on('collect', async(msg) => {
                                        isActive = true
                                        if(msg.author.id !== message.author.id) return
                                        if(msg.author.bot) return
            
                                        if(!msg.content) return crossText (`Сообщение пустое`, msg)
                                        duration = msg.content
                                        msg.react(checkmark)
                                        isActive = false
                                        durationCollector.stop()
                                        durationDeclineCollector.stop()
                                    })

                                    durationCollector.on('end', async collected => {
                                        durationMsg.edit({components: [DECLINE_BUTTON(true)]})
                                        if(declined) return crossText(`Создание ивента было отменено вручную`, message)
                                        if(collected.map(c => c.content).length == 0) return crossText(`Никакого аргумента не было указано в течение 1 минуты. Создание ивента было отменено`, chanMsg)
                                        if(isActive) return crossText(`Не было введено подходящего варианта за 1 минуту. Создание ивента было отменено`, message)
        
                                        let timeEmbed = new Discord.MessageEmbed().setTitle(`📽️ Создание ${isFilm ? "фильма" : "сериала"} 📽️`).setColor("#2F3136")
                                        .setDescription(`Введите время проведения ${isFilm ? "фильма" : "сериала"} в формате \`ЧЧ:ММ\` (Напр.: \`20:00\`)\nЕсли ${isFilm ? "фильм" : "сериал"} планируется не сегодня, то введите время проведения в полном формате \`дд.мм.гггг ЧЧ:ММ\` (Напр.: \`13.06.2022 20:00\`)`)
                                        
                                        let timeMsg = await message.reply({
                                            embeds: [timeEmbed],
                                            components: [DECLINE_BUTTON()]
                                        }) 
                                        const timeCollector = message.channel.createMessageCollector({channelFilter, time: 60000, errors: ['time']})
                                        const declineTimeCollector = timeMsg.createMessageComponentCollector({channelFilter, time: 60000, errors: ['time']})
                
                                        declineTimeCollector.on('collect', async i => {
                                            if (i.member.id != memberID) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                                            declined = true
                                            timeCollector.stop()
                                            declineTimeCollector.stop()
                                            i.deferUpdate()
                                        })
                                        
                                        timeCollector.on('collect', async(msg) => {
                                            isActive = true
                                            if(msg.author.id !== message.author.id) return
                                            if(msg.author.bot) return
                                
                                            let data
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
                                            timeMsg.edit({components: [DECLINE_BUTTON(true)]})
                                            if(declined) return crossText(`Создание ивента было отменено вручную`, message)
                                            if(collected.map(c => c.content).length == 0) return crossText(`Никакого аргумента не было указано в течение 1 минуты. Создание ивента было отменено`, chanMsg)
                                            if(isActive) return crossText(`Не было введено подходящего варианта за 1 минуту. Создание ивента было отменено`, message)
            
                                            let eventChannels = message.guild.channels.cache.filter(ch => ch.type == "GUILD_VOICE" &&
                                            (message.guild.channels.cache.get(ch.parentId).name.toLowerCase().includes("кинозал")))
                                            .sort(function (a, b) {
                                                return a.rawPosition - b.rawPosition;
                                            })
            
            
                                            let chanEmbed = new Discord.MessageEmbed().setTitle(`📽️ Создание ${isFilm ? "фильма" : "сериала"} 📽️`).setColor("#2F3136")
                                            .setDescription(`Выберите войс, в котором будет происходить просмотр ${isFilm ? "фильма" : "сериала"}`)
                                            let placeMsg = await message.reply({
                                                embeds: [chanEmbed], 
                                                components: [PLACE_CHANNEL_SELECT_MENU(message, eventChannels), DECLINE_BUTTON()]
                                            }) 
                                            const placeCollector = placeMsg.createMessageComponentCollector({channelFilter, time: 60000, errors: ['time']})
                                            placeCollector.on('collect', async i => {
                                                console.log(i.member.id, memberID)
                                                if (i.member.id != memberID) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                                                if(i.customId == "decline_button"){
                                                    declined = true
                                                    placeCollector.stop()
                                                } else {
                                                    place = i.values[0]
                                                    placeCollector.stop()
                                                }
                                                placeMsg.edit({components: [PLACE_CHANNEL_SELECT_MENU(message, eventChannels, true), DECLINE_BUTTON(true)]})
                                                i.deferUpdate()
                                            })
            
                                            placeCollector.on('end', async collected => {
                                                if(declined) return crossText(`Создание ивента было отменено вручную`, message)
                                                if(collected.map(c => c.content).length == 0) return crossText(`Никакого аргумента не было указано в течение 1 минуты. Создание ивента было отменено`, chanMsg)
                                                if(isActive) return crossText(`Не было введено подходящего варианта за 1 минуту. Создание ивента было отменено`, message)
            
                                                let participationEmbed = new Discord.MessageEmbed().setTitle(`📽️ Создание ${isFilm ? "фильма" : "сериала"} 📽️`).setColor("#2F3136")
                                                .setDescription(`Введите награду за просмотр ${series_amount > 1 ? "1 серии" : ""}`)
                                                
                                                let participationMsg = await message.reply({
                                                    embeds: [participationEmbed], 
                                                    components: [DECLINE_BUTTON()]
                                                }) 
                                                const participationCollector = message.channel.createMessageCollector({channelFilter, time: 60000, errors: ['time']})
                                                const participationDeclineCollector = participationMsg.createMessageComponentCollector({channelFilter, time: 60000, errors: ['time']})
                            
                                                participationDeclineCollector.on('collect', async i => {
                                                    if (i.member.id != memberID) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                                                    declined = true
                                                    participationCollector.stop()
                                                    participationDeclineCollector.stop()
                                                    i.deferUpdate()
                                                })
                            
                                                participationCollector.on('collect', async(msg) => {
                                                    isActive = true
                                                    if(msg.author.id !== message.author.id) return
                                                    if(msg.author.bot) return
                            
                                                    if(!msg.content) return crossText (`Сообщение пустое`, msg)
                                                    participation = msg.content
                                                    msg.react(checkmark)
                                                    isActive = false
                                                    participationCollector.stop()
                                                    participationDeclineCollector.stop()
                                                })
            
                                                participationCollector.on('end', async collected => {
                                                    participationMsg.edit({components: [DECLINE_BUTTON(true)]})
                                                    if(declined) return crossText(`Создание ивента было отменено вручную`, message)
                                                    if(collected.map(c => c.content).length == 0) return crossText(`Никакого аргумента не было указано в течение 1 минуты. Создание ивента было отменено`, chanMsg)
                                                    if(isActive) return crossText(`Не было введено подходящего варианта за 1 минуту. Создание ивента было отменено`, message)
                
                                                    let imageEmbed = new Discord.MessageEmbed().setTitle(`📽️ Создание ${isFilm ? "фильма" : "сериала"} 📽️`).setColor("#2F3136")
                                                    .setDescription(`Отправьте обложку ${isFilm ? "фильма" : "сериала"}`)
                                                    let imageMsg = await message.reply({embeds: [imageEmbed], components: [DECLINE_BUTTON()]}) 
                                                    const imageCollector = message.channel.createMessageCollector({channelFilter, time: 60000, errors: ['time']})
                                                    const skipDeclineTimeCollector = imageMsg.createMessageComponentCollector({channelFilter, time: 60000, errors: ['time']})
                                                    declineTimeCollector.stop()
            
                                                    skipDeclineTimeCollector.on('collect', async i => {
                                                        if (i.member.id != message.member.id) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                                                        if(i.customId == "decline_button"){
                                                            declined = true
                                                            imageCollector.stop()
                                                            skipDeclineTimeCollector.stop()
                                                        }
                                                        i.deferUpdate()
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
                                                        imageMsg.edit({components: [DECLINE_BUTTON(true)]})
                                                        if(declined) return crossText(`Создание ивента было отменено вручную`, message)
                                                        if(collected.map(c => c.content).length == 0) return crossText(`Никакого аргумента не было указано в течение 1 минуты. Создание ивента было отменено`, chanMsg)
                                                        if(isActive) return crossText(`Не было введено подходящего варианта за 1 минуту. Создание ивента было отменено`, message)
                    
                                                        let rolesEmbed = new Discord.MessageEmbed().setTitle(`📽️ Создание ${isFilm ? "фильма" : "сериала"} 📽️`).setColor("#2F3136")
                                                        .setDescription(`Введите самое верхнее сообщение перед эмбедом\nПредполагается упоминание ролей, которые должны получить оповещение об ивенте`)
                                                        let rolesMsg = await message.reply({embeds: [rolesEmbed], components: [DECLINE_BUTTON()]}) 
                                                        const rolesCollector = message.channel.createMessageCollector({channelFilter, time: 60000, errors: ['time']})
                                                        const declineRolesCollector = rolesMsg.createMessageComponentCollector({channelFilter, time: 60000, errors: ['time']})
                    
                                                        declineRolesCollector.on('collect', async i => {
                                                            if (i.member.id != message.member.id) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                                                            declined = true
                                                            rolesCollector.stop()
                                                            declineRolesCollector.stop()
                                                            i.deferUpdate()
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
                                                            rolesMsg.edit({components:[DECLINE_BUTTON(true)]})
                                                            if(declined) return crossText(`Создание ивента было отменено вручную`, message)
                                                            if(collected.map(c => c.content).length == 0) return crossText(`Никакого аргумента не было указано в течение 1 минуты. Создание ивента было отменено`, chanMsg)
                                                            if(isActive) return crossText(`Не было введено подходящего варианта за 1 минуту. Создание ивента было отменено`, message)
                    
                                                            let embedCreate = (preview) => {
                                                                let embed = new Discord.MessageEmbed().setColor(noColor())
                                                                .setTitle(title)
                                                                .setDescription(`**Жанр:** ${genre}\n**Длительность${series_amount > 1 ? ` одной серии`: ":"}** ${duration}${series_amount > 1 ? `\n**Количество серий:** ${series_amount}` : ""}\n**Дата выхода:** ${year} год\n**Место встречи и начало:** <#${place}> ${time} по МСК\n**Ведущий:** ${message.member}\n**Награда за просмотр${series_amount > 1 ? ` одной серии:` : ":"}** ${participation} ${coin}`)
                                                                .setImage(image)
                                                                if(preview) embed.setFooter({text:`Это превью ивента`})
                                                                return embed
                                                            }
            
                                                            let previewMsg = await message.channel.send({
                                                                content: roles, 
                                                                embeds: [embedCreate(true)], 
                                                                components: [PUBLISH_DECLINE_BUTTONS()]
                                                            })
                                                            const declinePublishCollector = previewMsg.createMessageComponentCollector({channelFilter, time: 300000, errors: ['time']})
            
                                                            declinePublishCollector.on('collect', async i => {
                                                            if(i.member.id != message.member.id) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                                                            if(i.customId == 'decline_button'){
                                                                declinePublishCollector.stop()
                                                                previewMsg.edit({
                                                                    components: [PUBLISH_DECLINE_BUTTONS(true)]
                                                                })
                                                                crossText(`Создание ивента было отменено вручную`, message)
                                                                i.deferUpdate()
                                                            } else if(i.customId == "publish_button") {
                                                                if(title.replace(/\*/g, "").replace(/\`/g, "").replace(/\_/g, "").length > 100) return await i.reply({content: `Тайтл ивента не может быть больше 100 символов\nЕсли вам кажется, что символов меньше, то кастомные эмодзи занимают 33 символа каждый из-за их уникального id и названия`, ephemeral: true})
            
                                                                let findChan = message.guild.channels.cache.get(chan)
                                                                findChan.send({content: roles, embeds: [embedCreate(false)]})
                                                                return i.reply({content: "Уведомление было успешно опубликовано!"})
                                                                //i.deferUpdate()
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
                    })
                })
            })
        })
    },

    async TWO_FILMS_SCHEDULE(message, memberID){
        let declined = false, isActive = false, chan, isFilm = Boolean, title, year, genre, duration, series_amount, time, place, participation, image, roles
        let event_channels = bot.server.get(message.guild.id).event_channels
        let discordData

        const channelFilter = (m) => m.author.id === memberID

        let chanEmbed = new Discord.MessageEmbed().setTitle(`📽️ Создание фильма/сериала 📽️`).setColor("#2F3136")
        .setDescription(`Выберите канал, в котором будет опубликовано созданное сообщение`)
        let chanMsg = await message.reply({
            embeds: [chanEmbed], 
            components: [PUBLISH_CHANNEL_SELECTMENU(message, event_channels), DECLINE_BUTTON()]
        }) 
        const chanCollector = chanMsg.createMessageComponentCollector({channelFilter, time: 60000, errors: ['time']})
        chanCollector.on('collect', async i => {
            console.log(i.member.id, memberID)
            if (i.member.id != memberID) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
            if(i.customId == "decline_button"){
                declined = true
                chanCollector.stop()
            } else {
                chan = i.values[0]
                chanCollector.stop()
            }
            chanMsg.edit({components: [PUBLISH_CHANNEL_SELECTMENU(message, event_channels, true), DECLINE_BUTTON(true)]})
            i.deferUpdate()
        })

        chanCollector.on('end', async collected => {
            if(declined) return crossText(`Создание ивента было отменено вручную`, message)
            if(collected.map(c => c.content).length == 0) return crossText(`Никакого аргумента не было выбрано в течение 1 минуты. Создание ивента было отменено`, chanMsg)
            // if(isActive) return crossText(`Не было введено подходящего варианта за 1 минуту. Создание ивента было отменено`, message)

            let filmOrSerialEmbed = new Discord.MessageEmbed().setTitle(`📽️ Создание фильма/сериала 📽️`).setColor("#2F3136")
            .setDescription(`Вы хотите создать шаблон для фильма или сериала?`)

            let filmOrSerialMsg = await message.reply({
                embeds: [filmOrSerialEmbed], 
                components: [FILM_OR_SERIAL_BUTTONS(), DECLINE_BUTTON()]
            }) 

            const filmOrSeialCollector = filmOrSerialMsg.createMessageComponentCollector({channelFilter, time: 60000, errors: ['time']})

            filmOrSeialCollector.on('collect', async i => {
                if (i.member.id != memberID) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                if(i.customId == 'decline_button'){
                    declined = true
                } else if(i.customId == 'film_button') {
                    isFilm = true
                } else {
                    isFilm = false
                }
                filmOrSeialCollector.stop()
                i.deferUpdate()
            })

            filmOrSeialCollector.on('end', async collected => {
                filmOrSerialMsg.edit({ components: [FILM_OR_SERIAL_BUTTONS(true), DECLINE_BUTTON(true)] })
                if(declined) return crossText(`Создание ивента было отменено вручную`, message)
                if(collected.map(c => c.content).length == 0) return crossText(`Никакого аргумента не было выбрано в течение 1 минуты. Создание ивента было отменено`, chanMsg)
            
                let titleEmbed = new Discord.MessageEmbed().setTitle(`📽️ Создание ${isFilm ? "фильма" : "сериала"} 📽️`).setColor("#2F3136")
                .setDescription(`Введите название ${isFilm ? "фильма" : "сериала"}`)
                
                let titleMsg = await message.reply({
                    embeds: [titleEmbed], 
                    components: [DECLINE_BUTTON()]
                }) 
                const titleCollector = message.channel.createMessageCollector({channelFilter, time: 60000, errors: ['time']})
                const titleDeclineCollector = titleMsg.createMessageComponentCollector({channelFilter, time: 60000, errors: ['time']})
    
                titleDeclineCollector.on('collect', async i => {
                    if (i.member.id != memberID) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                    declined = true
                    titleCollector.stop()
                    titleDeclineCollector.stop()
                    i.deferUpdate()
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
                    titleMsg.edit({components: [DECLINE_BUTTON(true)]})
                    if(declined) return crossText(`Создание ивента было отменено вручную`, message)
                    if(collected.map(c => c.content).length == 0) return crossText(`Никакого аргумента не было указано в течение 1 минуты. Создание ивента было отменено`, chanMsg)
                    if(isActive) return crossText(`Не было введено подходящего варианта за 1 минуту. Создание ивента было отменено`, message)
    
                    let yearEmbed = new Discord.MessageEmbed().setTitle(`📽️ Создание ${isFilm ? "фильма" : "сериала"} 📽️`).setColor("#2F3136")
                    .setDescription(`Введите год выхода ${isFilm ? "фильма" : "сериала"}`)
                    
                    let yearMsg = await message.reply({
                        embeds: [yearEmbed], 
                        components: [DECLINE_BUTTON()]
                    }) 
                    const yearCollector = message.channel.createMessageCollector({channelFilter, time: 60000, errors: ['time']})
                    const yearDeclineCollector = yearMsg.createMessageComponentCollector({channelFilter, time: 60000, errors: ['time']})
    
                    yearDeclineCollector.on('collect', async i => {
                        if (i.member.id != memberID) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                        declined = true
                        yearCollector.stop()
                        yearDeclineCollector.stop()
                        i.deferUpdate()
                    })
    
                    yearCollector.on('collect', async(msg) => {
                        isActive = true
                        if(msg.author.id !== message.author.id) return
                        if(msg.author.bot) return
    
                        let now = new Date
                        if(!isFinite(msg.content) || msg.content % 1 !== 0 || msg.content <= 0 || msg.content.includes("+")  || msg.content.includes(".") || msg.content > now.getFullYear()) return crossText(`Год выхода фильма должен быть целым положительным числом и не больше текущего года`, message)
                        if(!msg.content) return crossText (`Сообщение пустое`, msg)
                        year = msg.content
                        msg.react(checkmark)
                        isActive = false
                        yearCollector.stop()
                        yearDeclineCollector.stop()
                    })
    
                    yearCollector.on('end', async collected => {
                        yearMsg.edit({components: [DECLINE_BUTTON(true)]})
                        if(declined) return crossText(`Создание ивента было отменено вручную`, message)
                        if(collected.map(c => c.content).length == 0) return crossText(`Никакого аргумента не было указано в течение 1 минуты. Создание ивента было отменено`, chanMsg)
                        if(isActive) return crossText(`Не было введено подходящего варианта за 1 минуту. Создание ивента было отменено`, message)
    
                        let genreEmbed = new Discord.MessageEmbed().setTitle(`📽️ Создание ${isFilm ? "фильма" : "сериала"} 📽️`).setColor("#2F3136")
                        .setDescription(`Введите жанр(-ы) ${isFilm ? "фильма" : "сериала"}`)
                        
                        let genreMsg = await message.reply({
                            embeds: [genreEmbed], 
                            components: [DECLINE_BUTTON()]
                        }) 
                        const genreCollector = message.channel.createMessageCollector({channelFilter, time: 60000, errors: ['time']})
                        const genreDeclineCollector = genreMsg.createMessageComponentCollector({channelFilter, time: 60000, errors: ['time']})
    
                        genreDeclineCollector.on('collect', async i => {
                            if (i.member.id != memberID) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                            declined = true
                            genreCollector.stop()
                            genreDeclineCollector.stop()
                            i.deferUpdate()
                        })
    
                        genreCollector.on('collect', async(msg) => {
                            isActive = true
                            if(msg.author.id !== message.author.id) return
                            if(msg.author.bot) return
    
                            if(!msg.content) return crossText (`Сообщение пустое`, msg)
                            genre = msg.content
                            msg.react(checkmark)
                            isActive = false
                            genreCollector.stop()
                            genreDeclineCollector.stop()
                        })
                    
                        genreCollector.on('end', async collected => {
                            genreMsg.edit({components: [DECLINE_BUTTON(true)]})
                            if(declined) return crossText(`Создание ивента было отменено вручную`, message)
                            if(collected.map(c => c.content).length == 0) return crossText(`Никакого аргумента не было указано в течение 1 минуты. Создание ивента было отменено`, chanMsg)
                            if(isActive) return crossText(`Не было введено подходящего варианта за 1 минуту. Создание ивента было отменено`, message)
    
                            let seriesAmountEmbed = new Discord.MessageEmbed().setTitle(`📽️ Создание ${isFilm ? "фильма" : "сериала"} 📽️`).setColor("#2F3136")
                            .setDescription(`Введите количество серий в ${isFilm ? "фильме" : "сериале"}`)

                            let seriesAmountMsg = await message.reply({
                                embeds: [seriesAmountEmbed],
                                components: [DECLINE_BUTTON()]
                            }) 
                            const seriesAmountCollector = message.channel.createMessageCollector({channelFilter, time: 60000, errors: ['time']})
                            const declineSeriesAmountCollector = seriesAmountMsg.createMessageComponentCollector({channelFilter, time: 60000, errors: ['time']})
    

                            declineSeriesAmountCollector.on('collect', async i => {
                                if (i.member.id != memberID) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                                declined = true
                                seriesAmountCollector.stop()
                                declineSeriesAmountCollector.stop()
                                i.deferUpdate()
                            })
                            
                            seriesAmountCollector.on('collect', async(msg) => {
                                isActive = true
                                if(msg.author.id !== message.author.id) return
                                if(msg.author.bot) return
                    
                                if(!isFinite(msg.content) || msg.content % 1 !== 0 || msg.content <= 0 || msg.content.includes("+")  || msg.content.includes(".")) return crossText(`Количество серий должно быть целым положительным числом`, message)
                                if(!msg.content) return crossText (`Сообщение пустое`, msg)
                                series_amount = msg.content
                                msg.react(checkmark)
                                isActive = false
                                seriesAmountCollector.stop()
                            })

                            seriesAmountCollector.on('end', async collected => {
                                seriesAmountMsg.edit({ components: [DECLINE_BUTTON(true)] })
                                if(declined) return crossText(`Создание ивента было отменено вручную`, message)
                                if(collected.map(c => c.content).length == 0) return crossText(`Никакого аргумента не было указано в течение 1 минуты. Создание ивента было отменено`, chanMsg)
                                if(isActive) return crossText(`Не было введено подходящего варианта за 1 минуту. Создание ивента было отменено`, message)

                                let durationEmbed = new Discord.MessageEmbed().setTitle(`📽️ Создание ${isFilm ? "фильма" : "сериала"} 📽️`).setColor("#2F3136")
                                .setDescription(`Введите длительность ${series_amount > 1 ? "1 серии" : ""}\nПример: \`${series_amount == 1 ? "1ч 35м" : "45м"}\``)
                                
                                let durationMsg = await message.reply({
                                    embeds: [durationEmbed], 
                                    components: [DECLINE_BUTTON()]
                                }) 
                                const durationCollector = message.channel.createMessageCollector({channelFilter, time: 60000, errors: ['time']})
                                const durationDeclineCollector = durationMsg.createMessageComponentCollector({channelFilter, time: 60000, errors: ['time']})
        
                                durationDeclineCollector.on('collect', async i => {
                                    if (i.member.id != memberID) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                                    declined = true
                                    durationCollector.stop()
                                    durationDeclineCollector.stop()
                                    i.deferUpdate()
                                })
        
                                durationCollector.on('collect', async(msg) => {
                                    isActive = true
                                    if(msg.author.id !== message.author.id) return
                                    if(msg.author.bot) return
        
                                    if(!msg.content) return crossText (`Сообщение пустое`, msg)
                                    duration = msg.content
                                    msg.react(checkmark)
                                    isActive = false
                                    durationCollector.stop()
                                    durationDeclineCollector.stop()
                                })

                                durationCollector.on('end', async collected => {
                                    durationMsg.edit({components: [DECLINE_BUTTON(true)]})
                                    if(declined) return crossText(`Создание ивента было отменено вручную`, message)
                                    if(collected.map(c => c.content).length == 0) return crossText(`Никакого аргумента не было указано в течение 1 минуты. Создание ивента было отменено`, chanMsg)
                                    if(isActive) return crossText(`Не было введено подходящего варианта за 1 минуту. Создание ивента было отменено`, message)
            
                                    let imageEmbed = new Discord.MessageEmbed().setTitle(`📽️ Создание ${isFilm ? "фильма" : "сериала"} 📽️`).setColor("#2F3136")
                                    .setDescription(`Отправьте обложку ${isFilm ? "фильма" : "сериала"}`)
                                    let imageMsg = await message.reply({embeds: [imageEmbed], components: [DECLINE_BUTTON()]}) 
                                    const imageCollector = message.channel.createMessageCollector({channelFilter, time: 60000, errors: ['time']})
                                    const skipDeclineTimeCollector = imageMsg.createMessageComponentCollector({channelFilter, time: 60000, errors: ['time']})

                                    skipDeclineTimeCollector.on('collect', async i => {
                                        if (i.member.id != message.member.id) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                                        if(i.customId == "decline_button"){
                                            declined = true
                                            imageCollector.stop()
                                            skipDeclineTimeCollector.stop()
                                        }
                                        i.deferUpdate()
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
                                        imageMsg.edit({components: [DECLINE_BUTTON(true)]})
                                        if(declined) return crossText(`Создание ивента было отменено вручную`, message)
                                        if(collected.map(c => c.content).length == 0) return crossText(`Никакого аргумента не было указано в течение 1 минуты. Создание ивента было отменено`, chanMsg)
                                        if(isActive) return crossText(`Не было введено подходящего варианта за 1 минуту. Создание ивента было отменено`, message)

                                        let participationEmbed = new Discord.MessageEmbed().setTitle(`📽️ Создание ${isFilm ? "фильма" : "сериала"} 📽️`).setColor("#2F3136")
                                        .setDescription(`Введите награду за просмотр ${series_amount > 1 ? "1 серии" : ""}`)
                                        
                                        let participationMsg = await message.reply({
                                            embeds: [participationEmbed], 
                                            components: [DECLINE_BUTTON()]
                                        }) 
                                        const participationCollector = message.channel.createMessageCollector({channelFilter, time: 60000, errors: ['time']})
                                        const participationDeclineCollector = participationMsg.createMessageComponentCollector({channelFilter, time: 60000, errors: ['time']})
                    
                                        participationDeclineCollector.on('collect', async i => {
                                            if (i.member.id != memberID) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                                            declined = true
                                            participationCollector.stop()
                                            participationDeclineCollector.stop()
                                            i.deferUpdate()
                                        })
                    
                                        participationCollector.on('collect', async(msg) => {
                                            isActive = true
                                            if(msg.author.id !== message.author.id) return
                                            if(msg.author.bot) return
                    
                                            if(!msg.content) return crossText (`Сообщение пустое`, msg)
                                            participation = msg.content
                                            msg.react(checkmark)
                                            isActive = false
                                            participationCollector.stop()
                                            participationDeclineCollector.stop()
                                        })
    
                                        participationCollector.on('end', async collected => {
                                            participationMsg.edit({components: [DECLINE_BUTTON(true)]})
                                            if(declined) return crossText(`Создание ивента было отменено вручную`, message)
                                            if(collected.map(c => c.content).length == 0) return crossText(`Никакого аргумента не было указано в течение 1 минуты. Создание ивента было отменено`, chanMsg)
                                            if(isActive) return crossText(`Не было введено подходящего варианта за 1 минуту. Создание ивента было отменено`, message)

                                            let isFilm2 = Boolean, title2, year2, genre2, duration2, series_amount2, image2, participation2

                                            let filmOrSerialEmbed = new Discord.MessageEmbed().setTitle(`📽️ Создание фильма/сериала 2📽️`).setColor("#2F3136")
                                            .setDescription(`Вы хотите создать шаблон для фильма или сериала?`)
    
                                            let filmOrSerialMsg = await message.reply({
                                            embeds: [filmOrSerialEmbed], 
                                            components: [FILM_OR_SERIAL_BUTTONS(), DECLINE_BUTTON()]
                                            }) 
                                            
                                            const filmOrSeialCollector = filmOrSerialMsg.createMessageComponentCollector({channelFilter, time: 60000, errors: ['time']})
                                            
                                            filmOrSeialCollector.on('collect', async i => {
                                                if (i.member.id != memberID) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                                                if(i.customId == 'decline_button'){
                                                    declined = true
                                                } else if(i.customId == 'film_button') {
                                                    isFilm2 = true
                                                } else {
                                                    isFilm2 = false
                                                }
                                                filmOrSeialCollector.stop()
                                                i.deferUpdate()
                                            })
                                            
                                            filmOrSeialCollector.on('end', async collected => {
                                            filmOrSerialMsg.edit({ components: [FILM_OR_SERIAL_BUTTONS(true), DECLINE_BUTTON(true)] })
                                            if(declined) return crossText(`Создание ивента было отменено вручную`, message)
                                            if(collected.map(c => c.content).length == 0) return crossText(`Никакого аргумента не было выбрано в течение 1 минуты. Создание ивента было отменено`, chanMsg)
                                            
                                            let titleEmbed = new Discord.MessageEmbed().setTitle(`📽️ Создание ${isFilm2 ? "фильма" : "сериала"} 2 📽️`).setColor("#2F3136")
                                            .setDescription(`Введите название ${isFilm2 ? "фильма" : "сериала"}`)
                                            
                                            let titleMsg = await message.reply({
                                                embeds: [titleEmbed], 
                                                components: [DECLINE_BUTTON()]
                                            }) 
                                            const titleCollector = message.channel.createMessageCollector({channelFilter, time: 60000, errors: ['time']})
                                            const titleDeclineCollector = titleMsg.createMessageComponentCollector({channelFilter, time: 60000, errors: ['time']})
                                            
                                            titleDeclineCollector.on('collect', async i => {
                                                if (i.member.id != memberID) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                                                declined = true
                                                titleCollector.stop()
                                                titleDeclineCollector.stop()
                                                i.deferUpdate()
                                            })
                                            
                                            titleCollector.on('collect', async(msg) => {
                                                isActive = true
                                                if(msg.author.id !== message.author.id) return
                                                if(msg.author.bot) return
                                            
                                                title2 = msg.content
                                                if(!title2) return crossText (`Сообщение пустое`, msg)
                                                msg.react(checkmark)
                                                isActive = false
                                                titleCollector.stop()
                                            })
                                            
                                            titleCollector.on('end', async collected => {
                                                titleMsg.edit({components: [DECLINE_BUTTON(true)]})
                                                if(declined) return crossText(`Создание ивента было отменено вручную`, message)
                                                if(collected.map(c => c.content).length == 0) return crossText(`Никакого аргумента не было указано в течение 1 минуты. Создание ивента было отменено`, chanMsg)
                                                if(isActive) return crossText(`Не было введено подходящего варианта за 1 минуту. Создание ивента было отменено`, message)
                                            
                                                let yearEmbed = new Discord.MessageEmbed().setTitle(`📽️ Создание ${isFilm2 ? "фильма" : "сериала"} 2 📽️`).setColor("#2F3136")
                                                .setDescription(`Введите год выхода ${isFilm2 ? "фильма" : "сериала"}`)
                                                
                                                let yearMsg = await message.reply({
                                                    embeds: [yearEmbed], 
                                                    components: [DECLINE_BUTTON()]
                                                }) 
                                                const yearCollector = message.channel.createMessageCollector({channelFilter, time: 60000, errors: ['time']})
                                                const yearDeclineCollector = yearMsg.createMessageComponentCollector({channelFilter, time: 60000, errors: ['time']})
                                            
                                                yearDeclineCollector.on('collect', async i => {
                                                    if (i.member.id != memberID) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                                                    declined = true
                                                    yearCollector.stop()
                                                    yearDeclineCollector.stop()
                                                    i.deferUpdate()
                                                })
                                            
                                                yearCollector.on('collect', async(msg) => {
                                                    isActive = true
                                                    if(msg.author.id !== message.author.id) return
                                                    if(msg.author.bot) return
                                            
                                                    let now = new Date
                                                    if(!isFinite(msg.content) || msg.content % 1 !== 0 || msg.content <= 0 || msg.content.includes("+")  || msg.content.includes(".") || msg.content > now.getFullYear()) return crossText(`Год выхода фильма должен быть целым положительным числом и не больше текущего года`, message)
                                                    if(!msg.content) return crossText (`Сообщение пустое`, msg)
                                                    year2 = msg.content
                                                    msg.react(checkmark)
                                                    isActive = false
                                                    yearCollector.stop()
                                                    yearDeclineCollector.stop()
                                                })
                                            
                                                yearCollector.on('end', async collected => {
                                                    yearMsg.edit({components: [DECLINE_BUTTON(true)]})
                                                    if(declined) return crossText(`Создание ивента было отменено вручную`, message)
                                                    if(collected.map(c => c.content).length == 0) return crossText(`Никакого аргумента не было указано в течение 1 минуты. Создание ивента было отменено`, chanMsg)
                                                    if(isActive) return crossText(`Не было введено подходящего варианта за 1 минуту. Создание ивента было отменено`, message)
                                            
                                                    let genreEmbed = new Discord.MessageEmbed().setTitle(`📽️ Создание ${isFilm2 ? "фильма" : "сериала"} 2 📽️`).setColor("#2F3136")
                                                    .setDescription(`Введите жанр(-ы) ${isFilm2 ? "фильма" : "сериала"}`)
                                                    
                                                    let genreMsg = await message.reply({
                                                        embeds: [genreEmbed], 
                                                        components: [DECLINE_BUTTON()]
                                                    }) 
                                                    const genreCollector = message.channel.createMessageCollector({channelFilter, time: 60000, errors: ['time']})
                                                    const genreDeclineCollector = genreMsg.createMessageComponentCollector({channelFilter, time: 60000, errors: ['time']})
                                            
                                                    genreDeclineCollector.on('collect', async i => {
                                                        if (i.member.id != memberID) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                                                        declined = true
                                                        genreCollector.stop()
                                                        genreDeclineCollector.stop()
                                                        i.deferUpdate()
                                                    })
                                            
                                                    genreCollector.on('collect', async(msg) => {
                                                        isActive = true
                                                        if(msg.author.id !== message.author.id) return
                                                        if(msg.author.bot) return
                                            
                                                        if(!msg.content) return crossText (`Сообщение пустое`, msg)
                                                        genre2 = msg.content
                                                        msg.react(checkmark)
                                                        isActive = false
                                                        genreCollector.stop()
                                                        genreDeclineCollector.stop()
                                                    })
                                                
                                                    genreCollector.on('end', async collected => {
                                                        genreMsg.edit({components: [DECLINE_BUTTON(true)]})
                                                        if(declined) return crossText(`Создание ивента было отменено вручную`, message)
                                                        if(collected.map(c => c.content).length == 0) return crossText(`Никакого аргумента не было указано в течение 1 минуты. Создание ивента было отменено`, chanMsg)
                                                        if(isActive) return crossText(`Не было введено подходящего варианта за 1 минуту. Создание ивента было отменено`, message)
                                            
                                                            let seriesAmountEmbed = new Discord.MessageEmbed().setTitle(`📽️ Создание ${isFilm2 ? "фильма" : "сериала"} 2 📽️`).setColor("#2F3136")
                                                            .setDescription(`Введите количество серий в ${isFilm2 ? "фильме" : "сериале"}`)
                                            
                                                            let seriesAmountMsg = await message.reply({
                                                                embeds: [seriesAmountEmbed],
                                                                components: [DECLINE_BUTTON()]
                                                            }) 
                                                            const seriesAmountCollector = message.channel.createMessageCollector({channelFilter, time: 60000, errors: ['time']})
                                                            const declineSeriesAmountCollector = seriesAmountMsg.createMessageComponentCollector({channelFilter, time: 60000, errors: ['time']})
                                            
                                            
                                                            declineSeriesAmountCollector.on('collect', async i => {
                                                                if (i.member.id != memberID) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                                                                declined = true
                                                                seriesAmountCollector.stop()
                                                                declineSeriesAmountCollector.stop()
                                                                i.deferUpdate()
                                                            })
                                                            
                                                            seriesAmountCollector.on('collect', async(msg) => {
                                                                isActive = true
                                                                if(msg.author.id !== message.author.id) return
                                                                if(msg.author.bot) return
                                                    
                                                                if(!isFinite(msg.content) || msg.content % 1 !== 0 || msg.content <= 0 || msg.content.includes("+")  || msg.content.includes(".")) return crossText(`Количество серий должно быть целым положительным числом`, message)
                                                                if(!msg.content) return crossText (`Сообщение пустое`, msg)
                                                                series_amount2 = msg.content
                                                                msg.react(checkmark)
                                                                isActive = false
                                                                seriesAmountCollector.stop()
                                                            })
                                            
                                                            seriesAmountCollector.on('end', async collected => {
                                                                seriesAmountMsg.edit({ components: [DECLINE_BUTTON(true)] })
                                                                if(declined) return crossText(`Создание ивента было отменено вручную`, message)
                                                                if(collected.map(c => c.content).length == 0) return crossText(`Никакого аргумента не было указано в течение 1 минуты. Создание ивента было отменено`, chanMsg)
                                                                if(isActive) return crossText(`Не было введено подходящего варианта за 1 минуту. Создание ивента было отменено`, message)
                                            
                                                                let durationEmbed = new Discord.MessageEmbed().setTitle(`📽️ Создание ${isFilm2 ? "фильма" : "сериала"} 2 📽️`).setColor("#2F3136")
                                                                .setDescription(`Введите длительность ${series_amount2 > 1 ? "1 серии" : ""}\nПример: \`${series_amount2 == 1 ? "1ч 35м" : "45м"}\``)
                                                                
                                                                let durationMsg = await message.reply({
                                                                    embeds: [durationEmbed], 
                                                                    components: [DECLINE_BUTTON()]
                                                                }) 
                                                                const durationCollector = message.channel.createMessageCollector({channelFilter, time: 60000, errors: ['time']})
                                                                const durationDeclineCollector = durationMsg.createMessageComponentCollector({channelFilter, time: 60000, errors: ['time']})
                                            
                                                                durationDeclineCollector.on('collect', async i => {
                                                                    if (i.member.id != memberID) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                                                                    declined = true
                                                                    durationCollector.stop()
                                                                    durationDeclineCollector.stop()
                                                                    i.deferUpdate()
                                                                })
                                            
                                                                durationCollector.on('collect', async(msg) => {
                                                                    isActive = true
                                                                    if(msg.author.id !== message.author.id) return
                                                                    if(msg.author.bot) return
                                            
                                                                    if(!msg.content) return crossText (`Сообщение пустое`, msg)
                                                                    duration2 = msg.content
                                                                    msg.react(checkmark)
                                                                    isActive = false
                                                                    durationCollector.stop()
                                                                    durationDeclineCollector.stop()
                                                                })
                                            
                                                                durationCollector.on('end', async collected => {
                                                                    durationMsg.edit({components: [DECLINE_BUTTON(true)]})
                                                                    if(declined) return crossText(`Создание ивента было отменено вручную`, message)
                                                                    if(collected.map(c => c.content).length == 0) return crossText(`Никакого аргумента не было указано в течение 1 минуты. Создание ивента было отменено`, chanMsg)
                                                                    if(isActive) return crossText(`Не было введено подходящего варианта за 1 минуту. Создание ивента было отменено`, message)
                                            
                                            
                                                                    let imageEmbed = new Discord.MessageEmbed().setTitle(`📽️ Создание ${isFilm2 ? "фильма" : "сериала"} 2 📽️`).setColor("#2F3136")
                                                                    .setDescription(`Отправьте обложку ${isFilm2 ? "фильма" : "сериала"}`)
                                                                    let imageMsg = await message.reply({embeds: [imageEmbed], components: [DECLINE_BUTTON()]}) 
                                                                    const imageCollector = message.channel.createMessageCollector({channelFilter, time: 60000, errors: ['time']})
                                                                    const skipDeclineTimeCollector = imageMsg.createMessageComponentCollector({channelFilter, time: 60000, errors: ['time']})
                                
                                                                    skipDeclineTimeCollector.on('collect', async i => {
                                                                        if (i.member.id != message.member.id) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                                                                        if(i.customId == "decline_button"){
                                                                            declined = true
                                                                            imageCollector.stop()
                                                                            skipDeclineTimeCollector.stop()
                                                                        }
                                                                        i.deferUpdate()
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
                                                                                image2 = msg2.attachments.first().attachment
                                                                            })
                                                                            msg.react(checkmark)
                                                                            isActive = false
                                                                            imageCollector.stop()
                                                                        }
                                                                    })
                                
                                                                    imageCollector.on('end', async collected => {
                                                                        imageMsg.edit({components: [DECLINE_BUTTON(true)]})
                                                                        if(declined) return crossText(`Создание ивента было отменено вручную`, message)
                                                                        if(collected.map(c => c.content).length == 0) return crossText(`Никакого аргумента не было указано в течение 1 минуты. Создание ивента было отменено`, chanMsg)
                                                                        if(isActive) return crossText(`Не было введено подходящего варианта за 1 минуту. Создание ивента было отменено`, message)
    
                                                                        let participationEmbed = new Discord.MessageEmbed().setTitle(`📽️ Создание ${isFilm ? "фильма" : "сериала"} 2 📽️`).setColor("#2F3136")
                                                                        .setDescription(`Введите награду за просмотр ${series_amount2 > 1 ? "1 серии" : ""}`)
                                                                        
                                                                        let participationMsg = await message.reply({
                                                                            embeds: [participationEmbed], 
                                                                            components: [DECLINE_BUTTON()]
                                                                        }) 
                                                                        const participationCollector = message.channel.createMessageCollector({channelFilter, time: 60000, errors: ['time']})
                                                                        const participationDeclineCollector = participationMsg.createMessageComponentCollector({channelFilter, time: 60000, errors: ['time']})
                                                    
                                                                        participationDeclineCollector.on('collect', async i => {
                                                                            if (i.member.id != memberID) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                                                                            declined = true
                                                                            participationCollector.stop()
                                                                            participationDeclineCollector.stop()
                                                                            i.deferUpdate()
                                                                        })
                                                    
                                                                        participationCollector.on('collect', async(msg) => {
                                                                            isActive = true
                                                                            if(msg.author.id !== message.author.id) return
                                                                            if(msg.author.bot) return
                                                    
                                                                            if(!msg.content) return crossText (`Сообщение пустое`, msg)
                                                                            participation2 = msg.content
                                                                            msg.react(checkmark)
                                                                            isActive = false
                                                                            participationCollector.stop()
                                                                            participationDeclineCollector.stop()
                                                                        })
                                    
                                                                        participationCollector.on('end', async collected => {
                                                                            participationMsg.edit({components: [DECLINE_BUTTON(true)]})
                                                                            if(declined) return crossText(`Создание ивента было отменено вручную`, message)
                                                                            if(collected.map(c => c.content).length == 0) return crossText(`Никакого аргумента не было указано в течение 1 минуты. Создание ивента было отменено`, chanMsg)
                                                                            if(isActive) return crossText(`Не было введено подходящего варианта за 1 минуту. Создание ивента было отменено`, message)

                                                                            let timeEmbed = new Discord.MessageEmbed().setTitle(`📽️ Создание голосования 📽️`).setColor("#2F3136")
                                                                            .setDescription(`Введите время проведения в формате \`ЧЧ:ММ\` (Напр.: \`20:00\`)\nЕсли голосование планируется не сегодня, то введите время проведения в полном формате \`дд.мм.гггг ЧЧ:ММ\` (Напр.: \`13.06.2022 20:00\`)`)
                                                                            
                                                                            let timeMsg = await message.reply({
                                                                                embeds: [timeEmbed],
                                                                                components: [DECLINE_BUTTON()]
                                                                            }) 
                                                                            const timeCollector = message.channel.createMessageCollector({channelFilter, time: 60000, errors: ['time']})
                                                                            const declineTimeCollector = timeMsg.createMessageComponentCollector({channelFilter, time: 60000, errors: ['time']})
                                                    
                                                                            declineTimeCollector.on('collect', async i => {
                                                                                if (i.member.id != memberID) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                                                                                declined = true
                                                                                timeCollector.stop()
                                                                                declineTimeCollector.stop()
                                                                                i.deferUpdate()
                                                                            })
                                                                            
                                                                            timeCollector.on('collect', async(msg) => {
                                                                                isActive = true
                                                                                if(msg.author.id !== message.author.id) return
                                                                                if(msg.author.bot) return
                                                                    
                                                                                let data
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
                                                                                timeMsg.edit({components: [DECLINE_BUTTON(true)]})
                                                                                if(declined) return crossText(`Создание ивента было отменено вручную`, message)
                                                                                if(collected.map(c => c.content).length == 0) return crossText(`Никакого аргумента не было указано в течение 1 минуты. Создание ивента было отменено`, chanMsg)
                                                                                if(isActive) return crossText(`Не было введено подходящего варианта за 1 минуту. Создание ивента было отменено`, message)
        
                                                                                let eventChannels = message.guild.channels.cache.filter(ch => ch.type == "GUILD_VOICE" &&
                                                                                (message.guild.channels.cache.get(ch.parentId).name.toLowerCase().includes("кинозал")))
                                                                                .sort(function (a, b) {
                                                                                    return a.rawPosition - b.rawPosition;
                                                                                })
                                                
                                                
                                                                                let chanEmbed = new Discord.MessageEmbed().setTitle(`📽️ Создание голосования 📽️`).setColor("#2F3136")
                                                                                .setDescription(`Выберите войс, в котором будет происходить просмотр`)
                                                                                let placeMsg = await message.reply({
                                                                                    embeds: [chanEmbed], 
                                                                                    components: [PLACE_CHANNEL_SELECT_MENU(message, eventChannels), DECLINE_BUTTON()]
                                                                                }) 
                                                                                const placeCollector = placeMsg.createMessageComponentCollector({channelFilter, time: 60000, errors: ['time']})
                                                                                placeCollector.on('collect', async i => {
                                                                                    console.log(i.member.id, memberID)
                                                                                    if (i.member.id != memberID) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                                                                                    if(i.customId == "decline_button"){
                                                                                        declined = true
                                                                                        placeCollector.stop()
                                                                                    } else {
                                                                                        place = i.values[0]
                                                                                        placeCollector.stop()
                                                                                    }
                                                                                    placeMsg.edit({components: [PLACE_CHANNEL_SELECT_MENU(message, eventChannels, true), DECLINE_BUTTON(true)]})
                                                                                    i.deferUpdate()
                                                                                })
                                                
                                                                                placeCollector.on('end', async collected => {
                                                                                    if(declined) return crossText(`Создание ивента было отменено вручную`, message)
                                                                                    if(collected.map(c => c.content).length == 0) return crossText(`Никакого аргумента не было указано в течение 1 минуты. Создание ивента было отменено`, chanMsg)
                                                                                    if(isActive) return crossText(`Не было введено подходящего варианта за 1 минуту. Создание ивента было отменено`, message)
        
                                                                                    
                                                                                        let rolesEmbed = new Discord.MessageEmbed().setTitle(`📽️ Создание голосования 📽️`).setColor("#2F3136")
                                                                                        .setDescription(`Введите самое верхнее сообщение перед эмбедом\nПредполагается упоминание ролей, которые должны получить оповещение об ивенте`)
                                                                                        let rolesMsg = await message.reply({embeds: [rolesEmbed], components: [DECLINE_BUTTON()]}) 
                                                                                        const rolesCollector = message.channel.createMessageCollector({channelFilter, time: 60000, errors: ['time']})
                                                                                        const declineRolesCollector = rolesMsg.createMessageComponentCollector({channelFilter, time: 60000, errors: ['time']})
                                                    
                                                                                        declineRolesCollector.on('collect', async i => {
                                                                                            if (i.member.id != message.member.id) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                                                                                            declined = true
                                                                                            rolesCollector.stop()
                                                                                            declineRolesCollector.stop()
                                                                                            i.deferUpdate()
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
                                                                                            rolesMsg.edit({components:[DECLINE_BUTTON(true)]})
                                                                                            if(declined) return crossText(`Создание ивента было отменено вручную`, message)
                                                                                            if(collected.map(c => c.content).length == 0) return crossText(`Никакого аргумента не было указано в течение 1 минуты. Создание ивента было отменено`, chanMsg)
                                                                                            if(isActive) return crossText(`Не было введено подходящего варианта за 1 минуту. Создание ивента было отменено`, message)
        
                                                                                            let embedCreate = (preview) => {
    
                                                                                                let first_embed = new Discord.MessageEmbed().setColor(noColor()).setTitle(title)
                                                                                                .setDescription(`**Жанр:** ${genre}\n**Длительность${series_amount > 1 ? ` одной серии`: ":"}** ${duration}${series_amount > 1 ? `\n**Количество серий:** ${series_amount}` : ""}\n**Дата выхода:** ${year} год\n**Награда за просмотр${series_amount > 1 ? ` одной серии:` : ":"}** ${participation} ${coin}`)
                                                                                                .setImage(image)
                                                                                                if(preview) first_embed.setFooter({text:`Это превью ивента`})
    
                                                                                                let second_embed = new Discord.MessageEmbed().setColor(noColor()).setTitle(title2)
                                                                                                .setDescription(`**Жанр:** ${genre2}\n**Длительность${series_amount2 > 1 ? ` одной серии`: ":"}** ${duration2}${series_amount2 > 1 ? `\n**Количество серий:** ${series_amount2}` : ""}\n**Дата выхода:** ${year2}\n**Награда за просмотр${series_amount2 > 1 ? ` одной серии:` : ":"}** ${participation2} ${coin}`)
                                                                                                .setImage(image2)
                                                                                                if(preview) second_embed.setFooter({text:`Это превью ивента`})

                                                                                                let vote_embed = new Discord.MessageEmbed().setColor(noColor())
                                                                                                .setDescription(`**Место встречи и начало:** <#${place}> ${time} по МСК\n**Ведущий:** ${message.member}\n\nПроголосуйте за желаемый фильм/сериал`)
                                                                                                if(preview) vote_embed.setFooter({text:`Ниже будут эмодзи для голсования после публикации`})
                                                                                                return [first_embed, second_embed, vote_embed]
                                                                                            }
                                                
                                                                                            let previewMsg = await message.channel.send({
                                                                                                content: roles, 
                                                                                                embeds: embedCreate(true), 
                                                                                                components: [PUBLISH_DECLINE_BUTTONS()]
                                                                                            })
                                                                                            const declinePublishCollector = previewMsg.createMessageComponentCollector({channelFilter, time: 300000, errors: ['time']})
                                                
                                                                                            declinePublishCollector.on('collect', async i => {
                                                                                                if(i.member.id != message.member.id) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                                                                                                if(i.customId == 'decline_button'){
                                                                                                    declinePublishCollector.stop()
                                                                                                    previewMsg.edit({
                                                                                                        components: [PUBLISH_DECLINE_BUTTONS(true)]
                                                                                                    })
                                                                                                    crossText(`Создание ивента было отменено вручную`, message)
                                                                                                    i.deferUpdate()
                                                                                                } else if(i.customId == "publish_button") {
                                                                                                    let findChan = message.guild.channels.cache.get(chan)
                                                                                                    findChan.send({content: roles, embeds: embedCreate(false)}).then(msg => {
                                                                                                        msg.react("1️⃣")
                                                                                                        msg.react("2️⃣")
                                                                                                    })
                                                                                                    return i.reply({content: "Уведомление было успешно опубликовано!"})
                                                                                                    //i.deferUpdate()
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
                                                        })
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
    }
}