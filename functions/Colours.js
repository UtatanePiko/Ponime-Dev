const bot = require('..')

module.exports = {
    
    noColor(){
        return "#2F3136"
    },

    botColorMessage(from){
        if(!from) return console.log(`botColorMessage problem! from не указан`)
        return (from.guild.members.cache.get(`${bot.user.id}`).displayHexColor === "#000000" ? "#ffffff" : from.guild.members.cache.get(`${bot.user.id}`).displayHexColor)
    },

    successColor(){
        return "#00ae5d"
    },

    failColor(){
        return "#922a37"
    }

}