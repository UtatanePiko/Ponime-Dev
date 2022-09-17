const chalk = require('chalk')

module.exports = {
    name: "cacheupdate",
    description: "Описание команд",
    aliases: ["cu"],
    run: async (bot, message, args) => {

        try{

            const Guild = require('../../models/guild')
            const mongoose = require('mongoose')
            const RoleCache = require('../../models/roleCache')
            const Util  = require('../../functions/Util') 
    
            if(Util.checkPerm(message.member, "ADMINISTRATOR")) return noPerms(message)

            bot.guilds.cache.forEach(async(guild) => {
                await guild.members.cache.forEach(async(mem) => {
                    let GivingRole
                    let ManRole = mem.guild.roles.cache.find(r => r.name == "Мэнчики")
                    let LadyRole = mem.guild.roles.cache.find(r => r.name == "Леди") || mem.guild.roles.cache.find(r => r.name == "ЛЕДИ")
                    if(ManRole && mem.roles.cache.has(ManRole.id)) GivingRole = ManRole
                    if(LadyRole && mem.roles.cache.has(LadyRole.id)) GivingRole = LadyRole
                    if(!GivingRole) return

                    let role_cache = await RoleCache.findOne({ userID: mem.id, guildID: mem.guild.id})
                    if(!role_cache){
                        let newRoleCache = new RoleCache({
                            _id: mongoose.Types.ObjectId(),
                            guildID: mem.guild.id,
                            userID: mem.id,
                            role: GivingRole.id
                        })
                        newRoleCache.save()
                        .then(console.log(`Пользователю ${chalk.yellowBright(mem.user.username)} на сервере ${chalk.yellowBright(mem.guild.name)} была добавлена роль ${chalk.yellowBright(GivingRole.name)} в кэш ролей`))
                        .catch()
                    } else {    
                        if(role_cache.role == GivingRole.id) return
                        role_cache.role = GivingRole.id
                        role_cache.save()
                        .then(console.log(`Пользователю ${chalk.yellowBright(mem.user.username)} на сервере ${chalk.yellowBright(mem.guild.name)} была изменена роль в кэше ролей на ${chalk.yellowBright(GivingRole.name)}`))
                        .catch()
                    }
                })
            });
            
        }catch(err){
            console.error(chalk.redBright(err.stack))
            console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
        }
    }
}