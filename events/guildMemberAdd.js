const bot = require("..");
const chalk = require('chalk')
bot.on("guildMemberAdd", async (guildMember) => {

    //const User = require('../models/user')
    const RoleCache = require('../models/roleCache')
    const Guild = require('../models/guild')
    const Warnings = require('../models/warnings')
    
    try{

        let chan = bot.guilds.cache.get("914124553960194059").channels.cache.get("984539556911153233")
        chan.send(`**${guildMember.user.username}#${guildMember.user.discriminator}** присоединился на сервер **${guildMember.guild.name}**`)

        if(guildMember.guild.id != "914124553960194059" && guildMember.guild.id != "705508214019588116") return

        let server = await Guild.findOne({guildID: guildMember.guild.id})
        let warn = await Warnings.findOne({guildID: guildMember.guild.id, userID: guildMember.id, expired: false})
        let role_cache = await RoleCache.findOne({ userID: guildMember.id, guildID: guildMember.guild.id})

        if(warn){
            let warnRole = guildMember.guild.roles.cache.find(r => r.name == "warned")
            if(warnRole) await guildMember.roles.add(warnRole.id)
        }
        if(role_cache){
            let role = guildMember.guild.roles.cache.find(r => r.id === role_cache.role)
            //if(!guildMember.roles.cache.has("803108244989411348") && !guildMember.roles.cache.has("802594446184022067")) return
            if(role) await guildMember.roles.add(role.id)
        } else {
            let rolearr = await server.autorole
            await rolearr.forEach(async role => {
                let rolex = guildMember.guild.roles.cache.get(role)
                if(rolex){
                    //if(guildMember.roles.cache.has("803108244989411348") || guildMember.roles.cache.has("802594446184022067")) return
                    let mem = await guildMember.fetch()
                    if(mem) mem.roles.add(rolex)
                } else {
                    await server.autorole.pull(role)
                    await server.save()
                }
            })
        }

        let ManRole = guildMember.guild.roles.cache.find(r => r.name == "Мэнчики")
        let LadyRole = guildMember.guild.roles.cache.find(r => r.name == "Леди") || guildMember.guild.roles.cache.find(r => r.name == "ЛЕДИ")
        if(!guildMember.roles.cache.has(ManRole.id) && !guildMember.roles.cache.has(LadyRole.id)) await guildMember.roles.add(ManRole)


    }catch(err){
        console.error(chalk.redBright(err.stack))
        console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
    }

});