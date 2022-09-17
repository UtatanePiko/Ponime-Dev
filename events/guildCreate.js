const bot = require("..");
const chalk = require('chalk')
bot.on("guildCreate", async (guild) => {

    const Ban = require('../models/ban')
    const Guild = require('../models/guild')
    const Economy = require('../models/economy')
    const RoleCache = require('../models/roleCache')
    const mongoose = require('mongoose')
    
    try{

        if(guild.id != "914124553960194059" && guild.id != "705508214019588116") return

        Guild.findOne({
            guildID: guild.id
        }, async (err, server) => {
            if(err) console.error(err)

            if(!server){
                let newGuild = new Guild({
                    _id: mongoose.Types.ObjectId(),
                    guildID: guild.id,
                    prefix: "p!",
                    boost_message: 'none',
                    boost_channel: guild.systemChannel,
                    autorole: Array,
                    shop: Array
                })
                newGuild.save()
                .catch(err => { console.log(`Произошла ошибка при добавлении сервера: ${guild.name} в базу данных`) })
                .then(console.log(`Сервер ${guild.name} был добавлен в базу данных`))
            }
        })

        Economy.findOne({
            guildID: guild.id
        }, async (err, economy) => {
            if(err) console.error(err)

            if(!economy){
                let newEconomy = new Economy({
                    _id: mongoose.Types.ObjectId(),
                    guildID: guild.id,
                    daily_text: Array,
                    crime_suc: Array,
                    crime_fail: Array,
                    rob_suc: Array,
                    rob_fail: Array
                })
                newEconomy.save()
                .catch(err => { console.log(`Произошла ошибка при добавлении экономики на сервер: ${guild.name} в базу данных`) })
                .then(console.log(`Экономика на сервер ${guild.name} был добавлен в базу данных`))
            }
        })

        guild.bans.fetch().then(async (bans) => {
            bans.forEach(async (ban) => {
                 Ban.findOne({
                     guildID: guild.id,
                     userID: ban.user.id
                 }, async (err, dbBan) => {
                     if(err) console.error(err)
 
                     if(!dbBan){
                         let newBan = new Ban({
                             _id: mongoose.Types.ObjectId(),
                             guildID:guild.id,
                             userID: ban.user.id,
                             reason: ban.reason || "Не указана"
                         })
                         newBan.save()
                         .catch(err => { console.log(`Произошла ошибка при добавлении бана в базу данных`) })
                         .then(console.log(`Бан пользователя ${ban.user.id} был добавлен в базу данных`))
                     }
                 })
            });
        })

        guild.members.cache.forEach(async (mem) => {
            if(mem.user.bot) return
            RoleCache.findOne({
                userID: mem.id,
                guildID: guild.id
            }, (err, role_cache) => {
                if(err) console.error(err)

                let ManRole = guild.roles.cache.find(r => r.name == "Мэнчики")
                let LadyRole = guild.roles.cache.find(r => r.name == "Леди")
                if(!ManRole && !LadyRole) return

                if(!mem.roles.cache.has(ManRole.id) && !mem.roles.cache.has(LadyRole.id)) return
                if(mem.roles.cache.has(ManRole.id)) GivingRole = ManRole.id
                if(mem.roles.cache.has(LadyRole.id)) GivingRole = LadyRole.id

                if(!role_cache){
                    let newRoleCache = new RoleCache({
                        _id: mongoose.Types.ObjectId(),
                        guildID: guild.id,
                        userID: mem.id,
                        role: GivingRole,
                    })
                    newRoleCache.save()
                    .catch(err => {console.log(err)})
                }
            })
        })

        guild.channels.cache.forEach(async (ch) => {
            if(ch.type == "GUILD_VOICE"){
                ch.members.forEach(async (mem) => {
                    if(mem.user.bot) return

                    MongoFunc.createUser(mem.id, mem.guild.id)
            
                    setTimeout(async() => {
                        await User.findOne({guildID: mem.guild.id,userID: mem.id}).then(user => {
                            user.voice_active = true
                            user.save().catch(err => console.error(err))
                        })
                    }, 1000)
                })
            }
        })

    }catch(err){
        console.error(chalk.redBright(err.stack))
        console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
    }

});