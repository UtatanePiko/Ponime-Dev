const chalk = require('chalk')

module.exports = {
    name: "roulette",
    description: "Описание команд",
    aliases: ["рулетка", "r"],
    run: async (bot, message, args) => {
        try{
            
            const Discord = require('discord.js')
            const User = require('../../models/user')
            const Guild = require('../../models/guild')
            const MongoFunc = require('../../functions/MongoFunc')
            const Util = require('../../functions/Util')
            const coin = Util.findEmoji('CHPOKI_COIN')
            const { Embeds, crossText } = require('../../functions/Embed') 
            const { noColor, successColor } = require('../../functions/Colours')
            const prefix = bot.server.get(message.guild.id).prefix

            

            if(args[0] == "help" || args[0] == "помощь"){
                const embed = new Discord.MessageEmbed().setColor(noColor())
                .setTitle(`ROULETTE HELP-MENU`)
                .setDescription(`Рулетка, где вы можете поставить, какое число выпадет\nВы также можете ставить сразу несколько ставок`)
                .setFields(
                    {name: `Аргументы`, value: `● **\`${prefix}roulette <Сумма | half | all> <Позиция>\`**`},
                    {name: `Альтернативы`, value: `● **\`${prefix}roulette\`** | **\`${prefix}рулетка\`**`},
                    {name: `Множители позиций`, value: `● [x36] Одиночное число\n`+
                    `● [x 3] Дюжины (1-12, 13-24, 25-36)\n`+
                    `● [x 3] Колонки (1ая, 2ая, 3ья)\n`+
                    `● [x 2] Половины (1-18, 19-36)\n`+
                    `● [x 2] Чет/Нечет\n`+
                    `● [x 2] Цвета (красн, черн)\n`},
                    {name: `Примеры`, value: `● **\`${prefix}roulette 1500 black(черн)\`**\n` + 
                    `● **\`${prefix}roulette half 1-12\`**\n` +
                    `● **\`${prefix}roulette all even(чет)\`**`},
                    {name: `Примечания`, value: `● **\`<>\`** - обязательно для заполнения\n`+
                    `● Вы можете использовать как английские обозначения, так и русские`},
                )
                .setImage(`https://imgur.com/Yc49d8Y.png`)
                
    
                return message.reply({embeds: [embed]})
            }

            allowedSpaces = [
                '0',  '1',  '2',  '3',  '4',  '5',
                '6',  '7',  '8',  '9',  '10', '11',
                '12', '13', '14', '15', '16', '17',
                '18', '19', '20', '21', '22', '23',
                '24', '25', '26', '27', '28', '29',
                '30', '31', '32', '33', '34', '35',
                '36', '1-12', '13-24', '25-36', '1st',
                '2nd', '3rd', '1-18', '19-36', 'odd',
                'even', 'чет', 'чёт', 'нечет', 'нечёт',
                'red', 'black', 'красн', 'черн', 'чёрн',
                '1ая', '2ая', '3ья'
            ]
            const Dozen1to12 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
            const Dozen13to24 = [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
            const Dozen25to36 = [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36]
            const column1 = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34]
            const column2 = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35]
            const column3 = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36]
            const half1to18 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
            const half19to36 = [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36]
            const even = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36]
            const odd = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35]
            const red = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]
            const black = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35]

            const dbUser = await User.findOne({userID: message.member.id, guildID: message.guild.id})
            let getGame = bot.roulette.get(message.guild.id)

            if(!args[0]) return crossText(`Не было указано суммы для игры`, message)
            let amount = args[0]
            if((amount % 1 != 0 || amount.includes('.') || amount.includes('+') || amount <= 99) && (amount.toLowerCase() != 'all' && amount.toLowerCase() != 'half')) return crossText(`Сумма для игры должна быть целым положительным числом больше 100 или аргументами \`half\`** **\`all\``, message)
            amount = args[0].toLowerCase() == 'all' ? dbUser.currency : args[0].toLowerCase() == 'half' ? Math.floor(dbUser.currency / 2) : parseInt(args[0])
            if(amount > dbUser.currency) return crossText(`У вас недостаточно койнов на руках\nБаланс на руках: **${dbUser.currency}** ${coin}`, message)
            
            if(!args[1]) return crossText(`Не было указано позиции`, message)
            let space = args[1].toLowerCase()
            if(!allowedSpaces.includes(space)) return crossText(`Позиция не была указана верно\nДля просмотра списка позиций, используйте: **\`${prefix}roulette help\`**`, message)
            if(space == '1-12') space = Dozen1to12
            if(space == '13-24') space = Dozen13to24
            if(space == '25-36') space = Dozen25to36
            if(space == '1st' || space == '1ая') space = column1
            if(space == '2nd' || space == '2ая') space = column2
            if(space == '3rd' || space == '3ья') space = column3
            if(space == '1-18') space = half1to18
            if(space == '19-36') space = half19to36
            if(space == 'even' || space == 'чет' || space == 'чёт') space = even
            if(space == 'odd' || space == 'нечет' || space == 'нечёт') space = odd
            if(space == 'red' || space == 'красн') space = red
            if(space == 'black' || space == 'черн' || space == 'чёрн') space = black
            space = typeof space == 'object' ? space : [parseInt(space)]
            
            if(!getGame){
                bot.roulette.set(message.guild.id, {
                    Date: Date.now(),
                    members: [
                        {
                            userID: message.member.id,
                            spaces: [{
                                amount: amount,
                                bet: space
                            }]
                        }
                    ]
                })

                let betEmbed = new Discord.MessageEmbed().setColor(successColor())
                .setAuthor({
                    name: `${message.author.username}#${message.author.discriminator}`,
                    iconURL: message.member.displayAvatarURL({size: 512, format: 'png', dynamic: true})
                })
                .setDescription(`Вы сделали ставку **${amount}** ${coin} на \`${args[1].toLowerCase()}\``)
                .setFooter({text: `Времени осталось: 30 секунд`})
                message.reply({embeds: [betEmbed]})
                dbUser.currency -= amount
                dbUser.save().catch()

                setTimeout(async () => {
                    let randomNumber = Math.floor(Math.random() * 37)
                    let winners = []
                    let winnersInfo = []
                    await bot.roulette.get(message.guild.id).members.forEach(mem => {
                        var isWinner = false
                        var winAmount = 0
                        mem.spaces.forEach(betInfo => {
                            if(betInfo.bet.includes(randomNumber)){
                                isWinner = true
                                if(betInfo.bet.length == 18) winAmount += betInfo.amount * 2
                                if(betInfo.bet.length == 12) winAmount += betInfo.amount * 3
                                if(betInfo.bet.length == 1) winAmount += betInfo.amount * 36
                            }
                        })
                        if(isWinner){
                            winners.push(`<@${mem.userID}> выйграл **${winAmount}** ${coin}`)
                            winnersInfo.push({
                                uid: mem.userID,
                                winAmount: winAmount
                            })
                        }
                    })
                    let embed = new Discord.MessageEmbed().setColor(noColor()).setTitle(`Результат рулетки`)
                    .setDescription(`Шар приземлился на число **${red.includes(randomNumber) ? "красное" : "черное"} ${randomNumber}**`)
                    .setFields(
                        {name: `Победители:`, value: `${winners.length == 0 ? "Нет победителей" : `${winners.join(`\n`)}`}`}
                    )
                    message.channel.send({embeds: [embed]})
                    winnersInfo.forEach(async winner => {
                        let winnerDB = await User.findOne({userID: winner.uid, guildID: message.guild.id})
                        winnerDB.currency += winner.winAmount
                        winnerDB.save().catch()
                    })
                    bot.roulette.delete(message.guild.id)
                }, 30000)
            } else {
                let mem = getGame.members.filter(u => u.userID === message.member.id)[0]
                let spaces = mem ? mem.spaces : [{
                    amount: amount,
                    bet: space
                }]
                if(mem){
                    spaces.push({
                        amount: amount,
                        bet: space
                    })
                }

                let allMembers = []
                getGame.members.forEach(element => {
                    if(element.userID == message.member.id) return
                    allMembers.push(element)
                })
                allMembers.push({
                    userID: message.member.id,
                    spaces: spaces
                })
                bot.roulette.set(message.guild.id, {
                    Date: getGame.Date,
                    members: allMembers
                })

                let betEmbed = new Discord.MessageEmbed().setColor(successColor())
                .setAuthor({
                    name: `${message.author.username}#${message.author.discriminator}`,
                    iconURL: message.member.displayAvatarURL({size: 512, format: 'png', dynamic: true})
                })
                .setDescription(`Вы сделали ставку **${amount}** ${coin} на \`${args[1].toLowerCase()}\``)
                .setFooter({text: `Времени осталось: ${Math.floor((getGame.Date + 30000 - Date.now()) / 1000)} секунд`})
                message.reply({embeds: [betEmbed]})
                dbUser.currency -= amount
                dbUser.save().catch()
            }


        }catch(err){
            console.error(chalk.redBright(err.stack))
            console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
        }
    }
}
