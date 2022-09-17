const chalk = require('chalk')

module.exports = {
    name: "delete",
    description: "Описание команд",
    aliases: ["remove"],
    run: async (bot, message, args) => {

        try{

            const User = require('../../models/user')
            const Guild = require('../../models/guild')
            const Warnings = require('../../models/warnings')
            const Mutes = require('../../models/mute')
            const Bans = require('../../models/ban')
            const Reviews = require('../../models/reviews')
            const MongoFunc = require('../../functions/MongoFunc') 
            const { Embeds, crossText, noPerms, checkmarkText } = require('../../functions/Embed') 
            const { noColor } = require('../../functions/Colours')
            const Util  = require('../../functions/Util') 
            const server = await Guild.findOne({ guildID: message.guild.id })
    
            if(message.author.id != "329462919676821504" && message.author.id != "248453176745787393") return

            if(args[0] == "help" || args[0] == "помощь"){
                const embed = new Embeds({
                    message: message,
                    description: `Удаление значений из базы данных`,
                    embedTitle: "DELETE HELP-MENU [DEV]",
                    embedColor: noColor(),
                    arguments: `● **\`${server.prefix}delete <warn | mute | ban | review> <ID случая>\`**`,
                    alternatives: `● **\`delete\`** | **\`remove\`**`,
                    examples: `● **\`${server.prefix}delete warn 13\`**`,
                    hints: `● Данная команда принадлежит DEV каталогу и может быть вызвана лишь определнными юзерами\n● **\`<>\`** - обязательно для заполнения`
                })
    
                return embed.help()
            }

            if(!args[0]) return crossText(`Не указано никаких аргументов\nИспользуйте **\`${message.content.split(" ")[0].toLowerCase()} help\`**, чтобы узнать возможные аргументы`, message)
            if(args[0] == "warn"){
                if(!args[1]) return crossText(`Не было указано ID\nПример: **\`${message.content.toLowerCase()} 13\`**`, message)
                let dbUser = await Warnings.findOne({ guildID: message.guild.id, ID: args[1]})
                if(!dbUser) return crossText(`Не было найдено предупреждения с ID **${args[1]}**`, message)
                let mem = message.guild.members.cache.find(m => m.id === dbUser.userID)
                let warnedRole = message.guild.roles.cache.find(r => r.name == "warned")
                if(mem) mem.roles.remove(warnedRole.id)
                await Warnings.findOneAndDelete({ guildID: message.guild.id, ID: args[1]})
                dbUser.warnings -= 1
                dbUser.save().catch()
                return checkmarkText(`Успешно было удалено предупреждение с ID **${args[1]}**`, message)
            } else if(args[0] == "mute"){
                if(!args[1]) return crossText(`Не было указано ID\nПример: **\`${message.content.toLowerCase()} 13\`**`, message)
                let dbUser = await Mutes.findOne({ guildID: message.guild.id, ID: args[1]})
                if(!dbUser) return crossText(`Не было найдено мьюта с ID **${args[1]}**`, message)
                let mem = message.guild.members.cache.find(m => m.id === dbUser.userID)
                let muteChannel = message.guild.channels.cache.find(ch => ch.id == dbUser.channelID)
                if(mem && muteChannel && muteChannel.permissionOverwrites.cache.filter(m => m.id == mem.id).size != 0){
                    if(dbUser.delete == true){
                        muteChannel.permissionOverwrites.delete(mem.id)
                    } else {
                        muteChannel.permissionOverwrites.edit(mem.id, {
                            SEND_MESSAGES: null
                        }).catch(console.error);
                    }
                }
                await Mutes.findOneAndDelete({ guildID: message.guild.id, ID: args[1]})
                return checkmarkText(`Успешно был удален мьют с ID **${args[1]}**`, message)
            } else if(args[0] == "ban"){
                if(!args[1]) return crossText(`Не было указано ID\nПример: **\`${message.content.toLowerCase()} 13\`**`, message)
                let dbUser = await Bans.findOne({ guildID: message.guild.id, ID: args[1]})
                if(!dbUser) return crossText(`Не было найдено бана с ID **${args[1]}**`, message)
                let ban = await message.guild.bans.fetch();
                if(ban.get(dbUser.userID)) await message.guild.bans.fetch(dbUser.userID).then(async (ban) => {
                    await message.guild.bans.remove(ban.user.id)
                }).catch()
                await Bans.findOneAndDelete({ guildID: message.guild.id, ID: args[1]})
                return checkmarkText(`Успешно был удален бан с ID **${args[1]}**`, message)
            } else if(args[0] == "review"){
                if(!args[1]) return crossText(`Не было указано ID\nПример: **\`${message.content.toLowerCase()} 13\`**`, message)
                let dbUser = await Reviews.findOne({ guildID: message.guild.id, ID: args[1]})
                if(!dbUser) return crossText(`Не было найдено отзыва с ID **${args[1]}**`, message)
                await Reviews.findOneAndDelete({ guildID: message.guild.id, ID: args[1]})
                return checkmarkText(`Успешно был удален отзыв с ID **${args[1]}**`, message)
            } else {
                return crossText(`Не было найдено аргумента **\`${args[0]}\`**\nИспользуйте **\`${message.content.split(" ")[0].toLowerCase()} help\`**, чтобы узнать возможные аргументы`, message)
            }
            
        }catch(err){
            console.error(chalk.redBright(err.stack))
            console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
        }
    }
}