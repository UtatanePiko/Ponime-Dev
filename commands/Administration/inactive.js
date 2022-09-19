const chalk = require('chalk')

module.exports = {
    name: "inactive",
    description: "Описание команд",
    aliases: ["nonactive", "non-active"],
    run: async (bot, message, args) => {

        try{

            const Discord = require(`discord.js`)
            //const Guild = require('../../models/guild')
            const User = require('../../models/user')
            const { Embeds, crossText, noPerms, checkmarkText } = require('../../functions/Embed') 
            const { noColor } = require('../../functions/Colours')
            const Util  = require('../../functions/Util') 
            //const server = await Guild.findOne({ guildID: message.guild.id })
    
            if(Util.checkPerm(message.member, "MANAGE_GUILD") && message.author.id != "329462919676821504") return noPerms(message)

            if(args[0] == "help" || args[0] == "помощь") return message.channel.send("Обговоренная таблица, для которой мне лень делать хелп меню, да и оно не надо)")

            const dateFormat = require("dateformat")
            const xl = require('excel4node');
            var wb = new xl.Workbook();
            var options = {
                sheetView: {
                    zoomScale: 125
                }
            }
            var ws = wb.addWorksheet('Список', options);
            var i = 2

            var style = wb.createStyle({
                font: {
                  color: '#000000',
                  size: 12,
                },
              });

            // Заголовки       
            ws.cell(1, 1, 1, 2, true).string(`Пользователь`).style({font: {size: 18, bold: true}, alignment: {horizontal: 'center', vertical: 'center'}});
            ws.column(1).setWidth(25);
            ws.cell(2, 1).string(`user name`).style({font: {size: 16, bold: true}, alignment: {horizontal: 'center', vertical: 'center'}});
            ws.column(2).setWidth(25);
            ws.cell(2, 2).string(`user id`).style({font: {size: 16, bold: true}, alignment: {horizontal: 'center', vertical: 'center'}});


            ws.cell(1, 3, 2, 3, true).string(`Кол-во сообщений`).style({font: {size: 18, bold: true}, alignment: {horizontal: 'center', vertical: 'center'}});
            ws.column(3).setWidth(25);

            ws.cell(1, 4, 2, 4, true).string(`Время в войсе`).style({font: {size: 18, bold: true}, alignment: {horizontal: 'center', vertical: 'center'}});
            ws.column(4).setWidth(25);

            ws.cell(1, 5, 2, 5, true).string(`Дата присоединения`).style({font: {size: 18, bold: true}, alignment: {horizontal: 'center', vertical: 'center'}});
            ws.column(5).setWidth(30);
            // ws.cell(2, 2).string(`user tag`).style({font: {size: 16, bold: true}, alignment: {horizontal: 'center', vertical: 'center'}});
            // ws.column(3).setWidth(25);
            // ws.cell(2, 3).string(`user id`).style({font: {size: 16, bold: true}, alignment: {horizontal: 'center', vertical: 'center'}});

            // ws.cell(1, 4, 2, 4, true).string(`Использований`).style({font: {size: 18, bold: true}, alignment: {horizontal: 'center', vertical: 'center'}});
            // ws.column(4).setWidth(25);

            // ws.cell(1, 5, 1, 6, true).string(`Канал`).style({font: {size: 18, bold: true}, alignment: {horizontal: 'center', vertical: 'center'}});
            // ws.column(5).setWidth(20);
            // ws.cell(2, 5).string(`Название`).style({font: {size: 16, bold: true}, alignment: {horizontal: 'center', vertical: 'center'}});
            // ws.column(6).setWidth(20);
            // ws.cell(2, 6).string(`Тип`).style({font: {size: 16, bold: true}, alignment: {horizontal: 'center', vertical: 'center'}});

            // ws.cell(1, 7, 2, 7, true).string(`Создано`).style({font: {size: 18, bold: true}, alignment: {horizontal: 'center', vertical: 'center'}});
            // ws.column(7).setWidth(20);

            // ws.cell(1, 8, 2, 8, true).string(`Кончается`).style({font: {size: 18, bold: true}, alignment: {horizontal: 'center', vertical: 'center'}});
            // ws.column(8).setWidth(20);
            
            let endOfAugust = 1661878800
            let inActiveUsers = await User.find({
                guildID: message.guild.id,
            }, {
                guildID: 1,
                userID: 1,
                total_messages: 1,
                total_voice_time: 1
            }).lean()
            message.guild.members.cache.forEach(async mem => {
                let findUser = inActiveUsers.filter(users => users.userID == mem.id)
                if((!findUser[0] || (findUser[0].total_messages == 0 && findUser[0].total_voice_time == 0)) && !mem.user.bot){
                    i += 1
                    let joinedDate = dateFormat(new Date(mem.joinedTimestamp), "dd.mm.yyyy HH:MM")
                    ws.cell(i, 1).string(`${(mem.user.username).replace(/[^a-zа-яё0-9 ]/gi, '').trim()}#${mem.user.discriminator}`).style({style, alignment: {horizontal: 'center'}})
                    ws.cell(i, 2).string(`${mem.user.id}`).style({style, alignment: {horizontal: 'center'}})
                    ws.cell(i, 3).string(`${findUser[0] ? findUser[0].total_messages : 0}`).style({style, alignment: {horizontal: 'center'}})
                    ws.cell(i, 4).string(`${findUser[0] ? findUser[0].total_voice_time : 0}`).style({style, alignment: {horizontal: 'center'}})
                    ws.cell(i, 5).string(joinedDate).style({style, alignment: {horizontal: 'center'}})
                }
            });

        //    let invites = await message.guild.invites.fetch()
        //    await invites.forEach(element => {
        //         i += 1
        //         let createdDate = dateFormat(new Date(element.createdTimestamp), "dd.mm.yyyy HH:MM")
        //         let endDate = dateFormat(new Date(element._expiresTimestamp), "dd.mm.yyyy HH:MM")

        //         ws.cell(i, 1).string(`https://discord.gg/${element.code}`).style({style, alignment: {horizontal: 'center'}})
        //         ws.cell(i, 2).string(`${(element.inviter.username).replace(/[^a-zа-яё0-9 ]/gi, '').trim()}#${element.inviter.discriminator}`).style({style, alignment: {horizontal: 'center'}})
        //         ws.cell(i, 3).string(`${element.inviter.id}`).style({style, alignment: {horizontal: 'center'}})
        //         ws.cell(i, 4).number(element.uses).style({style, alignment: {horizontal: 'center'}})
        //         ws.cell(i, 5).string(`#${(element.channel.name).replace(/[^a-zа-яё0-9 ]/gi, '').trim()}`).style(style)
        //         ws.cell(i, 6).string(`${message.guild.channels.cache.get(element.channelId).type != 'GUILD_VOICE' ? `Текстовый` : `Голосовой`}`).style(style)
        //         ws.cell(i, 7).string(createdDate).style(style)
        //         ws.cell(i, 8).string(element._expiresTimestamp != 0 ? endDate : `Вечно`).style(style)
        //    })

           await ws.row(2).filter({firstColumn: 1, lastColumn: 5});
           var attachment 
           await wb.writeToBuffer().then(function(buffer) {
                attachment = new Discord.MessageAttachment(buffer, 'Some Sheet.xlsx');
            });

           await message.reply({files: [attachment]}).catch(err => console.error(err))
            
        }catch(err){
            console.error(chalk.redBright(err.stack))
            console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
        }
    }
}