const bot = require('..')
const Discord = require('discord.js')
const sheduledModels = require('../models/sheduledModels')
const Warnings = require('../models/warnings')
const Mute = require('../models/mute')
const Bans = require('../models/ban')
const Temprole = require('../models/temprole')
const Giveaway = require('../models/giveaway')
const User = require('../models/user')
const Guild = require('../models/guild')
const allowedChannels = require('../models/allowedChannels')
const MongoFunc = require('../functions/MongoFunc')
const Economy = require('../models/economy')
const mongoose = require('mongoose')
const bmg = require('../utils/mongoose')
const chalk = require('chalk')
const schedule = require('node-schedule')
const Util = require('../functions/Util')
const Colours = require('../functions/Colours')

bot.on('ready', () => {

    try{

        bmg.init()

        const TimeAgo = require('javascript-time-ago')
        const ru = require('javascript-time-ago/locale/ru.json')
        TimeAgo.addDefaultLocale(ru)

        const link = bot.generateInvite({
            permissions: "ADMINISTRATOR",
            scopes: ['bot', 'applications.commands']
        })
        console.log(link)

        bot.guilds.cache.forEach(async (guild) =>{
            if(guild.id != "914124553960194059" && guild.id != "705508214019588116") return

            let promise = await Promise.all(
                [
                    await Guild.findOne({guildID: guild.id}),
                    await allowedChannels.findOne().lean(),
                    await Warnings.findOne().sort({"_id":-1}).limit(1).lean()
                ]
            )

            let server = promise[0]
            let allowedCh = promise[1]
            let lastWarnID = promise[2]
            await bot.server.set(guild.id, {
                prefix: server.prefix,
                actions_channels: allowedCh.actions,
                leveling_channels: allowedCh.leveling,
                moderation_channels: allowedCh.moderation,
                warnID: lastWarnID.ID,
                roles: server.roles || [],
                event_channels: server.event_channels || []
            })

            let negative_roles = server.negative_roles
            await negative_roles.forEach(role => {
                let findRole = bot.guilds.cache.get(guild.id).roles.cache.get(role)
                //console.log(role)
                if(!findRole){
                    let index = negative_roles.indexOf(role)
                    negative_roles.splice(index, 1)
                }
            })
            server.negative_roles = negative_roles
            server.save()
            bot.negative_roles.set(guild.id, server.negative_roles)

            console.log('???????????????? ????????????????????????????????')

            // Voice activity
            guild.channels.cache.forEach(async (ch) => {
                if(ch.type == "GUILD_VOICE"){
                    ch.members.forEach(mem => {
                        if(mem.user.bot) return
    
                        setTimeout(() => {
                            User.findOne({userID: mem.id, guildID: mem.guild.id}, async (err, dbUser) => {
                                let TrueFalse = false
                                if(!Util.checkPerm(mem, "MOVE_MEMBERS")) TrueFalse = true
                                if(!dbUser){
                                    let newUser = new User({
                                        _id: mongoose.Types.ObjectId(),
                                        guildID: mem.guild.id,
                                        userID: mem.id,
                                        name: "???? ??????????????",
                                        age: "???? ??????????????",
                                        total_level: 0,
                                        level: 0,
                                        total_xp: 0,
                                        week_xp: 0,
                                        txp: 0,
                                        xp: 0,
                                        xp_cd: 0,
                                        xp_block: TrueFalse,
                                        currency: 0,
                                        bank: 0,
                                        total_currency: 0,
                                        coin_cd: 0,
                                        rob_cd: 0,
                                        crime_cd: 0,
                                        daily_cd: 0,
                                        voice_active: false,
                                        total_voice_time: 0,
                                        voice_time: 0,
                                        total_messages: 0,
                                        warnings: 0,
                                    })
                                    await newUser.save()
                                    .catch(err => {console.log(err)})
                                }
                            })
                    
                            setTimeout(async() => {
                                await User.findOne({guildID: mem.guild.id, userID: mem.id}).then(user => {
                                    if(user == null) return
                                    user.voice_active = true
                                    user.save().catch(err => console.error(err))
                                })
                            }, 2000)
                        }, 5000)
                    })
                }
            })
        })
    
        ///////////////////////////////////////////////////////
        setInterval(async () => {
            try{

            // ???????????????? ?????????????????? ????????????
            await Warnings.find({expired: false}).then(warn => {
                warn.forEach(async element => {
                    if((Date.now() - element.date) > element.duration){
                        let server = bot.guilds.cache.get(element.guildID)
                        if(!server) return
                        let WarnedRole = server.roles.cache.find(r => r.name == "warned")
                        let findMem = server.members.cache.find(m => m.id == element.userID)
                        if(element.expired == false){ if(findMem) findMem.roles.remove(WarnedRole.id)}
                        element.expired = true
                        element.save()
                    }
                })
            })

            // ???????????????? ?????????????????? ??????????
            await Mute.find({expired: false}).then(mute => {
                mute.forEach(async element => {
                    if((Date.now() - element.date) > element.duration){
                        let server = bot.guilds.cache.get(element.guildID)
                        if(!server) return
                        let findMem = server.members.cache.find(m => m.id == element.userID)
                        if(element.expired == false){
                            let muteChannel = server.channels.cache.get(`${element.channelID}`)
                            if(findMem && muteChannel){
                                if(element.delete == true){
                                    muteChannel.permissionOverwrites.delete(findMem.id)
                                } else {
                                    muteChannel.permissionOverwrites.edit(findMem.id, {
                                        SEND_MESSAGES: null
                                    }).catch(console.error);
                                }
                            }
                        }
                        element.expired = true
                        await element.save()
                    }
                })
            })

            // ???????????????? ?????????????????? ?????????????????? ????????
            await Temprole.find({expired: false}).then(temprole => {
                temprole.forEach(async element => {
                    if((Date.now() - element.date) > element.duration){
                        let server = bot.guilds.cache.get(element.guildID)
                        let findMem = server.members.cache.find(m => m.id == element.userID)
                        let findRole = server.roles.cache.find(r => r.id == element.roleID)
                        if(findMem && findRole) findMem.roles.remove(findRole).catch()
                        element.expired = true
                        element.save()
                    }
                })
            })

            // ?????????????????? ?? ?????????????????? ????????????
            await sheduledModels.find({}).then(event => {
                event.forEach(async element => {
                    if(Date.now() >= element.startDate){
                        let server = bot.guilds.cache.get(element.guildID)
                        let checkEvent = server.scheduledEvents.cache.get(element.eventID)
                        if(checkEvent){
                            if(Date.now() >= element.endDate){
                                checkEvent.delete().catch()
                                await sheduledModels.findOneAndDelete({eventID: element.eventID})
                            }
                        } else {
                            return await sheduledModels.findOneAndDelete({eventID: element.eventID})
                        }
                        if(!element.activated){
                            checkEvent.setStatus("ACTIVE")
                            element.activated = true
                            element.save()
                        }
                    }
                })
            })

            // ???????????????? ?????????????????? ??????????????????
            let giveawayCheck = await Giveaway.find({hasEnded: false}).then(giveaway => {
                giveaway.forEach(async element => { 
                    if(Date.now() - element.endDate > 0){
                        let server = bot.guilds.cache.get(element.guildID)
                        if(!server) return console.log('Giveaway server doesnt found')
                        let chan = server.channels.cache.find(ch => ch.id === element.channelID)
                        if(!chan) return console.log('Giveaway channel doesnt found')
                        if(!chan.messages.fetch(element.msgID)) return console.log('Giveaway message doesnt found')
                        chan.messages.fetch(element.msgID).then(async (message) => {
                            const { users } = await message.reactions.cache.first().fetch()
                            const reactionUser = await users.fetch() 
                            const possibleWinners = reactionUser.filter(user => !user.bot).map(user => user.id)
                            const winner = Util.getWinner(possibleWinners, element.winners)
                            let finalWinners;
                            if (!winner) {
                                finalWinners = '?????????? ???? ????????????????????????';
                            }
                            else {
                                finalWinners = winner.map(user => `<@${user}>`).join(', ');
                            }
                            element.hasEnded = true
                            element.save()
                            if (!winner) {
                                return message.channel.send(`?????????? ???? ???????????????????? ?? ?????????????????? **${element.prize}**. **ID**: \`${message.id}\`\n${message.url}`);
                            } else {
                                // const embed1 = new Discord.MessageEmbed()
                                // .setTitle(`???????????????? ?????? ??????????????`)
                                // .setColor(Colours.botColorMessage(message))
                                // .setDescription(`**????????????????????:** ${finalWinners}\n**ID:** [${message.id}](${message.url})`)
                                // .setTimestamp()
                                //message.channel.send({embeds: [embed1]});
                                
                                i = 0
                                const embed2 = new Discord.MessageEmbed()
                                .setTitle(`???? ???????????????? ?? ?????????????????? Ponime`)
                                .setColor(Colours.botColorMessage(message))
                                .setDescription(`[???????????? ???? ????????????????](${message.url})`)
                                winner.forEach(async (win) => {
                                    let mem = server.members.cache.find(m => m.id === win)
                                    if(mem) mem.send({embeds: [embed2]}).catch()
                                })
                                i++
                            }

                            i = 0
                            let embedWinners = []
                            winner.forEach(async (win) => {
                                embedWinners.push(`${i + 1} ?????????? - ${element.places[i]} (<@${win}>)`)
                                i++
                            })
                            element.winnersArr = winner
                            let embed = new Discord.MessageEmbed()
                            .setTitle(element.prize)
                            .setColor(Colours.botColorMessage(message))
                            .setDescription(`${element.uslovie ? `??????????????: ${element.uslovie}\n\n` : ""}${embedWinners.join('\n')}`)
                            .setFooter({text: `??????????????`})
                            message.edit({embeds: [embed]})
                        })
                    }
                })
            })

            await Bans.find({duration: {$gt: 0}, expired: false}).then(async(ban) => {
                ban.forEach(async (element) => {
                    if((Date.now() - element.date) > element.duration){
                        let server = bot.guilds.cache.get(element.guildID)
                        if(!server) return
                        let fetchBans = await server.bans.fetch()
                        let getBan = fetchBans.get(element.userID)
                        if(!getBan){
                            element.expired = true
                            element.save().catch()
                        } else {
                            server.bans.remove(element.userID).catch(err => {console.error(err)})
                            element.expired = true
                            element.save().catch()
                        }
                    }
                });
            })

            }catch(err){
                console.error(chalk.redBright(err.stack))
                console.error(chalk.yellowBright('?????????????????? ???????????? ?????????? ????????????...'))
            }
        }, 5000)

        ///////////////////////////////////////////////////////
        schedule.scheduleJob('00 21 * * 7', function(){
            console.log('Test')
            bot.guilds.cache.forEach(async(gld) => {
                if(gld.id != "914124553960194059" && gld.id != "705508214019588116") return
                let premka = await User.find({
                    guildID: gld.id,
                    week_xp: {$gt: 0},
                    xp_block: false
                  }, {userID: 1}).sort([
                    ['week_xp', 'descending']
                  ]).limit(10)
                      for(let i = 0; i < premka.length; i++){
                        let mem = bot.guilds.cache.get(gld.id).members.cache.find(m => m.id == premka[i].userID)
                        if(mem && Util.checkPerm(mem, "MANAGE_ROLES")){
                            let premRole = mem.guild.roles.cache.find(r => r.name == "Premium")
                            if(premRole){
                                mem.roles.add(premRole).catch(err => { return console.log(`???????????????????????? ????????, ?????????? ???????????? ????????`)})
                                let newTempRole = new Temprole({
                                    _id: mongoose.Types.ObjectId(),
                                    guildID: gld.id,
                                    userID: mem.id,
                                    gived_by: bot.user.id,
                                    roleID: premRole.id,
                                    date: Date.now(),
                                    duration: 1000 * 60 * 60 * 24 * 7,
                                    expired: false
                                })
                    
                                newTempRole.save()
                                break
                            } else {
                                console.log(`???? ???????? ?????????????? ?????? ????????`)
                            }
                        }
                      }
            })

            // User.updateMany({week_xp: {$gt: 0}}, {$set: {"week_xp": 0, "level": 1, "voice_time": 0, "xp": 0}}) // Test

            User.find({week_xp: {$gt: 0}}, {level: 1, week_xp: 1, xp: 1, voice_time: 1}).then(async (dbUser) => {
                dbUser.forEach(async (user) => {
                    user.level = 1
                    user.week_xp = 0
                    user.xp = 0
                    user.voice_time = 0
                    user.save().catch(console.error)
                })
            })

            console.log(`?????????? ?????? ?????????????? ????????????????`)
          });


        // Voice_Time
        setInterval(async () => {
            try{
                User.find({ voice_active: true }).then(userdb => {
                    userdb.forEach(async (user) => {
                        if(user.guildID != "914124553960194059" && user.guildID != "705508214019588116") return
                        if(bot.guilds.cache.get(user.guildID).members.cache.get(user.userID) == undefined) return
                        if(!bot.guilds.cache.get(user.guildID).members.cache.get(user.userID).voice.channelId){
                            user.voice_active = false
                            user.save().catch(err => console.error(err))
                        } else {
                            if(!bot.guilds.cache.get(user.guildID)) return console.log(`??????-???? ?????????????? ??????`)
                            if(!bot.guilds.cache.get(user.guildID).members.cache.get(user.userID)) return console.log(`??????-???? ???????????????? ??????`)
                            if(bot.guilds.cache.get(user.guildID).members.cache.get(user.userID).voice.selfDeaf || bot.guilds.cache.get(user.guildID).members.cache.get(user.userID).voice.selfMute || bot.guilds.cache.get(user.guildID).members.cache.get(user.userID).voice.serverDeaf || bot.guilds.cache.get(user.guildID).members.cache.get(user.userID).voice.serverMute) return
                            let count = bot.guilds.cache.get(user.guildID).members.cache.get(user.userID).voice.channel.members.filter(m => !m.voice.serverDeaf && !m.voice.selfMute && !m.voice.selfDeaf && !m.voice.serverMute && !m.user.bot).size
                            if(count < 2) return
                            user.voice_time += 1000
                            user.total_voice_time += 1000
                                if(user.voice_time % 60000 == 0){
                                    let rand = 6 * count
        
                                    user.txp += rand
                                    user.xp += rand
                                    user.total_xp += rand
                                    user.week_xp += rand
                                    if(user.xp >= (5 * user.level**2 + 50 * user.level + 100)){
                                        user.xp = user.xp - (5 * user.level**2 + 50 * user.level + 100)
                                        user.level += 1
                                    }
                                    if(user.txp >= (5 * user.total_level**2 + 50 * user.total_level + 100)){
                                        user.txp = user.txp - (5 * user.total_level**2 + 50 * user.total_level + 100)
                                        user.total_level += 1
                                    }
                                }
        
                                //if(user.voice_time % 300000 == 0){
                                    //let randcoins = Math.floor(2 + Math.random() * 18)
                                    //user.currency += randcoins
                                    //user.total_currency = user.currency + user.bank
                                //}
                            user.save().catch(err => console.error(err))
                        }
                    })
                })

            }catch(err){
                console.error(chalk.redBright(err.stack))
                console.error(chalk.yellowBright('?????????????????? ???????????? ?????????? ????????????...'))
            }
        }, 1000)

    }catch(err){
        console.error(chalk.redBright(err.stack))
        console.error(chalk.yellowBright('?????????????????? ???????????? ?????????? ????????????...'))
    }
})
