const bot = require("..");
const chalk = require('chalk');
bot.on("guildMemberRemove", async (guildMember) => {

    const RoleCache = require('../models/roleCache')
    const Warnings = require('../models/warnings')
    const Mutes = require('../models/mute')
    const Bans = require('../models/ban')
    const mongoose = require('mongoose')
    
    try{

        if(guildMember.guild.id != "914124553960194059" && guildMember.guild.id != "705508214019588116") return

        let dbUser = await RoleCache.findOne({guildID: guildMember.guild.id, userID: guildMember.user.id})
        if(dbUser){
            dbUser.username = guildMember.user.username
            dbUser.save().catch()
        }
        //let warns = await Warnings.findOne({guildID: guildMember.guild.id, userID: guildMember.user.id})
        //let mutes = await Mutes.findOne({guildID: guildMember.guild.id, userID: guildMember.user.id})
        //let bans = await Bans.findOne({guildID: guildMember.guild.id, userID: guildMember.user.id})
        //if(!warns && !mutes && !bans) return
        if(!dbUser){
            let newUser = await new RoleCache({
                _id: mongoose.Types.ObjectId(),
                guildID: guildMember.guild.id,
                userID: guildMember.user.id,
                username: guildMember.user.username,
            })
            await newUser.save()
        }

    }catch(err){
        console.error(chalk.redBright(err.stack))
        console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
    }

});