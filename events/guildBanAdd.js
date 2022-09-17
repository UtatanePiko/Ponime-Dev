const bot = require("..");
const chalk = require('chalk')
bot.on("guildBanAdd", async (ban) => {

    const Ban = require('../models/ban')
    const mongoose = require('mongoose')
    
    try{

        if(ban.guild.id != "914124553960194059" && ban.guild.id != "705508214019588116") return

        const fetchedLogs = await ban.guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_BAN_ADD',
        });
        const banLog = fetchedLogs.entries.first();
        if (!banLog) return console.log(`${ban.user.tag} was banned from ${ban.guild.name} but no audit log could be found.`);
        const { reason, executor, target } = banLog;
        if(executor.id === bot.user.id) return

        var banID
        let dbBan = await Ban.findOne().sort({"_id":-1}).limit(1)
        if(!dbBan){
            banID = 0
        } else {
            banID = parseInt(dbBan.ID) + 1
        }

        let newBan = await new Ban({
            _id: mongoose.Types.ObjectId(),
            ID: banID,
            guildID: ban.guild.id,
            userID: target.id,
            banned_by: executor.id,
            unbanned_by: null,
            date: Date.now(),
            unbanned_date: null,
            reason: reason,
            unbanned_reason: null,
            expired: false
        })
        await newBan.save()
            


    }catch(err){
        console.error(chalk.redBright(err.stack))
        console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
    }

});