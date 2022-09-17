const chalk = require('chalk')

module.exports = {
    name: "clear",
    description: "Описание команд",
    aliases: ["purge", "cc", "очистить"],
    run: async (bot, message, args) => {

        try{

            const Discord = require('discord.js')
            const { Embeds, crossText, checkmarkText, noPerms } = require('../../functions/Embed') 
            const { noColor } = require('../../functions/Colours')
            const Guild = require('../../models/guild')
            const roleCache = require('../../models/roleCache')
            const Util = require('../../functions/Util')
            const checkmark = Util.findEmoji('checkmark4')
            const prefix = bot.server.get(message.guild.id).prefix

            if(Util.checkPerm(message.member, "MANAGE_MESSAGES")) return noPerms(message)

            if(args[0] == "help" || args[0] == "помощь"){
                const embed = new Embeds({
                    message: message,
                    description: `Очистка X сообщений, где X > 0 и X =< 500 `,
                    embedTitle: "CLEAR HELP-MENU",
                    embedColor: noColor(),
                    arguments: `● **\`${prefix}сlear <Кол-во>\`**\n● **\`${prefix}сlear <@user> <Область удаления> [all]\`**`,
                    alternatives: `● **\`${prefix}clear\`** | **\`${prefix}purge\`** | **\`${prefix}cc\`** | **\`${prefix}очистить\`**`,
                    examples: `● **\`${prefix}clear 15\`**\n● **\`${prefix}clear @user 50\`**\n● **\`${prefix}clear @user 200 all\`**`,
                    hints: `● Область удаления - это область сообщений, среди которых будут удалены сообщения от указанного юзера\n● Добавление all после области удаления удаляет сообщения во всех каналах от указанного пользователя в введенном диапазоне\n● Альтернативы используются для сокращения написания команды и ничем не отличаются\n● **\`<>\`** - обязательно для заполнения`
                })
          
                return embed.help()
              }

            const mentuser = args[0] ? message.guild.members.cache.get(args[0].replace('<@', '').replace('>', '')) ? message.guild.members.cache.get(args[0].replace('<@', '').replace('>', '')) : await roleCache.findOne({guildID: message.guild.id, userID: args[0]}) : null

            if(mentuser){
                async function fetchMore(channel, limit = 250) {
                    if (!channel) {
                        throw new Error(`Expected channel, got ${typeof channel}.`);
                    }
                    if (limit <= 100) {
                        return channel.messages.fetch({ limit });
                    }
                    
                    let collection = new Discord.Collection();
                    let lastId = null;
                    let options = {};
                    let remaining = limit;
                    
                    while (remaining > 0) {
                        options.limit = remaining > 100 ? 100 : remaining;
                        remaining = remaining > 100 ? remaining - 100 : 0;
                    
                        if (lastId) {
                          options.before = lastId;
                        }
                    
                        let messages = await channel.messages.fetch(options)
                    
                        if (!messages.last()) {
                          break;
                        }
                    
                        collection = collection.concat(messages);
                        lastId = messages.last().id;
                      }
                    
                    return collection;
                }
      
                if(!args[1]) return crossText(`Не указана область удаления сообщений\nПример: **\`${message.content.split(" ")[0].toLowerCase()} @user 10\`**`, message)
                if(!isFinite(args[1]) || args[1] % 1 !== 0 || args[1].includes("+") || args[1].includes(".")) return crossText(`Область удаляемых сообщений должна быть целым числом`, message)
                var NumberMsg = parseInt(args[1])
                if(NumberMsg < 1) return crossText(`Область удаляемых сообщений не может быть меньше 1`, message)
                if(NumberMsg > 500) return crossText(`Область удаляемых сообщений не может быть больше 500`, message)

                await message.delete().catch()
    
                if(bot.clearState.has(message.guild.id)) return crossText(`На сервере уже происходит удаление сообщений!\nЭто сообщение не может быть удалено автоматически`, message)
    
                await bot.clearState.set(message.guild.id)

                if(NumberMsg <= 100){
                    if(args[2] == "all"){
                        let mem = message.guild.members.cache.get(args[0].replace('<@', '').replace('>', '')) ? message.guild.members.cache.get(args[0].replace('<@', '').replace('>', '')).id : null
                        if(!mem) mem = await roleCache.findOne({guildID: message.guild.id, userID: args[0]})
                        mem = message.guild.members.cache.get(args[0].replace('<@', '').replace('>', '')) ? message.guild.members.cache.get(args[0].replace('<@', '').replace('>', '')).id : mem.userID
                        bot.clearState.delete(message.guild.id)
                        await message.guild.channels.cache.filter(ch => ch.type == "GUILD_TEXT" || ch.type == "GUILD_PUBLIC_THREAD").forEach(async(chan) => {
                            let list = await fetchMore(chan, args[1])
                            list = await list.filter(m => m.author.id === mem)
                            chan.bulkDelete(list, true).catch()
                        })
                        let embed = new Discord.MessageEmbed().setDescription(`${checkmark} Сообщения от ${mentuser} со всех каналов были удалены в диапазаоне ${NumberMsg} сообщений`).setColor("00ae5d")
                        await message.channel.send({ embeds: [embed] }).then(async (msg) => {
                            setTimeout(async () => {
                                try {
                                    await msg.delete()
                                }catch(err){
                                    console.error(chalk.yellowBright(`Если вы видите эту ошибку, то все ок, потому что по-другому никак не захватить ошибку ${message.content.split(" ")[0].toLowerCase()}`))
                                }
                            }, 10000)
                        }).catch(console.error);
                        bot.clearState.delete(message.guild.id)
                    } else {
                        let list = await fetchMore(message.channel, args[1])
                        let mem = message.guild.members.cache.get(args[0].replace('<@', '').replace('>', '')) ? message.guild.members.cache.get(args[0].replace('<@', '').replace('>', '')).id : null
                        if(!mem) mem = await roleCache.findOne({guildID: message.guild.id, userID: args[0]})
                        mem = message.guild.members.cache.get(args[0].replace('<@', '').replace('>', '')) ? message.guild.members.cache.get(args[0].replace('<@', '').replace('>', '')).id : mem.userID
                        list = await list.filter(m => m.author.id === mem)
                        bot.clearState.delete(message.guild.id)
                        await message.channel.bulkDelete(list, true).then(async(messages) => {
                            let embed = new Discord.MessageEmbed().setDescription(`${checkmark} Было удалено **${messages.size}** сообщений`).setColor("00ae5d")
                            await message.channel.send({ embeds: [embed] }).then(async (msg) => {
                                setTimeout(async () => {
                                    try {
                                        await msg.delete()
                                    }catch(err){
                                        console.error(chalk.yellowBright(`Если вы видите эту ошибку, то все ок, потому что по-другому никак не захватить ошибку ${message.content.split(" ")[0].toLowerCase()}`))
                                    }
                                }, 5000)
                            }).catch(console.error);
                            bot.clearState.delete(message.guild.id)
                        }).catch()
                    }
                } else {
                    if(args[2] == "all"){
                        await message.guild.channels.cache.filter(ch => ch.type == "GUILD_TEXT" || ch.type == "GUILD_PUBLIC_THREAD").forEach(async(chan) => {
                            for(let i = NumberMsg; i > 0; i -= 100){
                                if (i > 100) { 
                                    let list = await fetchMore(chan, 100)
                                    let mem = message.guild.members.cache.get(args[0].replace('<@', '').replace('>', '')) ? message.guild.members.cache.get(args[0].replace('<@', '').replace('>', '')).id : null
                                    if(!mem) mem = await roleCache.findOne({guildID: message.guild.id, userID: args[0]})
                                    mem = message.guild.members.cache.get(args[0].replace('<@', '').replace('>', '')) ? message.guild.members.cache.get(args[0].replace('<@', '').replace('>', '')).id : mem.userID        
                                    list = await list.filter(m => m.author.id == mem)
                                    await chan.bulkDelete(list, true).catch()
                                } else {
                                    let list = await fetchMore(chan, i)
                                    let mem = message.guild.members.cache.get(args[0].replace('<@', '').replace('>', '')) ? message.guild.members.cache.get(args[0].replace('<@', '').replace('>', '')).id : null
                                    if(!mem) mem = await roleCache.findOne({guildID: message.guild.id, userID: args[0]})
                                    mem = message.guild.members.cache.get(args[0].replace('<@', '').replace('>', '')) ? message.guild.members.cache.get(args[0].replace('<@', '').replace('>', '')).id : mem.userID        
                                    list = await list.filter(m => m.author.id == mem)
                                    chan.bulkDelete(list, true).catch()
                                }
                            }
                        })
                        let embed = new Discord.MessageEmbed().setDescription(`${checkmark} Сообщения от ${mentuser} со всех каналов были удалены в диапазаоне ${NumberMsg} сообщений`).setColor("00ae5d")
                        await message.channel.send({ embeds: [embed] }).then(async (msg) => {
                            setTimeout(async () => {
                                try {
                                    await msg.delete()
                                }catch(err){
                                    console.error(chalk.yellowBright(`Если вы видите эту ошибку, то все ок, потому что по-другому никак не захватить ошибку ${message.content.split(" ")[0].toLowerCase()}`))
                                }
                            }, 10000)
                        }).catch(console.error);
                        bot.clearState.delete(message.guild.id)
                    } else {
                        var amount = 0
                        for(let i = NumberMsg; i > 0; i -= 100){
                            if (i > 100) { 
                                let list = await fetchMore(message.channel, 100)
                                let mem = message.guild.members.cache.get(args[0].replace('<@', '').replace('>', '')) ? message.guild.members.cache.get(args[0].replace('<@', '').replace('>', '')).id : null
                                if(!mem) mem = await roleCache.findOne({guildID: message.guild.id, userID: args[0]})
                                mem = message.guild.members.cache.get(args[0].replace('<@', '').replace('>', '')) ? message.guild.members.cache.get(args[0].replace('<@', '').replace('>', '')).id : mem.userID        
                                list = await list.filter(m => m.author.id == mem)
                                await message.channel.bulkDelete(list, true).then(async(messages) => {
                                    amount += messages.size
                                }).catch()
                            } else {
                                let list = await fetchMore(message.channel, i)
                                let mem = message.guild.members.cache.get(args[0].replace('<@', '').replace('>', '')) ? message.guild.members.cache.get(args[0].replace('<@', '').replace('>', '')).id : null
                                if(!mem) mem = await roleCache.findOne({guildID: message.guild.id, userID: args[0]})
                                mem = message.guild.members.cache.get(args[0].replace('<@', '').replace('>', '')) ? message.guild.members.cache.get(args[0].replace('<@', '').replace('>', '')).id : mem.userID        
                                list = await list.filter(m => m.author.id == mem)
                                message.channel.bulkDelete(list, true).then(async () => {
                                    let embed = new Discord.MessageEmbed().setDescription(`${checkmark} Было удалено **${amount}** сообщений`).setColor("00ae5d")
                                    await message.channel.send({ embeds: [embed] }).then(async (msg) => {
                                        setTimeout(async () => {
                                            try {
                                                await msg.delete()
                                            }catch(err){
                                                console.error(chalk.yellowBright(`Если вы видите эту ошибку, то все ок, потому что по-другому никак не захватить ошибку ${message.content.split(" ")[0].toLowerCase()}`))
                                            }
                                        }, 5000)
                                    }).catch(console.error);
                                    bot.clearState.delete(message.guild.id)
                                }).catch()
                            }
                        }
                    }
                }
            } else {
                if(!args[0]) return crossText(`Не указано количество сообщений для удаления\nПример: **\`${message.content.split(" ")[0].toLowerCase()} 10\`**`, message)
                if(!isFinite(args[0]) || args[0] % 1 !== 0 || args[0].includes("+") || args[0].includes(".")) return crossText(`Удаляемое кол-во должно быть целым числом`, message)
                var NumberMsg = parseInt(args[0])
                if(NumberMsg < 1) return crossText(`Количество удаляемых сообщений не может быть меньше 1`, message)
                if(NumberMsg > 500) return crossText(`Количество удаляемых сообщений не может быть больше 500`, message)
    
                await message.delete().catch()
    
                if(bot.clearState.has(message.guild.id)) return crossText(`На сервере уже происходит удаление сообщений!\nЭто сообщение не может быть удалено автоматически`, message)
    
                await bot.clearState.set(message.guild.id)
    
                if(NumberMsg <= 100){
                    await message.channel.bulkDelete(NumberMsg, true).then(async(messages) => {
                        if(messages.size != NumberMsg) {
                            let embed = new Discord.MessageEmbed().setDescription(`${checkmark} Было удалено **${messages.size}** сообщений | Сообщения двухнедельной давности были пропущены`).setColor("00ae5d")
                            await message.channel.send({ embeds: [embed] }).then(async (msg) => {
                                setTimeout(async () => {
                                    try {
                                        await msg.delete()
                                    }catch(err){
                                        console.error(chalk.yellowBright(`Если вы видите эту ошибку, то все ок, потому что по-другому никак не захватить ошибку ${message.content.split(" ")[0].toLowerCase()}`))
                                    }
                                }, 5000)
                            }).catch(console.error);
                        } else {
                            let embed = new Discord.MessageEmbed().setDescription(`${checkmark} Было удалено **${messages.size}** сообщений`).setColor("00ae5d")
                            await message.channel.send({ embeds: [embed] }).then(async (msg) => {
                                setTimeout(async () => {
                                    try {
                                        await msg.delete()
                                    }catch(err){
                                        console.error(chalk.yellowBright(`Если вы видите эту ошибку, то все ок, потому что по-другому никак не захватить ошибку ${message.content.split(" ")[0].toLowerCase()}`))
                                    }
                                }, 5000)
                            }).catch(console.error);
                            
                        }
                        bot.clearState.delete(message.guild.id)
                    }).catch()
                } else {
                    var amount = 0
                    for(let i = NumberMsg; i > 0; i -= 100){
                        if (i > 100) { 
                            message.channel.bulkDelete(100, true).then(async(messages) => {
                                amount += messages.size
                            }).catch()
                        } else {
                            message.channel.bulkDelete(i, true).then(async(messages) => {
                                amount += messages.size
                            }).then(async () => {
                                if(amount != NumberMsg) {
                                    let embed = new Discord.MessageEmbed().setDescription(`${checkmark} Было удалено **${amount}** сообщений | Сообщения двухнедельной давности были пропущены`).setColor("00ae5d")
                                    await message.channel.send({ embeds: [embed] }).then(async (msg) => {
                                        setTimeout(async () => {
                                            try {
                                                await msg.delete()
                                            }catch(err){
                                                console.error(chalk.yellowBright(`Если вы видите эту ошибку, то все ок, потому что по-другому никак не захватить ошибку ${message.content.split(" ")[0].toLowerCase()}`))
                                            }
                                        }, 5000)
                                    }).catch(console.error);
                                } else {
                                    let embed = new Discord.MessageEmbed().setDescription(`${checkmark} Было удалено **${amount}** сообщений`).setColor("00ae5d")
                                    await message.channel.send({ embeds: [embed] }).then(async (msg) => {
                                        setTimeout(async () => {
                                            try {
                                                await msg.delete()
                                            }catch(err){
                                                console.error(chalk.yellowBright(`Если вы видите эту ошибку, то все ок, потому что по-другому никак не захватить ошибку ${message.content.split(" ")[0].toLowerCase()}`))
                                            }
                                        }, 5000)
                                    }).catch(console.error);
                                }
                                bot.clearState.delete(message.guild.id)
                            }).catch()
                        }
                    }
                }
            }
        }catch(err){
            console.error(chalk.redBright(err.stack))
            console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
        }
    }
}
