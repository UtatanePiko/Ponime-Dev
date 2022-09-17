const chalk = require('chalk')

module.exports = {
    name: "love",
    description: "Описание команд",
    aliases: ['ship', 'любовь', 'шип'],
    run: async (bot, message, args) => {

        try{

            const mongoose = require('mongoose')
            const Discord = require('discord.js')
            const Guild = require('../../models/guild')
            const Love = require('../../models/love')
            const { Embeds, crossText } = require('../../functions/Embed') 
            const { noColor } = require('../../functions/Colours')
            const {findEmoji} = require('../../functions/Util')
            const prefix = bot.server.get(message.guild.id).prefix
            if(!(bot.server.get(message.guild.id).leveling_channels).includes(message.channel.id) && message.member.id != "329462919676821504") return crossText(`Данная команда разрешена лишь в следующих чатах: ${message.guild.channels.cache.find(ch => ch.id == "880530956304392262") || "880530956304392262"} ${message.guild.channels.cache.find(ch => ch.id == "841889007654141982") || "841889007654141982"}`, message)

            let fullHeart = findEmoji('heart_full')
            let holeHeart = findEmoji('heart_hole')
            

            if(args[0] == "help" || args[0] == "помощь"){
                const embed = new Embeds({
                    message: message,
                    description: `Проверка на совместимость`,
                    embedTitle: "LOVE HELP-MENU",
                    embedColor: noColor(),
                    arguments: `● **\`${prefix}love <@user | userID>\`**`,
                    alternatives: `● **\`${prefix}love\`** | **\`${prefix}любовь\`** | **\`${prefix}ship\`** | **\`${prefix}шип\`**`,
                    examples: `● **\`${prefix}love @user\`**`,
                    hints: `● **\`<>\`** - обязательно для заполнения`
                })
                return embed.help()
            }

            const mentuser = args[0] ? message.guild.members.cache.get(args[0].replace('<@', '').replace('>', '')) : null

            if(!mentuser) return crossText(`Не указан или не найден пользователь!\nПример: **\`${message.content.split(" ")[0].toLowerCase()} <@user | userID>\`**`, message)
            if (mentuser.id == message.member.id) return message.reply('Это зависит только от уровня эгоизма')
            let findLove = await Love.findOne({guildID: message.guild.id, userID: message.member.id, toUserID: mentuser.id}, {love: 1}).lean() || await Love.findOne({guildID: message.guild.id, userID: mentuser.id, toUserID: message.member.id}, {love: 1}).lean()
            let love = findLove ? findLove.love : Math.floor(Math.random() * 101)
            let loveIndex = Math.floor(love / 6.5)
            let loveLevel = `${fullHeart}`.repeat(loveIndex) + `${holeHeart}`.repeat(15 - loveIndex)

            let percatage_20 = [
                'Хуже пары не придумать...',
                ' Вы всего лишь шутка...',
                'Эта пара явно не подходит друг другу',
                'Из этих двоих пары уж точно не видать',
                'Эта пара уж слишком, не',
            ]

            let percatage_45 = [
                'Плохое сочетание, конечно... Но шансы есть',
                'Просто друзья'
            ]

            let percatage_60 = [
                'Лучшие друзья',
                'Друзья и ничего больше',
            ]

            let percatage_80 = [
                'Почти пара',
                'Вы неплохо подходите друг другу',
                `Хорошая пара`
            ]

            let percatage_99 = [
                'Из вас получится отличная пара!',
                'Вы подходите как никто другой!',
                `Вы просто нечто!`
            ]

            let percatage_100 = [
                'Вы лучшая пара в мире!',
                'Ожидаем приглашений на свадьбу'
            ]

            let text = 
            love <= 20 ? percatage_20[Math.floor(Math.random() * percatage_20.length)] :
            love > 20 && love <= 45 ? percatage_45[Math.floor(Math.random() * percatage_45.length)] :
            love > 45 && love <= 60 ? percatage_60[Math.floor(Math.random() * percatage_60.length)] :
            love > 60 && love <= 80 ? percatage_80[Math.floor(Math.random() * percatage_80.length)] :
            love > 80 && love <= 99 ? percatage_99[Math.floor(Math.random() * percatage_99.length)] :
            love == 100 ? percatage_100[Math.floor(Math.random() * percatage_100.length)] : null


            let embed = new Discord.MessageEmbed()
            .setTitle(`Проверка на совместимость`)
            .setColor(noColor())
            .setDescription(`Пара: **${message.member.displayName}** и **${mentuser.displayName}**: \`${love}%\`\n${loveLevel}\n**${text == null ? 'Этот текст поидее не должен быть виден' : text}**`)

            message.reply({embeds: [embed]})

            if(!findLove){
                let newLove = new Love({
                    _id: mongoose.Types.ObjectId(),
                    guildID: message.guild.id,
                    userID: message.member.id,
                    toUserID: mentuser.id,
                    love: love
                })
                newLove.save().catch()
            }

    
        }catch(err){
            console.error(chalk.redBright(err.stack))
            console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
        }
    }
}
