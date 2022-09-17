const chalk = require('chalk')

module.exports = {
    name: "invites",
    description: "Описание команд",
    aliases: ["приглашения"],
    run: async (bot, message, args) => {

        try{

            const Discord = require(`discord.js`)
            const Guild = require('../../models/guild')
            const { Embeds, crossText, noPerms, checkmarkText } = require('../../functions/Embed') 
            const { noColor } = require('../../functions/Colours')
            const Util  = require('../../functions/Util') 
            const server = await Guild.findOne({ guildID: message.guild.id })
    
            if(Util.checkPerm(message.member, "MANAGE_GUILD") && message.author.id != "329462919676821504") return noPerms(message)

            if(args[0] == "help" || args[0] == "помощь"){
                const embed = new Embeds({
                    message: message,
                    description: `Выгрузка приглашений в excel документ`,
                    embedTitle: "INITES HELP-MENU",
                    embedColor: noColor(),
                    arguments: `● **\`${server.prefix}invites\`**`,
                    alternatives: `● **\`invites\`** | **\`приглашения\`**`,
                    examples: `● **\`${server.prefix}invites\`**`,
                    hints: `● Выгружает код, создавшего, канал, кол-во использований и дату создания/окончания`
                })
    
                return embed.help()
            }

            const dateFormat = require("dateformat")
            const xl = require('excel4node');
            var wb = new xl.Workbook();
            var options = {
                sheetView: {
                    zoomScale: 128
                }
            }
            var ws = wb.addWorksheet('Приглашения', options);
            var i = 2

            var style = wb.createStyle({
                font: {
                  color: '#000000',
                  size: 12,
                },
              });

            // Заголовки       
            ws.cell(1, 1, 2, 1, true).string(`Код приглашения`).style({font: {size: 18, bold: true}, alignment: {horizontal: 'center', vertical: 'center'}});
            ws.column(1).setWidth(25);

            ws.cell(1, 2, 1, 3, true).string(`Кто создал`).style({font: {size: 18, bold: true}, alignment: {horizontal: 'center', vertical: 'center'}});
            ws.column(2).setWidth(25);
            ws.cell(2, 2).string(`user tag`).style({font: {size: 16, bold: true}, alignment: {horizontal: 'center', vertical: 'center'}});
            ws.column(3).setWidth(25);
            ws.cell(2, 3).string(`user id`).style({font: {size: 16, bold: true}, alignment: {horizontal: 'center', vertical: 'center'}});

            ws.cell(1, 4, 2, 4, true).string(`Использований`).style({font: {size: 18, bold: true}, alignment: {horizontal: 'center', vertical: 'center'}});
            ws.column(4).setWidth(25);

            ws.cell(1, 5, 1, 6, true).string(`Канал`).style({font: {size: 18, bold: true}, alignment: {horizontal: 'center', vertical: 'center'}});
            ws.column(5).setWidth(20);
            ws.cell(2, 5).string(`Название`).style({font: {size: 16, bold: true}, alignment: {horizontal: 'center', vertical: 'center'}});
            ws.column(6).setWidth(20);
            ws.cell(2, 6).string(`Тип`).style({font: {size: 16, bold: true}, alignment: {horizontal: 'center', vertical: 'center'}});

            ws.cell(1, 7, 2, 7, true).string(`Создано`).style({font: {size: 18, bold: true}, alignment: {horizontal: 'center', vertical: 'center'}});
            ws.column(7).setWidth(20);

            ws.cell(1, 8, 2, 8, true).string(`Кончается`).style({font: {size: 18, bold: true}, alignment: {horizontal: 'center', vertical: 'center'}});
            ws.column(8).setWidth(20);
            
           let invites = await message.guild.invites.fetch()
           await invites.forEach(element => {
                i += 1
                let createdDate = dateFormat(new Date(element.createdTimestamp), "dd.mm.yyyy HH:MM")
                let endDate = dateFormat(new Date(element._expiresTimestamp), "dd.mm.yyyy HH:MM")

                ws.cell(i, 1).string(`https://discord.gg/${element.code}`).style({style, alignment: {horizontal: 'center'}})
                ws.cell(i, 2).string(`${(element.inviter.username).replace(/[^a-zа-яё0-9 ]/gi, '').trim()}#${element.inviter.discriminator}`).style({style, alignment: {horizontal: 'center'}})
                ws.cell(i, 3).string(`${element.inviter.id}`).style({style, alignment: {horizontal: 'center'}})
                ws.cell(i, 4).number(element.uses).style({style, alignment: {horizontal: 'center'}})
                ws.cell(i, 5).string(`#${(element.channel.name).replace(/[^a-zа-яё0-9 ]/gi, '').trim()}`).style(style)
                ws.cell(i, 6).string(`${message.guild.channels.cache.get(element.channelId).type != 'GUILD_VOICE' ? `Текстовый` : `Голосовой`}`).style(style)
                ws.cell(i, 7).string(createdDate).style(style)
                ws.cell(i, 8).string(element._expiresTimestamp != 0 ? endDate : `Вечно`).style(style)
           })

           await ws.row(2).filter({firstColumn: 1, lastColumn: 8});
           var attachment 
           await wb.writeToBuffer().then(function(buffer) {
                attachment = new Discord.MessageAttachment(buffer, 'Invites.xlsx');
            });

           await message.reply({files: [attachment]}).catch(err => console.error(err))
            
        }catch(err){
            console.error(chalk.redBright(err.stack))
            console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
        }
    }
}