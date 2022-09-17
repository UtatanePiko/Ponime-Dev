const bot = require("..");
const Guild = require('../models/guild')
const User = require('../models/user')
const mongoose = require('mongoose')
const MongoFunc = require('../functions/MongoFunc')
const chalk = require('chalk')
const Mute = require('../models/mute')

// const checkmark = message.guild.emojis.cache.find(e => e.name == "text_yes")
// const cross = message.guild.emojis.cache.find(e => e.name == "text_no") 

const usersMap = bot.spamMap;
const capsMap = bot.capsMap
const DIFF = 1000 * 60 * 5;

bot.on("messageCreate", async (message) => {
    try{

        if(message.author.bot) return
        if(!message.member) return

        if(message.guild.id != "914124553960194059" && message.guild.id != "705508214019588116") return console.log(message.guild.id) 
        
        let prefix = await bot.server.get(message.guild.id).prefix
            if (message.guild && message.content.toLowerCase().startsWith(prefix)){
                let args = message.content.slice(prefix.length).replace(/ +/g, ' ').trim().split(' ');
                let cmd = args.shift().toLowerCase();

                const command = bot.commands.get(cmd.toLowerCase()) || bot.commands.find(c => c.aliases?.includes(cmd.toLowerCase()));
        
                if (command) await command.run(bot, message, args); 
            }

            let server = await Guild.findOne({guildID: message.guild.id}, {prefix: 1, automod: 1, caps_msg: 1, spam_msg: 1, link_msg: 1, caps_duration: 1, spam_duration: 1, boost_channel: 1, boost_message: 1, blocked_channels: 1}).lean()

            if(server.automod && server.automod == "on"){
                if(message.content.includes('discord.gg') && !message.member.permissions.has("ADMINISTRATOR", true)){
                    let args = message.content.trim().split(' ')
                    let invite_code = args.find(el => el.includes("discord.gg/")).replace(`https://discord.gg/`, '').replace(`discord.gg/`, '')
                    let test = await message.guild.invites.fetch({code: invite_code, force: true}).catch(err => {
                        return console.log(`Обнаружена ссылка на другой сервер`)
                    })
                    if(test == undefined){
                        const userData = capsMap.get(message.author.id);  
                        message.delete().catch()
                        message.channel.send(`${message.member} ссылка на сторонний дискорд сервер. Мут 5 минут`)
                        let check = await Mute.findOne({guildID: message.guild.id, userID: message.member.id, channelID: message.channel.id, expired: false})
                        if(!check && !userData){
                            capsMap.set(message.author.id, {
                                disabled: true
                            });

                            message.channel.permissionOverwrites.edit(message.member.id, {
                                SEND_MESSAGES: false
                            }).catch(console.error);

                            let duration = 1000 * 60 * 5
                
                            var muteID
                            let mute = await Mute.findOne().sort({"_id":-1}).limit(1)
                            if(!mute) muteID = 0
                            if(mute) muteID = parseInt(mute.ID) + 1
                            let newMute = new Mute({
                                _id: mongoose.Types.ObjectId(),
                                ID: muteID,
                                guildID: message.guild.id,
                                userID: message.member.id,
                                channelID: message.channel.id,
                                muted_by: 'Авто-модерация',
                                unmuted_by: 'none',
                                date: Date.now(),
                                unmuted_date: 0,
                                duration: duration,
                                reason: 'Ссылка на сторонний дискорд сервер',
                                unmuted_reason: 'none',
                                expired: false,
                                delete: message.channel.permissionOverwrites.cache.filter(m => m.id == message.member.id).size == 0 ? true : false
                            })
                            newMute.save()
        
                            setTimeout(() => {
                                capsMap.delete(message.author.id);
                            }, 5000)
                        }
                    }
                }
        
                if(message.content.match(/[A-ZА-Я]/g) && message.content.match(/[A-ZА-Я]/g).length >= 70 && (!message.content.toLowerCase().includes('https://') && !message.content.toLowerCase().includes('www.')) && !message.member.permissions.has("ADMINISTRATOR", true)){
                    if(!server.blocked_channels.includes(message.channel.id)){
                        const userData = capsMap.get(message.author.id);    
                        let check = await Mute.findOne({guildID: message.guild.id, userID: message.member.id, channelID: message.channel.id, expired: false})
                        if(!check && !userData){
                            capsMap.set(message.author.id, {
                                disabled: true
                            });

                            let msg = server.caps_msg ? server.caps_msg.replace(/{user}/g, message.member) : `${message.member} спам капсом. Мут 5 минут`
                            message.channel.send(msg)

                            message.channel.permissionOverwrites.edit(message.member.id, {
                                SEND_MESSAGES: false
                            }).catch(console.error);
    
                            let duration = server.caps_duration ? server.caps_duration : 1000 * 60 * 5
                
                            var muteID
                            let mute = await Mute.findOne().sort({"_id":-1}).limit(1)
                            if(!mute) muteID = 0
                            if(mute) muteID = parseInt(mute.ID) + 1
                            let newMute = new Mute({
                                _id: mongoose.Types.ObjectId(),
                                ID: muteID,
                                guildID: message.guild.id,
                                userID: message.member.id,
                                channelID: message.channel.id,
                                muted_by: 'Авто-модерация',
                                unmuted_by: 'none',
                                date: Date.now(),
                                unmuted_date: 0,
                                duration: duration,
                                reason: 'Спам капсом',
                                unmuted_reason: 'none',
                                expired: false,
                                delete: message.channel.permissionOverwrites.cache.filter(m => m.id == message.member.id).size == 0 ? true : false
                            })
                            newMute.save()
        
                            setTimeout(() => {
                                capsMap.delete(message.author.id);
                            }, 5000)
                        }
                    }
                }
        
                if(usersMap.has(message.author.id)) {
    
                    const userData = usersMap.get(message.author.id);
                    console.log(userData)
                    const { lastMessage, timer } = userData;
                    const difference = message.createdTimestamp - lastMessage.createdTimestamp;
                    let msgCount = userData.msgCount;
            
                    if(difference > DIFF) {
                        clearTimeout(timer);
                        userData.msgCount = 1;
                        userData.lastMessage = message;
                        userData.timer = setTimeout(() => {
                            usersMap.delete(message.author.id);
                        }, DIFF);
                        usersMap.set(message.author.id, userData)
                    } else {
                        if(userData.lastMessage.content == message.content && !message.member.permissions.has("ADMINISTRATOR", true)){
                            if(!(server.blocked_channels).includes(message.channel.id)){
                                msgCount += 1;
                                if(parseInt(msgCount) == 5 && userData.disabled == false){
                                    userData.disabled = true
                                    let check = await Mute.findOne({guildID: message.guild.id, userID: message.member.id, channelID: message.channel.id, expired: false})
                                    if(!check){
                                        let msg = server.spam_msg ? server.spam_msg.replace(/{user}/g, message.member) : `${message.member} спам одинаковыми сообщениями. Мут 5 минут`
                                        message.delete().catch()
                                        message.channel.send(msg)

                                        message.channel.permissionOverwrites.edit(message.member.id, {
                                            SEND_MESSAGES: false
                                        }).catch(console.error);
                                        
                                        //message.channel.bulkDelete(LIMIT);
                                        var muteID
                                        let mute = await Mute.findOne({},{ID: 1}).sort({"_id":-1}).limit(1)
                                        if(!mute) muteID = 0
                                        if(mute) muteID = parseInt(mute.ID) + 1
                                        let newMute = new Mute({
                                            _id: mongoose.Types.ObjectId(),
                                            ID: muteID,
                                            guildID: message.guild.id,
                                            userID: message.member.id,
                                            channelID: message.channel.id,
                                            muted_by: 'Авто-модерация',
                                            unmuted_by: 'none',
                                            date: Date.now(),
                                            unmuted_date: 0,
                                            duration: 1000 * 60 * 5,
                                            reason: 'Спам одинаковыми сообщениями',
                                            unmuted_reason: 'none',
                                            expired: false,
                                            delete: message.channel.permissionOverwrites.cache.filter(m => m.id == message.member.id).size == 0 ? true : false
                                        })
                                        newMute.save()
                        
        
                                        setTimeout(() => {
                                            usersMap.delete(message.author.id);
                                        }, 5000);
                                    }
                                } else {
                                    userData.msgCount = msgCount;
                                    usersMap.set(message.author.id, userData);
                                }
                            }
                        } else {
                            userData.msgCount = 1
                        }
                    }
                } else {
                    let fn = setTimeout(() => {
                        usersMap.delete(message.author.id);
                    }, DIFF);
                    usersMap.set(message.author.id, {
                        msgCount: 1,
                        lastMessage : message,
                        timer: fn,
                        disabled: false
                    });
                }
            }
    
            if(message.type == "USER_PREMIUM_GUILD_SUBSCRIPTION"){
                let boost_chan = message.guild.channels.cache.get(server.boost_channel)
                if(boost_chan){
                    let memID = message.author.id
                    let msg = server.boost_message
                    if(!memID) return console.log(`Упоминаемый человeк не был найден`)
                    await boost_chan.send({content: msg.replace(/{user}/g, `<@${memID}>`)})
                }
            }
    
            MongoFunc.createUser(message.author.id, message.guild.id)
    
            const Util = require('../functions/Util')
            const checkmark = Util.findEmoji('text_yes')
            const cross = Util.findEmoji('text_no')
    
            if(message.channel.id == "926066141011525672" || message.channel.id == "926066164008894505" || message.channel.id == "802685061274402866" || message.channel.id == "812070015133810718"){
                if(message.channel.id == "802685061274402866"){
                    message.react(checkmark)
                    message.react(cross)
                    message.channel.threads.create({
                        startMessage: message,
                        name: `Комментарии`,
                        type: "ChannelTypeGuildPublicThread",
                        autoArchiveDuration: 4320,
                        reason: "Создание ветки для обсуждения предложения"
                    })
                } else {
                    let helperRole = message.guild.roles.cache.find(r => r.name == "Helper") || message.guild.roles.cache.find(r => r.name == "Хелпер")
                    if(!message.member.permissions.has("MANAGE_ROLES", true) && !message.member.roles.cache.has(helperRole) && !message.member.user.bot){
                        message.react(checkmark)
                        message.react(cross)
                        message.channel.threads.create({
                            startMessage: message,
                            name: `Комментарии`,
                            type: "ChannelTypeGuildPublicThread",
                            autoArchiveDuration: 4320,
                            reason: "Создание ветки для обсуждения жалобы"
                        })
                    }
                }
            }

            if(message.channel.id == "950047783589646387"){
                message.channel.threads.create({
                    startMessage: message,
                    name: `Комментарии`,
                    type: "ChannelTypeGuildPublicThread",
                    autoArchiveDuration: 4320,
                    reason: "Создание ветки для обсуждения поста"
                })
            }

            if(message.channel.id == "905843600720543795"){
                message.react('❤️')
            }
        
            setTimeout(async () => {
                try{
    
                    let dbUser = await User.findOne({userID: message.author.id, guildID: message.guild.id})
            
                    if(dbUser == null) return
                    dbUser.total_messages += 1
                    dbUser.total_currency = parseInt(dbUser.bank) + parseInt(dbUser.currency)
                    let rand = Math.floor(15 + Math.random() * 10)
            
                    if(dbUser.xp_cd !== null && 60000 - (Date.now() - dbUser.xp_cd) < 0){
    
                        //if(dbUser.xp_cd !== null && 300000 - (Date.now() - dbUser.coin_cd) < 0){
                            //let randcoins = Math.floor(2 + Math.random() * 18)
                            //dbUser.coin_cd = Date.now()
                            //dbUser.currency = parseInt(dbUser.currency) + randcoins
                            //dbUser.total_currency = parseInt(dbUser.currency) + parseInt(dbUser.bank)
                        //}
            
                        dbUser.txp += rand
                        dbUser.xp += rand
                        dbUser.total_xp += rand
                        dbUser.week_xp += rand
                        dbUser.xp_cd = Date.now()
                        if(dbUser.xp >= (5 * dbUser.level**2 + 50 * dbUser.level + 100)){
                            dbUser.xp = dbUser.xp - (5 * dbUser.level**2 + 50 * dbUser.level + 100)
                            dbUser.level += 1
                        }
                        if(dbUser.txp >= (5 * dbUser.total_level**2 + 50 * dbUser.total_level + 100)){
                            dbUser.txp = dbUser.txp - (5 * dbUser.total_level**2 + 50 * dbUser.total_level + 100)
                            dbUser.total_level += 1
                        }
                    }
                    await dbUser.save()
                    .catch(err => {console.log(`Произошла ошибка при выдачи опыта`)})
    
                }catch(err){
                    console.error(chalk.redBright(err.stack))
                    console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
                }
            }, 300)

    }catch(err){
        console.error(chalk.redBright(err.stack))
        console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
    }
});