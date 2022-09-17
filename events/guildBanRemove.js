const bot = require("..");
const chalk = require('chalk')
bot.on("guildBanRemove", async (ban) => {

    const Ban = require('../models/ban')
    const mongoose = require('mongoose')
    
    try{

        if(ban.guild.id != "914124553960194059" && ban.guild.id != "705508214019588116") return

        const fetchedLogs = await ban.guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_BAN_REMOVE',
        });
        const unBanLog = fetchedLogs.entries.first();
        if (!unBanLog) return console.log(`${ban.user.tag} was banned from ${ban.guild.name} but no audit log could be found.`);
        const { executor, target } = unBanLog;
        if(executor.id === bot.user.id) return

        let findBan = await Ban.findOne({guildID: ban.guild.id, userID: target.id}).sort({"_id":-1}).limit(1)
        if(!findBan) return console.log(`Не было найдено бана`)
        findBan.unbanned_by = executor.id
        findBan.unbanned_date = Date.now()
        findBan.expired = true
        await findBan.save().then(console.log(`${executor.id} разбанил ${target.id} на сервере ${ban.guild.name}`)).catch()
            


    }catch(err){
        console.error(chalk.redBright(err.stack))
        console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
    }

});