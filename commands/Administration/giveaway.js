const chalk = require('chalk')

module.exports = {
    name: "giveaway",
    description: "Описание команд",
    aliases: ["ga", "розыгрыш"],
    run: async (bot, message, args) => {

        try{

            const User = require('../../models/user')
            const Discord = require('discord.js')
            const Guild = require('../../models/guild')
            const Giveaway = require('../../models/giveaway')
            const mongoose = require("mongoose")
            const MongoFunc = require('../../functions/MongoFunc') 
            const ms = require('ms')
            const { Embeds, crossText, noPerms, checkmarkText } = require('../../functions/Embed') 
            const { noColor, botColorMessage } = require('../../functions/Colours')
            const Util  = require('../../functions/Util') 
            const checkmark = Util.findEmoji("text_yes")
            const server = await Guild.findOne({ guildID: message.guild.id })
            const dateFormat = require("dateformat")
            const now = new Date();
            
            if(Util.checkPerm(message.member, "ADMINISTRATOR")) return noPerms(message)

            if(args[0] == "help" || args[0] == "помощь"){
                const embed = new Embeds({
                    message: message,
                    description: `Управление розыгрышами сервера`,
                    embedTitle: "GIVEAWAY HELP-MENU",
                    embedColor: noColor(),
                    arguments: `● **\`${server.prefix}giveaway <start/старт>\`**\n● **\`${server.prefix}giveaway <stop/стоп> <ID сообщения>\`**\n● **\`${server.prefix}giveaway <reroll/реролл> <ID сообщения> <№ места | все>\`**`,
                    alternatives: `● **\`${server.prefix}giveaway\`** | **\`${server.prefix}ga\`** | **\`${server.prefix}розыгрыш\`**`,
                    examples: `● **\`${server.prefix}ga start #розыгрыши 7d 3 Discord Nitro и Premiun на 1 мес., 7 д.\`**\n● **\`${server.prefix}ga stop 962272493836578817\`**`,
                    hints: `● **\`<>\`** - обязательно для заполнения`
                })
    
                return embed.help()
            }

            if(!args[0]) return crossText(`Не указано никаких аргументов\nИспользуйте **\`${message.content.split(" ")[0].toLowerCase()} help\`**, чтобы узнать возможные аргументы`, message)
            if(args[0] != "start" && args[0] != "stop" && args[0] != "reroll" && args[0] != "rerol" && args[0] != "старт" && args[0] != "стоп" && args[0] != "реролл" && args[0] != "рерол") return crossText(`Не найдено указанных аргументов\nИспользуйте **\`${message.content.split(" ")[0].toLowerCase()} help\`**, чтобы узнать возможные аргументы`, message)

            if(args[0] == "start" || args[0] == "старт"){
                // let chan = message.mentions.channels.first() || message.guild.channels.cache.find(ch => ch.id === args[1])
                // if(!chan) return crossText(`Канал не указан или не был найден\nПример: **\`${server.prefix}ga start #giveaways 7d 3 VIP\`**`, message)
                // if(!args[2]) return crossText(`Длительность не указана\nПример: **\`${server.prefix}ga start #giveaways 7d 3 VIP\`**`, message)
                // let duration = (args[2]).replace(/с/g, "s").replace(/секунд/g, "s").replace(/сек/g, "s").replace(/минут/g, "m").replace(/мин/g, "m").replace(/м/g, "m").replace(/часа/g, "h").replace(/час/g, "h").replace(/ч/g, "h").replace(/дня/g, "d").replace(/день/g, "d").replace(/д/g, "d")
                // if(ms(duration) == null || ms(duration) == undefined) return crossText(`Длительность указана неверно\nПример: **\`${server.prefix}ga start #giveaways 7d 3 VIP\`**`, message)
                // let winnersCount = args[3]
                // if(winnersCount % 1 != 0 || winnersCount < 1 || !args[3]) return crossText(`Количество победителей не указано или указано неверно\nПример: **\`${server.prefix}ga start #giveaways 7d 3 VIP\`**`, message)
                // if(!args[4]) return crossText(`Приз не был указан\nПример: **\`${server.prefix}ga start #giveaways 7d 1 VIP\`**`, message)
                // let title = args.splice(4).join(" ")

                // let waitEmbed = new Discord.MessageEmbed()
                // .setColor(noColor())
                // .setDescription(`Укажите **${winnersCount}** призовое(-ых) места, отправляя их\nВведите **\`отмена\`** для отмены`)
                // message.channel.send({content: `${message.member}`, embeds: [waitEmbed]})

                // const filter = (m) => m.author.id === message.author.id
                // const collector = message.channel.createMessageCollector({filter, max: winnersCount, time: 120000})

                // i = 0
                // winPlaces = []
                // dbPrizes = []
                // collector.on('collect', async(msg) => {
                //     if(msg.content.toLowerCase() == "отмена") collector.stop()

                //     msg.react(checkmark)
                //     i++
                //     dbPrizes.push(msg.content)
                //     winPlaces.push(`${i} место - **${msg.content}**`)
                // })

                // let data = new Date().toLocaleString("en-US", {timeZone: "Europe/Moscow"})
                // const endDate = dateFormat(data, "dd/mm/yyyy HH:MM:ss")

                // collector.on('end', async(collected) => {
                //     if(collected.map(c => c.content.toLowerCase()).indexOf('отмена') != -1) return message.channel.send(`Сбор сообщений был отменен`)
                //     if(collected.map(c => c.content).length == 0) return message.channel.send(`Никаких мест не было указано в течение 2 минут. Сбор сообщений был отменен`)
                //     let embed = new Discord.MessageEmbed()
                //     .setTitle(title)
                //     .setColor(botColorMessage(message))
                //     .setDescription(`Отреагируйте на эмодзи 🎉, чтобы принять участие\nЗаканчивается: **\`${endDate}\`**\nОрганизатор: ${message.member}\n\n${winPlaces.join('\n')}`)
                //     chan.send({embeds: [embed]}).then(async(msg) => {
                //         msg.react('🎉')

                //         let newGiveaway = await new Giveaway({
                //             _id: mongoose.Types.ObjectId(),
                //             guildID: message.guild.id,
                //             channelID: chan.id,
                //             msgID: msg.id,
                //             winners: winnersCount,
                //             date: Date.now(),
                //             duration: ms(duration),
                //             prize: title,
                //             places: dbPrizes,
                //             hasEnded: false,
                //         })
            
                //         await newGiveaway.save()
                //     })
                // })

                var isActive = Boolean
                var chan = ''
                var winners_amount = 0
                var title = ''
                var data = ''
                var endDate = ''
                var uslovie = ''
                winPlaces = []
                dbPrizes = []
                i = 0

                let channelEmbed = new Discord.MessageEmbed()
                .setColor(noColor())
                .setDescription(`Укажите канал, в котором отправить сообщение о розыгрыше\nВведите **\`отмена\`** для отмены`)
                await message.reply({embeds: [channelEmbed]})
                const channelFilter = (m) => m.author.id === message.member.id
                const channelCollector = message.channel.createMessageCollector({channelFilter, time: 60000})
                await channelCollector.on('collect', async(msg) => {
                    isActive = false
                    if(msg.author.id !== message.author.id) return
                    if(msg.author.bot) return
                    if(msg.content.toLowerCase() == "отмена") return channelCollector.stop()

                    chan = await msg.mentions.channels.first() || message.guild.channels.cache.get(msg.content)
                    if(!chan) return crossText(`Указанный вами канал не был найден, введите его еще раз`, message)
                    await msg.react(checkmark)
                    isActive = true
                    await channelCollector.stop()
                })
                await channelCollector.on('end', async(collected) => {
                    if(collected.map(c => c.content.toLowerCase()).indexOf('отмена') != -1) return checkmarkText(`Создание розыгрыша было отменено`, message)
                    if(collected.map(c => c.content).length == 0) return crossText(`Никакакого канала не было указано в течение 1 минуты. Создание розыгрыша было отменено`, message)
                    if(!isActive) return crossText(`Не было введено подходящего варианта за 1 минуту. Создание розыгрыша было отменено`, message)

                    let placesEmbed = new Discord.MessageEmbed()
                    .setColor(noColor())
                    .setDescription(`Укажите количество победителей\nВведите **\`отмена\`** для отмены`)
                    await message.reply({embeds: [placesEmbed]})
                    const placesFilter = (m) => m.author.id === message.author.id
                    const placesCollector = message.channel.createMessageCollector({placesFilter, time: 60000})
                    await placesCollector.on('collect', async(msg) => {
                        isActive = false
                        if(msg.author.id !== message.author.id) return
                        if(msg.author.bot) return
                        if(msg.content.toLowerCase() == "отмена") return placesCollector.stop()
                        winners_amount = msg.content
                        if(!isFinite(winners_amount) || winners_amount % 1 !== 0 || winners_amount <= 0 || winners_amount.includes("+")  || winners_amount.includes(".")) return crossText(`Количество победителей должно быть целым положительным числом`, message)
                        await msg.react(checkmark)
                        isActive = true
                        await placesCollector.stop()
                    })
                    await placesCollector.on('end', async(collected) => {
                        if(collected.map(c => c.content.toLowerCase()).indexOf('отмена') != -1) return checkmarkText(`Создание розыгрыша было отменено`, message)
                        if(collected.map(c => c.content).length == 0) return crossText(`Никакакого количества мест не было указано в течение 1 минуты. Создание розыгрыша было отменено`, message)
                        if(!isActive) return crossText(`Не было введено подходящего варианта за 1 минуту. Создание розыгрыша было отменено`, message)
                        
                        let winPlacesEmbed = new Discord.MessageEmbed()
                        .setColor(noColor())
                        .setDescription(`Укажите победные места (**${winners_amount}**), отправляя их поочередно\nВведите **\`отмена\`** для отмены`)
                        await message.reply({ embeds: [winPlacesEmbed]})
                        const winPlacesFilter = (m) => m.author.id === message.author.id
                        const winPlacesCollector = message.channel.createMessageCollector({winPlacesFilter, time: 120000})
                        await winPlacesCollector.on('collect', async(msg) => {
                            isActive = false
                            if(msg.author.id !== message.author.id) return
                            if(msg.author.bot) return
                            if(msg.content.toLowerCase() == "отмена") return winPlacesCollector.stop()
                            await msg.react(checkmark)
                            i++
                            await dbPrizes.push(msg.content)
                            await winPlaces.push(`${i} место - **${msg.content}**`)
                            if(winners_amount == i) { isActive = true; await winPlacesCollector.stop()}
                        })
                        await winPlacesCollector.on('end', async(collected) => {
                            if(collected.map(c => c.content.toLowerCase()).indexOf('отмена') != -1) return checkmarkText(`Создание розыгрыша было отменено`, message)
                            if(collected.map(c => c.content).length == 0) return crossText(`Никакие призовые места не были указаны в течение 2 минут. Создание розыгрыша было отменено`, message)
                            if(!isActive) return crossText(`Не было введено подходящего варианта за 1 минуту. Создание розыгрыша было отменено`, message)
                            
                            let titleEmbed = new Discord.MessageEmbed()
                            .setColor(noColor())
                            .setDescription(`Введите тайтл розыгрыша(будет написано в самом вверху эмбед сообщения)\nВведите **\`отмена\`** для отмены`)
                            await message.reply({embeds: [titleEmbed]})
                            const titleFilter = (m) => m.author.id === message.author.id
                            const titleCollector = message.channel.createMessageCollector({titleFilter, time: 120000})
                            await titleCollector.on('collect', async(msg) => {
                                isActive = false
                                if(msg.author.id !== message.author.id) return
                                if(msg.author.bot) return
                                if(msg.content.toLowerCase() == "отмена") return titleCollector.stop()
                                title = msg.content
                                await msg.react(checkmark)
                                isActive = true
                                await titleCollector.stop()
                            })
                            await titleCollector.on('end', async(collected) => {
                                if(collected.map(c => c.content.toLowerCase()).indexOf('отмена') != -1) return checkmarkText(`Создание розыгрыша было отменено`, message)
                                if(collected.map(c => c.content).length == 0) return crossText(`Никакие призовые места не были указаны в течение 2 минут. Создание розыгрыша было отменено`, message)
                                if(!isActive) return crossText(`Не было введено подходящего варианта за 1 минуту. Создание розыгрыша было отменено`, message)
                                
                                let uslovieEmbed = new Discord.MessageEmbed()
                                .setColor(noColor())
                                .setDescription(`Введите условие розыгрыша, если таковое имеется\nВведите **\`пропуск\`**, если хотите пропустить этот пункт`)
                                await message.reply({ embeds: [uslovieEmbed]})
                                const uslovieFilter = (m) => m.author.id === message.author.id
                                const uslovieCollector = message.channel.createMessageCollector({uslovieFilter, time: 60000})
                                await uslovieCollector.on('collect', async(msg) => {
                                    isActive = false
                                    if(msg.author.id !== message.author.id) return
                                    if(msg.author.bot) return
                                    if(msg.content.toLowerCase() == "пропуск") return uslovieCollector.stop()
                                    uslovie = msg.content
                                    await msg.react(checkmark)
                                    isActive = true
                                    await uslovieCollector.stop()
                                })

                                await uslovieCollector.on('end', async(collected) => {
                                    if(collected.map(c => c.content.toLowerCase()).indexOf('пропуск') != -1) uslovie = ""
                                    if(collected.map(c => c.content).length == 0) return crossText(`Никакого условия не было указано в течение 1 минуты. Создание розыгрыша было отменено`, message)
                                    
                                    let dateEmbed = new Discord.MessageEmbed()
                                    .setColor(noColor())
                                    .setDescription(`Введите дату окончанчание розыгрыша\nПример: **\`13.04.2022 17:00\`**\nВведите **\`отмена\`** для отмены`)
                                    await message.reply({embeds: [dateEmbed]})
                                    const dateFilter = (m) => m.author.id === message.author.id
                                    const dateCollector = message.channel.createMessageCollector({dateFilter, time: 120000})
                                    await dateCollector.on('collect', async(msg) => {
                                        isActive = false
                                        if(msg.author.id !== message.author.id) return
                                        if(msg.author.bot) return
                                        if(msg.content.toLowerCase() == "отмена") return dateCollector.stop()
                                        function stringToDate(_date, _format, _format2){
                                            if(_date.includes("+")) return
                                            _date = _date.split(" ")
                                            if(!_date[0] || !_date[1] || _date[2]) return
                                
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
                                
                                        if(!Date.parse(stringToDate(`${msg.content}`,"dd.mm.yyyy", "HH:MM"))) return crossText(`Дата или время не является правильной, введите снова`, message)
                                        data = stringToDate(`${msg.content}`,"dd.mm.yyyy", "HH:MM")
                                        //.toLocaleString("en-US", {timeZone: "Europe/Moscow"})
                                        //if(Date.now() - (Date.parse(data) - 1000 * 60 * 60 * 3) > -60000) return crossText(`Нельзя сделать розыгрыш меньше 1 минуты`, message)
                                        if(Date.now() - (Date.parse(`${data}Z`) - 1000 * 60 * 60 * 3) > -60000) return crossText(`Нельзя сделать розыгрыш меньше 1 минуты`, message)
                                        endDate = dateFormat(data, "dd.mm.yyyy HH:MM")
                                        
                                        await msg.react(checkmark)
                                        isActive = true
                                        await dateCollector.stop()
                                    })
                                    
                                    await dateCollector.on('end', async(collected) => {
                                        if(collected.map(c => c.content.toLowerCase()).indexOf('отмена') != -1) return checkmarkText(`Создание розыгрыша было отменено`, message)
                                        if(collected.map(c => c.content).length == 0) return crossText(`Никакие призовые места не были указаны в течение 2 минут. Создание розыгрыша было отменено`, message)
                                        if(!isActive) return crossText(`Не было введено подходящего варианта за 1 минуту. Создание розыгрыша было отменено`, message)
                                          
                                        /////////////////////////////////////////////////////////////////////////////////////////////////////////
                                        let embed = new Discord.MessageEmbed()
                                        .setTitle(title)
                                        .setColor(noColor())
                                        .setDescription(`${uslovie ? `Условие: ${uslovie}\n\n` : ""}${winPlaces.join('\n')}\n\nОтреагируйте на эмодзи 🎉, чтобы принять участие\nЗаканчивается: **\`${endDate}\`**\nОрганизатор: ${message.member}`)
                                        await chan.send({embeds: [embed]}).then(async(msg) => {
                                        await msg.react('🎉')
                    
                                            let newGiveaway = await new Giveaway({
                                                _id: mongoose.Types.ObjectId(),
                                                guildID: message.guild.id,
                                                channelID: chan.id,
                                                msgID: msg.id,
                                                winners: winners_amount,
                                                date: Date.now(),
                                                endDate: (Date.parse(`${data}Z`) - 1000 * 60 * 60 * 3),
                                                prize: title,
                                                places: dbPrizes,
                                                uslovie: uslovie,
                                                hasEnded: false,
                                                winnersArr: Array
                                            })
                                
                                            await newGiveaway.save()
                                        })
                                        /////////////////////////////////////////////////////////////////////////////////////////////////////////
                                    })
                                })
                            })
                        })
                    })
                })
            } else if (args[0] == "stop" || args[0] == "стоп"){
                if(!args[1]) return crossText(`Вы не указали ID сообщения\nПример: **\`${message.content.split(" ")[0].toLowerCase()} stop <ID>\`**`, message)
                let element = await Giveaway.findOne({guildID: message.guild.id, msgID: args[1], hasEnded: false})
                if(!element) return crossText(`Не было найдено действующих розыгрышей с этим ID`, message)
                let server2 = bot.guilds.cache.get(element.guildID)
                if(!server2) return console.log('Giveaway server doesnt found')
                let chan = server2.channels.cache.find(ch => ch.id === element.channelID)
                if(!chan) return crossText(`Не было найдено канала, в котором был совершен розыгрыш`, message).then(console.log('Giveaway channel doesnt found with channel ID:'))
                if(!chan.messages.fetch(element.msgID)) return crossText(`Не было найдено такого сообщения`, message).then(console.log('Giveaway message doesnt found with ID:' + args[1]))
                await chan.messages.fetch(element.msgID).then(async (msg) => msg.delete())
                await element.delete()
                return checkmarkText(`Розыгрыш был успешно отменен, а сообщение о нем удалено`, message)
            } else if (args[0] == "reroll" || args[0] == "rerol" || args[0] == "реролл" || args[0] == "рерол"){
                if(!args[1]) return crossText(`Вы не указали ID сообщения\nПример: **\`${message.content.split(" ")[0].toLowerCase()} reroll <ID сообщения>\`**`, message)
                let element = await Giveaway.findOne({guildID: message.guild.id, msgID: args[1], hasEnded: true})
                if(!element) return crossText(`Не было найдено оконченных розыгрышей с этим ID`, message)
                if(!args[2]) return crossText(`Вы не указали, какие места рероллить\nВозможные варианты: **\`${message.content.split(" ")[0].toLowerCase()} reroll <ID> <Место>\`** или **\`${message.content.split(" ")[0].toLowerCase()} reroll <ID> <all>\`**`, message)
                if((!isFinite(args[2]) || args[2] % 1 !== 0 || args[2] <= 0 || args[2].includes("+")  || args[2].includes(".")) && (args[2].toLowerCase() != "all" && args[2].toLowerCase() != "все")) return crossText(`Указанное место не является целым числом или all`, message)
                if(args[2].toLowerCase() != "все" && args[2].toLowerCase() != "all" && element.winners < parseInt(args[2])) return crossText(`В розыгрыше не было найдено места с номером **${args[2]}**`, message)
                let server2 = bot.guilds.cache.get(element.guildID)
                if(!server2) return console.log('Giveaway server doesnt found')
                let chan = server2.channels.cache.find(ch => ch.id === element.channelID)
                if(!chan) return crossText(`Не было найдено канала, в котором был совершен розыгрыш`, message).then(console.log('Giveaway channel doesnt found with channel ID:'))
                if(!chan.messages.fetch(element.msgID)) return crossText(`Не было найдено такого сообщения`, message).then(console.log('Giveaway message doesnt found with ID:' + args[1]))

                await chan.messages.fetch(element.msgID).then(async (msg) => {
                    const { users } = await msg.reactions.cache.first().fetch()
                    const reactionUser = await users.fetch() 
                    const possibleWinners = reactionUser.filter(user => !user.bot).map(user => user.id)
                    if(args[2].toLowerCase() == "все" || args[2].toLowerCase() == "all"){
                    let winner = Util.getWinner(possibleWinners, element.winners, element.winnersArr)
                        if (!winner) {
                            return crossText(`Никто не участвовал в данном розыгрыше. Реролл был отменен`, message);
                        } else {
                            console.log(winner)
                            i = 0
                            let embedWinners = []
                            winner.forEach(async (win) => {
                                embedWinners.push(`${i + 1} место - ${element.places[i]} (<@${win}>)`)
                                i++
                            })
                            let embed = new Discord.MessageEmbed()
                            .setTitle(element.prize)
                            .setColor(botColorMessage(message))
                            .setDescription(`Условие: ${element.uslovie}\n\n${embedWinners.join('\n')}`)
                            .setFooter({text: `Окончен`})
                            msg.edit({embeds: [embed]})
                        }
                    } else {
                        let winner = Util.getWinner(possibleWinners, 1, element.winnersArr)
                        if(!winner){
                            return crossText(`Недостаточно участников для реролла этого розыгрыша`, message);
                        } else {
                            let Arr = element.winnersArr
                            element.winnersArr = Arr.set(parseInt(args[2]) - 1, winner[0])
                            element.save().catch()

                            i = 0
                            let embedWinners = []
                            Arr.forEach(async (win) => {
                                embedWinners.push(`${i + 1} место - ${element.places[i]} (<@${win}>)`)
                                i++
                            })

                            let embed2 = new Discord.MessageEmbed()
                            .setTitle(`Вы выйграли в розыгрыше Ponime`)
                            .setColor(botColorMessage(message))
                            .setDescription(`[Ссылка на розыгрыш](${message.url})`)
                            let mem = message.guild.members.cache.find(m => m.id === winner[0])
                            if(mem) mem.send({embeds: [embed2]}).catch()

                            let embed = new Discord.MessageEmbed()
                            .setTitle(element.prize)
                            .setColor(botColorMessage(message))
                            .setDescription(embedWinners.join('\n'))
                            .setFooter({text: `Окончен`})
                            msg.edit({embeds: [embed]})
                        }
                    }
                })
                
                return checkmarkText(`Розыгрыш был успешно зареролен!`, message)
            }


    
        }catch(err){
            console.error(chalk.redBright(err.stack))
            console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
        }
    }
}