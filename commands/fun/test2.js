const chalk = require('chalk')
module.exports = {
    name: "test2",
    description: "Описание команд",
    run: async (bot, message, args) => {

        if(message.author.id != "329462919676821504") return message.reply(`Эта команда доступна лишь для разработчика`)

        try {

            bot.server.set(message.guild.id, {
                prefix: bot.server.get(message.guild.id).prefix,
                actions_channels: bot.server.get(message.guild.id).actions_channels,
                leveling_channels: bot.server.get(message.guild.id).leveling_channels,
                moderation_channels: bot.server.get(message.guild.id).moderation_channels,
                warnID: bot.server.get(message.guild.id).warnID,
                roles: [],
                event_channels: bot.server.get(message.guild.id).event_channels || []
            })

            // let embed2 = new Discord.MessageEmbed().setColor(noColor())
            // .setDescription(`<@&992500202781016144>\n<@&992500220682313858>\n<@&992500229058347118>⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣⁣ ⁣`)

            // message.channel.send({
            //     embeds: [embed, embed2],
            //     components: [TEST_BUTTON()]
            // })


            // await message.channel.send({
            //     files: [`https://imgur.com/GiSIBkh.png`],
            // })

            // let embed = new Discord.MessageEmbed().setColor(noColor())
            // .setDescription(`<@&992500202781016144>\n<@&992500220682313858>\n<@&992500229058347118>⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ `)

            // await message.channel.send({
            //     files: [`https://imgur.com/OFZdXXP.png`],
            //     embeds: [embed],
            //     components: [TEST_BUTTON()]
            // })

            
            // let stickers = message.guild.stickers.cache.map(s => s.id + " " + s.name)
            // message.channel.send(stickers.join('\n'))

            // let embed = new Discord.MessageEmbed().setColor(noColor())
            // .setTitle(`Отряд самоубийц 2`)
            // .setDescription(`**Дата выхода:** 2021 год\n**Жанр:** боевик, фантастика, комедия\n**Длительность:** 2ч 12м\n**Место встречи и начало:** <#985615468092088330> в 15:00 по МСК\n**Ведущий:** ${message.member}\n**Награда за просмотр:** 1500 ${coin}`)
            // .setImage('https://image.tmdb.org/t/p/original/jlGmlFOcfo8n5tURmhC7YVd4Iyy.jpg')
            // message.channel.send({
            //     content: `@Смотрю фильмы`,
            //     embeds: [embed]
            // })

            // const channelFilter = (m) => m.author.id === message.member.id
            // const Collector = initMsg.createMessageComponentCollector({channelFilter, time: 10000, errors: ['time']})

            // Collector.on('end', collected => {
            //     initMsg.edit({
            //         components: [DECLINE_BUTTON(true)]
            //     })
            // })
            

            //const {findEmoji} = require('../../functions/Util')

            //let coin = findEmoji("CHPOKI_COIN")

            // let test = new Discord.GuildScheduledEventManager()
            // .setName('Test')

            // message.guild.scheduledEvents.create({
            //     name: "Название ивента",
            //     description: "Описание ивента",
            //     image: "https://cdn.discordapp.com/attachments/914360388580147211/987218210812203028/1234.png",
            //     channel: "985608340568698910",
            //     scheduledStartTime: data,
            //     entityType: "VOICE",
            //     privacyLevel: "GUILD_ONLY"
            // })
            

            //if(!Date.parse(stringToDate(`${msg.content}`,"dd.mm.yyyy", "HH:MM"))) return crossText(`Дата или время не является правильной, введите снова`, message)
            //data = stringToDate(`${msg.content}`,"dd.mm.yyyy", "HH:MM")

            //let date = args.length
            //let test = date.getDate()
            //console.log(date)


            //const bitPermissions = new Discord.Permissions(message.channel.permissionsFor(message.guild.members.cache.get("674067589810356244"), false))
            //let test = bitPermissions.has(Discord.Permissions.FLAGS.VIEW_CHANNEL)
        
            // let embed = new Discord.MessageEmbed()
            // //.setTitle(`Мафия`)
            // .setDescription(`Редактиремый **__заголовок__**\n\`\`\`Допустим, это типо ивент по мафии. Тут какое-то описание бла-бла-бла. Делаем то-то, там-то, где-то, что-то, в общем. я просто растягиваю описание\`\`\`\n**● Время проведения:** 20:00 по МСК\n\n**● Ведущий:** ${message.member}\n\n**● Место проведения:** <#985608340568698910>\n\n**Награда**`)
            // .setColor(botColorMessage(message))
            // .setImage('https://media.discordapp.net/attachments/811199400604598332/978253249356394516/1a6b110964f436f1.jpg?width=1246&height=701')
            // .setFields(
            //     {name: 'Первое место', value: `5000 ${coin}`, inline: true},
            //     {name: 'Второе место', value: `4000 ${coin}`, inline: true},
            //     {name: 'Третье место', value: `3000 ${coin}`, inline: true},
            //     //{name: 'Приз победителям', value: `1 место - 5000 ${coin}\n2 место - 4000 ${coin}\n3 место - 3000 ${coin}`, inline: true},
            //     {name: 'Участие', value: `1500 ${coin}`, inline: true},
            // )

            // message.channel.send({embeds: [embed]})

            //console.log(message.channel.permissionOverwrites.cache.filter(m => m.id == "674067589810356244").size)

            // await fetch(url).then(respons => {
            //     return console.log(respons)
            // })

            //console.log(data.includes('has_clips'))

            // function UrlExists(url)
            //     {
            //         var http = new XMLHttpRequest();
            //         http.open('HEAD', url);
            //         http.onreadystatechange = function() {
            //             if (this.readyState == this.DONE) {
            //                 console.log(this);
            //             }
            //         };
            //         http.send();
            //     }

            // UrlExists(url)

            // var msg
            // let Arr = []
            // message.delete().catch()
            // await message.channel.messages.fetch({limit: 100}).then(async (messages) => {
            //     msg = await messages.filter(m => m.author.id == "329462919676821504")
            //     console.log(msg.size)
            // })

        }catch(err){
            console.error(chalk.redBright(err.stack))
            console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
        }
    }
}
