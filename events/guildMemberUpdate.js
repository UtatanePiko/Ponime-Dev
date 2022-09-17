const bot = require("..");
const chalk = require('chalk')
const Util = require('../functions/Util')
bot.on("guildMemberUpdate", async (oldMember, newMember) => {

    const User = require('../models/user')
    const RoleCache = require('../models/roleCache')
    const mongoose = require('mongoose')
    const Guild = require('../models/guild')
    const server = await Guild.findOne({ guildID: newMember.guild.id })

    try{
        if(newMember.guild.id != "914124553960194059" && newMember.guild.id != "705508214019588116") return
        if(newMember.user.bot) return

        //let role = newMember.guild.roles.cache.find(r => r.id == "802518371517726730" || r.id == "914841996823261194")
        let dbUser = await User.findOne({ userID: newMember.id, guildID: newMember.guild.id })

        // if(dbUser){
        //     if(oldMember.roles.cache.has(role.id) && !newMember.roles.cache.has(role.id)){
        //         dbUser.inst = ""
        //         await dbUser.save().catch()
        //     }
        // }

        if(!Util.checkPerm(newMember, "MOVE_MEMBERS")){
            if(dbUser){
                dbUser.xp_block = true
                await dbUser.save()
            }
        } else {
            if(dbUser){
                dbUser.xp_block = false
                await dbUser.save()
            }
        }

        // if (!oldMember.premiumSince && newMember.premiumSince) {
        //     let boost_ch = newMember.guild.channels.cache.find(ch => ch.id === server.boost_channel)
        //     if(!boost_ch) return
        //     if(!server.boost_message || server.boost_message == "none") return
        //     let msg = server.boost_message
        //     await boost_ch.send({content: msg.replace(/{user}/g, `<@${newMember.id}>`)})
        //   }

        // const hadRole = oldMember.roles.cache.find(role => role.name == 'Server Booster');
        // const hasRole = newMember.roles.cache.find(role => role.name == 'Server Booster');
      
        // if(!hadRole && hasRole){
        //     let boost_ch = newMember.guild.channels.cache.find(ch => ch.id === server.boost_channel)
        //     if(!boost_ch) return
        //     if(!server.boost_message || server.boost_message == "none") return
        //     let msg = server.boost_message
        //     boost_ch.send({content: msg.replace(/{user}/g, `<@${newMember.id}>`)})
        // }

        let role_cache = await RoleCache.findOne({ userID: newMember.id, guildID: newMember.guild.id})
        let GivingRole
        let ManRole = newMember.guild.roles.cache.find(r => r.name == "Мэнчики")
        let LadyRole = newMember.guild.roles.cache.find(r => r.name == "Леди") || newMember.guild.roles.cache.find(r => r.name == "ЛЕДИ")
        if(newMember.roles.cache.has(ManRole.id)) GivingRole = ManRole.id
        if(newMember.roles.cache.has(LadyRole.id)) GivingRole = LadyRole.id
        if(!GivingRole) return

        if(!role_cache){
            let newRoleCache = new RoleCache({
                _id: mongoose.Types.ObjectId(),
                guildID: newMember.guild.id,
                userID: newMember.id,
                role: GivingRole,
                username: newMember.user.username
            })
            newRoleCache.save()
            .catch(err => {console.log(err)})
        } else {
            role_cache.role = GivingRole
            role_cache.save().catch
        }

    }catch(err){
        console.error(chalk.redBright(err.stack))
        console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
    }

});