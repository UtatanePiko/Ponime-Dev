const chalk = require('chalk')

module.exports = {
    name: "film",
    description: "Описание команд",
    aliases: ["фильм"],
    run: async (bot, message, args) => {

        try{

            const User = require('../../models/user')
            const Discord = require('discord.js')
            const Guild = require('../../models/guild')
            const Giveaway = require('../../models/giveaway')
            const mongoose = require("mongoose")
            const MongoFunc = require('../../functions/MongoFunc') 
            const ms = require('ms')
            const { Embeds, crossText, noPerms, checkmarkText, noColorEmbed } = require('../../functions/Embed') 
            const { noColor, botColorMessage } = require('../../functions/Colours')
            const Util  = require('../../functions/Util')
            const prefix = bot.server.get(message.guild.id).prefix
            const Events = require('../../models/events')
            const { DECLINE_BUTTON, PUBLISH_CHANNEL_SELECTMENU, FILM_SCHEDULE_SELECTMENU } = require('../../functions/Buttons')
            const { ONE_FILM_SCHEDULE, TWO_FILMS_SCHEDULE } = require('../../functions/Film_Schedules')
            const { stringToDateFull, stringToDateTime} = require('../../functions/Util')
            const channelFilter = (m) => m.author.id === message.member.id
            
            let eventRole = message.guild.roles.cache.find(r => r.name.includes('Кино-стример'))
            if(Util.checkPerm(message.member, "MANAGE_ROLES") && !(eventRole && message.member.roles.cache.has(eventRole.id)) && message.member.id != "329462919676821504") return noPerms(message)

            if(args[0] == "help" || args[0] == "помощь"){
                const embed = new Embeds({
                    message: message,
                    description: `Создание эмбед сообщения для фильма`,
                    embedTitle: "FILM HELP-MENU",
                    embedColor: noColor(),
                    arguments: `● **\`${prefix}film <create/создать>\`**`,
                    alternatives: `● **\`${prefix}film\`** | **\`${prefix}фильм\`**`,
                    examples: `● **\`${prefix}film create\`**`,
                    hints: `● **\`<>\`** - обязательно для заполнения`
                })
    
                return embed.help()
            }



            if(!args[0]) return crossText(`Не указано никаких аргументов\nИспользуйте **\`${message.content.split(" ")[0].toLowerCase()} help\`**, чтобы узнать возможные аргументы`, message)
            if((args[0]).toLowerCase() == "create" || (args[0]).toLowerCase() == "создать"){

                let selectScheduleEmbed = new Discord.MessageEmbed().setTitle(`🛠️ Создание фильма 🛠️`).setColor("#2F3136")
                .setDescription(`Выберите шаблон, по которому будет происходить создание эмбед(-ов)`)
                let initMessage = await message.reply({
                    embeds: [selectScheduleEmbed],
                    components: [FILM_SCHEDULE_SELECTMENU(), DECLINE_BUTTON()]
                })
                const selectScheduleCollector = initMessage.createMessageComponentCollector({channelFilter, time: 60000, max: 1, errors: ['time']})

                selectScheduleCollector.on('collect', async i => {
                    if (i.member.id != message.member.id) return await i.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                    if(i.customId == 'decline_button'){
                        console.log('declined')
                    } else if(i.values[0] == 'one_film'){
                        await ONE_FILM_SCHEDULE(message, message.member.id)
                    } else {
                        return i.reply({content: "Данная функция находится в непонимании оформления", ephemeral: true})
                        await TWO_FILMS_SCHEDULE(message, message.member.id)
                    }
                    initMessage.edit({
                        components: [FILM_SCHEDULE_SELECTMENU(true), DECLINE_BUTTON(true)]
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