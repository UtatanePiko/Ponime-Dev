    const chalk = require('chalk')

    module.exports = {
        name: "warns",
        description: "Описание команд",
        aliases: ["преды", "муты", "mutes", "bans", "баны", "мьюты"],
        run: async (bot, message, args) => {

            try{

                const Discord = require('discord.js')
                const Warning = require('../../models/warnings')
                const Ban = require('../../models/ban')
                const Mute = require('../../models/mute')
                const RoleCache = require('../../models/roleCache')
                const MongoFunc = require('../../functions/MongoFunc')
                const Util = require('../../functions/Util')
                const { Embeds, crossText, checkmarkText } = require('../../functions/Embed') 
                const { noColor } = require('../../functions/Colours')
                const Guild = require('../../models/guild')
                const prefix = bot.server.get(message.guild.id).prefix
                const left = Util.findEmoji('leftarrow')
                const right = Util.findEmoji('rightarrow')
                const context = Util.findEmoji('context1')
                const cross = Util.findEmoji('cross4')
                const ms = require('ms')
                if(!(bot.server.get(message.guild.id).leveling_channels).includes(message.channel.id)) return crossText(`Данная команда разрешена лишь в следующих чатах: ${message.guild.channels.cache.find(ch => ch.id == "880530956304392262") || "880530956304392262"} ${message.guild.channels.cache.find(ch => ch.id == "841889007654141982") || "841889007654141982"}`, message)
        
                const defaultEmojis = {
                previous: left,
                next: right,
                context: context
                };

                if(args[0] == "help" || args[0] == "помощь"){
                    const embed = new Embeds({
                        message: message,
                        description: `Позволяет посмотреть все предупреждения и мьюты пользователя`,
                        embedTitle: "WARNS HELP-MENU",
                        embedColor: noColor(),
                        arguments: `● **\`${prefix}warns [@user | userID | user#1234]\`**`,
                        alternatives: `● **\`${prefix}warns\`** | **\`${prefix}преды\`** | **\`${prefix}mutes\`** | **\`${prefix}мьюты\`** | **\`${prefix}bans\`** | **\`${prefix}баны\`**`,
                        examples: `● **\`${prefix}warns\`** или **\`${prefix}warns @user\`**`,
                        hints: `● Альтернативы используются для сокращения написания команды и ничем не отличаются\n● **\`[]\`** - необязательно для заполнения`
                    })
            
                    return embed.help()
                }

                let mentuser = args[0] ? args[0] ? message.guild.members.cache.get(args[0].replace('<@', '').replace('>', '')) : null : null
                if(!args[0]) mentuser = message.member
                if(mentuser) mentuser = mentuser.id
                if(!Warning.findOne({guildID: message.guild.id, userID: mentuser})) return crossText(`Не найден указанный пользователь или этот пользователь не записан в базу данных предупреждений, так как не получал их`, message)
                if(mentuser != message.member) MongoFunc.createUser(mentuser, message.guild.id)

                Date.prototype.customFormat = function(formatString){
                    var YYYY,YY,MMMM,MMM,MM,M,DDDD,DDD,DD,D,hhhh,hhh,hh,h,mm,m,ss,s,ampm,AMPM,dMod,th;
                    YY = ((YYYY=this.getFullYear())+"").slice(-2);
                    MM = (M=this.getMonth()+1)<10?('0'+M):M;
                    MMM = (MMMM=["Января","Февраля","Марта","Апреля","Мая","Июня","Июля","Августа","Сентября","Октября","Ноября","Декабря"][M-1]).substring(0,3);
                    DD = (D=this.getDate())<10?('0'+D):D;
                    DDD = (DDDD=["Воскресенье","Понедельник","Вторник","Среда","Четверг","Пятница","Суббота"][this.getDay()]).substring(0,3);
                    th=(D>=10&&D<=20)?'th':((dMod=D%10)==1)?'st':(dMod==2)?'nd':(dMod==3)?'rd':'th';
                    formatString = formatString.replace("#YYYY#",YYYY).replace("#YY#",YY).replace("#MMMM#",MMMM).replace("#MMM#",MMM).replace("#MM#",MM).replace("#M#",M).replace("#DDDD#",DDDD).replace("#DDD#",DDD).replace("#DD#",DD).replace("#D#",D).replace("#th#",th);
                    h=(hhh=this.getHours());
                    if (h==0) h=24;
                    if (h>12) h-=12;
                    hh = h<10?('0'+h):h;
                    hhhh = hhh<10?('0'+hhh):hhh;
                    AMPM=(ampm=hhh<12?'am':'pm').toUpperCase();
                    mm=(m=this.getMinutes())<10?('0'+m):m;
                    ss=(s=this.getSeconds())<10?('0'+s):s;
                    return formatString.replace("#hhhh#",hhhh).replace("#hhh#",hhh).replace("#hh#",hh).replace("#h#",h).replace("#mm#",mm).replace("#m#",m).replace("#ss#",ss).replace("#s#",s).replace("#ampm#",ampm).replace("#AMPM#",AMPM);
                };

                let displayMem = await message.guild.members.cache.find(m => m.id === mentuser) 
                if(displayMem) displayMem = displayMem.id
                if(!displayMem) displayMem = args[0]
                //let warnsCount = await Warning.find({userID: displayMem, guildID: message.guild.id}).count()
                //let mutesCount = await Mute.find({userID: displayMem, guildID: message.guild.id}).count()
                let warn_res = await Warning.find({userID: displayMem, guildID: message.guild.id}).sort([[parseInt('date'), 'ascending']])
                let mute_res = await Mute.find({userID: displayMem, guildID: message.guild.id}).sort([[parseInt('date'), 'ascending']])
                let ban_res = await Ban.find({userID: displayMem, guildID: message.guild.id}).sort([[parseInt('date'), 'ascending']])
                let leavedUser = await RoleCache.findOne({guildID: message.guild.id, userID: displayMem})
                //if(warn_res.length == 0 && mute_res.length == 0 && ban_res.length == 0 && !message.guild.members.cache.find(m => m.id === displayMem)) return crossText(`Пользователь не был найден или у него отсутсвуют какие-либо нарушения`, message)
                if(!leavedUser && !message.guild.members.cache.find(m => m.id === displayMem)) return crossText(`Пользователь не был найден на сервере и в кэше`, message)

                displayMem = message.guild.members.cache.find(m => m.id === displayMem) ? message.guild.members.cache.find(m => m.id === displayMem).displayName : leavedUser ? leavedUser.username : displayMem

                var pg
                var page
                var lb = 0

                const generateButtons1 = (state) => {
                    const checkState = (name) => {
                        if (["previous"].includes(name) &&
                            pg === 1)
                            return true;
                        if (["next"].includes(name) &&
                            pg >= page)
                            return true;
                        return false;
                    };
                    let names = ["previous", "next", "context"];
                    return names.reduce((accumulator, name) => {
                        accumulator.push(new Discord.MessageButton()
                            .setEmoji(defaultEmojis[name])
                            .setCustomId(name)
                            .setDisabled(state || checkState(name))
                            .setStyle("PRIMARY"));
                        return accumulator;
                    }, []);
                };

                const options2 = {
                    label: "Предупреждения",
                    value: "warns",
                    description: "Список варнов пользователя"
                }

                
                const options3 = {
                    label: "Мьюты",
                    value: "mutes",
                    description: "Список мьютов пользователя"
                }

                const options4 = {
                    label: "Баны",
                    value: "bans",
                    description: "Список банов пользователя"
                }

                const selectMenu = {
                    type: "SELECT_MENU",
                    customId: "select_menu",
                    placeHolder: "Выберите список",
                    options: [options2, options3, options4]
                }

                const action = {
                    type: "ACTION_ROW",
                    components: [selectMenu]
                }

                const components1 = (state) => [
                    new Discord.MessageActionRow().addComponents(generateButtons1(state)),
                ];

                const changeToMain = () => {
                    let embed = new Discord.MessageEmbed()
                    .setTitle(`Нарушения пользователя ${displayMem}`)
                    .setColor(noColor())
                    .setFields(
                        {name: `Количество предов`, value: `${warn_res.length}`, inline: true},
                        {name: `Количество мьютов`, value: `${mute_res.length}`, inline: true},
                        {name: `Количество банов`, value: `${ban_res.length}`, inline: true},
                    )

                    if(!message.guild.members.cache.find(m => m.id === mentuser)) { 
                        embed.setThumbnail("https://i.imgur.com/g88PhpE.png")
                    } else {
                        embed.setThumbnail(message.guild.members.cache.find(m => m.id === mentuser).displayAvatarURL({format: "png", dynamic: true, size: 512}))
                    }
                    
                    return embed
                };

                const changeToMutes = () => {
                    page = Math.ceil(mute_res.length / 5)
                    if(pg != Math.floor(pg)) pg = 1
                    if(!pg) pg = 1
                    var end = pg * 5
                    var start = pg * 5 - 5

                    if(mute_res.length == 0){
                        let embed = new Discord.MessageEmbed()
                        .setTitle(`Список мьютов ${displayMem}`)
                        .setDescription(`У этого пользователя нет мьютов`)
                        .setThumbnail('https://i.imgur.com/0kyE4pk.png')
                        .setColor(noColor())
                        return embed
                    }

                    let embed = new Discord.MessageEmbed()
                    .setTitle(`Список мьютов ${displayMem}`)
                    .setThumbnail('https://i.imgur.com/0kyE4pk.png')
                    .setColor(noColor())
                    .setFooter({text: `Стр. ${pg} из ${page}`})
                    if(mute_res.length <= end){
                        for(i = start; i < mute_res.length; i++){           
                            let warnDate = new Date(mute_res[i].date + 1000 * 60 * 60 * 3).customFormat( "#DD# #MMMM# #YYYY#г., #hhhh#:#mm#" )
                            let warnedBy = message.guild.members.cache.find(mem => mem.id == `${mute_res[i].muted_by}`) ? message.guild.members.cache.find(mem => mem.id == `${mute_res[i].muted_by}`) : mute_res[i].muted_by == 'Авто-модерация' ? 'Авто-модерация' : mute_res[i].muted_by
                            let unwarnDate = new Date(mute_res[i].unmuted_date + 1000 * 60 * 60 * 3).customFormat( "#DD# #MMMM# #YYYY#г., #hhhh#:#mm#" )
                            let expired = `${mute_res[i].expired}`
                            let mute_channel = message.guild.channels.cache.find(ch => ch.id == `${mute_res[i].channelID}`) || "Не найден"
                            if(mute_res[i].unmuted_date == 0){
                                embed.addFields(
                                    {name: `Случай #${mute_res[i].ID}`, value: `**Канал:** **${mute_channel}**\n**Выдано:** **\`${warnDate}\`** ${warnedBy}\nДлительность: **\`${(ms(mute_res[i].duration)).replace(/w/, "нед").replace(/d/, "д").replace(/h/, "ч").replace(/m/, "м").replace(/s/, "с")}\`**\nДействует: \`${expired.replace(/false/g, "Да").replace(/true/g, "Нет")}\`\nПричина: ${mute_res[i].reason}`}
                                )
                            } else {
                                let unmutedBy = message.guild.members.cache.find(mem => mem.id === mute_res[i].unmuted_by)|| mute_res[i].unmuted_by
                                embed.addFields(
                                    {name: `Случай #${mute_res[i].ID} (Снят)`, value: `**Канал:** **${mute_channel}**\n**Выдано:** **\`${warnDate}\`** ${warnedBy}\nДлительность: **\`${(ms(mute_res[i].duration)).replace(/w/, "нед").replace(/d/, "д").replace(/h/, "ч").replace(/m/, "м").replace(/s/, "с")}\`**\nПричина: ${mute_res[i].reason}\n**Снято:** **\`${unwarnDate}\`** ${unmutedBy}\nПричина: ${mute_res[i].unmuted_reason}`}
                                )
                            }
                        }
                    } else {
                        for(i = start; i < end; i++){                                
                            let warnDate = new Date(mute_res[i].date + 1000 * 60 * 60 * 3).customFormat( "#DD# #MMMM# #YYYY#г., #hhhh#:#mm#" )
                            let warnedBy = message.guild.members.cache.find(mem => mem.id == `${mute_res[i].muted_by}`) ? message.guild.members.cache.find(mem => mem.id == `${mute_res[i].muted_by}`) : mute_res[i].muted_by == 'Авто-модерация' ? 'Авто-модерация' : mute_res[i].muted_by
                            let unwarnDate = new Date(mute_res[i].unmuted_date + 1000 * 60 * 60 * 3).customFormat( "#DD# #MMMM# #YYYY#г., #hhhh#:#mm#" )
                            let expired = `${mute_res[i].expired}`
                            let mute_channel = message.guild.channels.cache.find(ch => ch.id == `${mute_res[i].channelID}`) || "Не найден"
                            if(mute_res[i].unmuted_date == 0){
                                embed.addFields(
                                    {name: `Случай #${mute_res[i].ID}`, value: `**Канал:** **${mute_channel}**\n**Выдано:** **\`${warnDate}\`** ${warnedBy}\nДлительность: **\`${(ms(mute_res[i].duration)).replace(/w/, "нед").replace(/d/, "д").replace(/h/, "ч").replace(/m/, "м").replace(/s/, "с")}\`**\nДействует: \`${expired.replace(/false/g, "Да").replace(/true/g, "Нет")}\`\nПричина: ${mute_res[i].reason}`}
                                )
                            } else {
                                let unmutedBy = message.guild.members.cache.find(mem => mem.id === mute_res[i].unmuted_by)|| mute_res[i].unmuted_by
                                embed.addFields(
                                    {name: `Случай #${mute_res[i].ID} (Снят)`, value: `**Канал:** **${mute_channel}**\n**Выдано:** **\`${warnDate}\`** ${warnedBy}\nДлительность: **\`${(ms(mute_res[i].duration)).replace(/w/, "нед").replace(/d/, "д").replace(/h/, "ч").replace(/m/, "м").replace(/s/, "с")}\`**\nПричина: ${mute_res[i].reason}\n**Снято:** **\`${unwarnDate}\`** ${unmutedBy}\nПричина: ${mute_res[i].unmuted_reason}`}
                                )
                            }
                        }
                    }
                    return embed
                };

                const changeToWarns = () => {

                    page = Math.ceil(warn_res.length / 5)
                    if(pg != Math.floor(pg)) pg = 1
                    if(!pg) pg = 1
                    var end = pg * 5
                    var start = pg * 5 - 5

                    if(warn_res.length == 0){
                        let embed = new Discord.MessageEmbed()
                        .setTitle(`Список предов ${displayMem}`)
                        .setDescription(`У этого пользователя нет предупреждений`)
                        .setThumbnail('https://i.imgur.com/KB1yW8x.png')
                        .setColor(noColor())
                        return embed
                    }

                    let embed = new Discord.MessageEmbed()
                    .setTitle(`Список предов ${displayMem}`)
                    .setThumbnail('https://i.imgur.com/KB1yW8x.png')
                    .setColor(noColor())
                    .setFooter({text: `Стр. ${pg} из ${page}`})
                    if(warn_res.length <= end){
                        for(i = start; i < warn_res.length; i++){                                  
                            let warnDate = new Date(warn_res[i].date + 1000 * 60 * 60 * 3).customFormat( "#DD# #MMMM# #YYYY#г., #hhhh#:#mm#" )
                            let unwarnDate = new Date(warn_res[i].unwarned_date + 1000 * 60 * 60 * 3).customFormat( "#DD# #MMMM# #YYYY#г., #hhhh#:#mm#" )
                            let warnedBy = message.guild.members.cache.find(mem => mem.id === warn_res[i].warned_by) || warn_res[i].warned_by
                            let expired = `${warn_res[i].expired}`
                            if(warn_res[i].unwarned_by == 'none'){
                                embed.addFields(
                                    {name: `Случай #${warn_res[i].ID}`, value: `**Выдано:** **\`${warnDate}\`** ${warnedBy}\nДлительность: **\`${warn_res[i].duration / (1000 * 60 * 60)}ч\`**\nДействует: \`${expired.replace(/false/g, "Да").replace(/true/g, "Нет")}\`\nПричина: ${warn_res[i].reason}`}
                                )
                            } else {
                                let unwarnedBy = message.guild.members.cache.find(mem => mem.id === warn_res[i].unwarned_by)|| warn_res[i].unwarned_by
                                embed.addFields(
                                    {name: `Случай #${warn_res[i].ID} (Снят)`, value: `**Выдано:** **\`${warnDate}\`** ${warnedBy}\nДлительность: **\`${warn_res[i].duration / (1000 * 60 * 60)}ч\`**\nПричина: ${warn_res[i].reason}\n**Снято:** **\`${unwarnDate}\`** ${unwarnedBy}\nПричина: ${warn_res[i].unwarned_reason}`}
                                )
                            }
                        }
                    } else {
                        for(i = start; i < end; i++){                                
                            let warnDate = new Date(warn_res[i].date + 1000 * 60 * 60 * 3).customFormat( "#DD# #MMMM# #YYYY#г., #hhhh#:#mm#" )
                            let unwarnDate = new Date(warn_res[i].unwarned_date + 1000 * 60 * 60 * 3).customFormat( "#DD# #MMMM# #YYYY#г., #hhhh#:#mm#" )
                            let warnedBy = message.guild.members.cache.find(mem => mem.id === warn_res[i].warned_by) || warn_res[i].warned_by
                            let expired = `${warn_res[i].expired}`
                            if(warn_res[i].unwarned_by == 'none'){
                                embed.addFields(
                                    {name: `Случай #${warn_res[i].ID}`, value: `**Выдано:** **\`${warnDate}\`** ${warnedBy}\nДлительность: **\`${warn_res[i].duration / (1000 * 60 * 60)}ч\`**\nДействует: \`${expired.replace(/false/g, "Да").replace(/true/g, "Нет")}\`\nПричина: ${warn_res[i].reason}`}
                                )
                            } else {
                                let unwarnedBy = message.guild.members.cache.find(mem => mem.id === warn_res[i].unwarned_by) || warn_res[i].unwarned_by
                                embed.addFields(
                                    {name: `Случай #${warn_res[i].ID} (СНЯТ)`, value: `**\`${unwarnDate}\`** ${unwarnedBy}\nДлительность: **\`${warn_res[i].duration / (1000 * 60 * 60)}ч\`**\nПричина: ${warn_res[i].unwarned_reason}`}
                                )
                            }
                        }
                    }
                    return embed
                };
                

                const changeToBans = () => {

                    page = Math.ceil(ban_res.length / 5)
                    if(pg != Math.floor(pg)) pg = 1
                    if(!pg) pg = 1
                    var end = pg * 5
                    var start = pg * 5 - 5

                    if(ban_res.length == 0){
                        let embed = new Discord.MessageEmbed()
                        .setTitle(`Список банов ${displayMem}`)
                        .setDescription(`У этого пользователя нет банов`)
                        .setThumbnail('https://i.imgur.com/D1enPm7.png')
                        .setColor(noColor())
                        return embed
                    }

                    let embed = new Discord.MessageEmbed()
                    .setTitle(`Список банов ${displayMem}`)
                    .setThumbnail('https://i.imgur.com/D1enPm7.png')
                    .setColor(noColor())
                    .setFooter({text: `Стр. ${pg} из ${page}`})
                    if(ban_res.length <= end){
                        for(i = start; i < ban_res.length; i++){                     
                            let banDate = new Date(ban_res[i].date + 1000 * 60 * 60 * 3).customFormat( "#DD# #MMMM# #YYYY#г., #hhhh#:#mm#" )
                            let bannedBy = message.guild.members.cache.find(mem => mem.id === ban_res[i].banned_by) || ban_res[i].banned_by
                            if(ban_res[i].unbanned_date == null){
                                embed.addFields(
                                    {name: `Случай #${ban_res[i].ID}`, value: `**Выдано:** **\`${banDate}\`** ${bannedBy}\nДлительность: **\`${ban_res[i].duration > 0 ? ms(ban_res[i].duration) : "Навсегда"}\`**\nДействует: **\`${ban_res[i].expired == false > 0 ? "Да" : "Нет"}\`**\nПричина: ${ban_res[i].reason != null ? ban_res[i].reason : "Не найдена"}`}
                                )
                            } else {
                                let unbannedBy = message.guild.members.cache.find(mem => mem.id === ban_res[i].unbanned_by) || ban_res[i].unbanned_by                
                                let unbannedDate = new Date(ban_res[i].unbanned_date + 1000 * 60 * 60 * 3).customFormat( "#DD# #MMMM# #YYYY#г., #hhhh#:#mm#" )
                                embed.addFields(
                                    {name: `Случай #${ban_res[i].ID} (Разбанен)`, value: `**Выдано:** **\`${banDate}\`** ${bannedBy}\nДлительность: **\`${ban_res[i].duration > 0 ? ms(ban_res[i].duration) : "Навсегда"}\`**\nДействует: **\`${ban_res[i].expired == false > 0 ? "Да" : "Нет"}\`**\nПричина: ${ban_res[i].reason != null ? ban_res[i].reason : "Не найдена"}\n**Разбанен:** **\`${unbannedDate}\`** ${unbannedBy}\nПричина: ${ban_res[i].unbanned_reason != null ? `${ban_res[i].unbanned_reason}` : "Не найдена"}`}
                                )
                            }
                        }
                    } else {
                        for(i = start; i < end; i++){                                          
                            let banDate = new Date(ban_res[i].date + 1000 * 60 * 60 * 3).customFormat( "#DD# #MMMM# #YYYY#г., #hhhh#:#mm#" )
                            let bannedBy = message.guild.members.cache.find(mem => mem.id === ban_res[i].banned_by) || ban_res[i].banned_by
                            if(ban_res[i].unbanned_date == null){
                                embed.addFields(
                                    {name: `Случай #${ban_res[i].ID}`, value: `**Выдано:** **\`${banDate}\`** ${bannedBy}\nДлительность: **\`${ban_res[i].duration > 0 ? ms(ban_res[i].duration) : "Навсегда"}\`**\nДействует: **\`${ban_res[i].expired == false > 0 ? "Да" : "Нет"}\`**\nПричина: **\`${ban_res[i].reason != null ? ban_res[i].reason : "\`Не найдена\`"}\`**`}
                                )
                            } else {
                                let unbannedBy = message.guild.members.cache.find(mem => mem.id === ban_res[i].unbanned_by) || ban_res[i].unbanned_by             
                                let unbannedDate = new Date(ban_res[i].unbanned_date + 1000 * 60 * 60 * 3).customFormat( "#DD# #MMMM# #YYYY#г., #hhhh#:#mm#" )
                                embed.addFields(
                                    {name: `Случай #${ban_res[i].ID} (Разбанен)`, value: `**Выдано:** **\`${banDate}\`** ${bannedBy}\nДлительность: **\`${ban_res[i].duration > 0 ? ms(ban_res[i].duration) : "Навсегда"}\`**\nДействует: **\`${ban_res[i].expired == false > 0 ? "Да" : "Нет"}\`**\nПричина: **\`${ban_res[i].reason != null ? ban_res[i].reason : "Не найдена"}\`**\n**Разбанен:** **\`${unbannedDate}\`** ${unbannedBy}\nПричина: ${ban_res[i].unbanned_reason != null ? `\`${ban_res[i].unbanned_reason}\`` : "\`Не найдена\`"}`}
                                )
                            }
                        }
                    }
                    return embed
                };


                const initMessage = await message.reply({
                    embeds: [changeToMain()],
                    components: [action],
                });

                const filter = (interaction) => interaction.user.id === message.member.id;
                const collector = await initMessage.createMessageComponentCollector({ filter, time: 120000 })

                collector.on('collect', async (Interaction) => {
                    if(Interaction.customId == "next"){
                        pg++
                        if(lb == 0){
                            initMessage.edit({
                                embeds: [changeToWarns()],
                                components: components1()
                            })
                        } else if (lb == 1){
                            initMessage.edit({
                                embeds: [changeToMutes()],
                                components: components1()
                            })
                        } else if(lb == 2){
                            initMessage.edit({
                                embeds: [changeToBans()],
                                components: components1()
                            })
                        }
                    } else if(Interaction.customId == "previous"){
                        pg--
                        if(lb == 0){
                            initMessage.edit({
                                embeds: [changeToWarns()],
                                components: components1()
                            })
                        } else if(lb == 1){
                            initMessage.edit({
                                embeds: [changeToMutes()],
                                components: components1()
                            })
                        } else if(lb == 2){
                            initMessage.edit({
                                embeds: [changeToBans()],
                                components: components1()
                            })
                        }
                    } else if(Interaction.customId == "context"){
                        pg = 1
                        initMessage.edit({
                            embeds: [changeToMain()],
                            components: [action]
                        })
                    } else if(Interaction.values[0] == "warns"){
                        end = pg * 10
                        pg = 1
                        lb = 0
                        //page = Math.ceil(warn_res.length / 10)
                        initMessage.edit({
                            embeds: [changeToWarns()],
                            components: components1()
                        })
                    } else if(Interaction.values[0] == "mutes"){
                        end = pg * 10
                        pg = 1
                        lb = 1
                        //page = Math.ceil(mute_res.length / 10)
                        initMessage.edit({
                            embeds: [changeToMutes()],
                            components: components1()
                        })
                    } else if(Interaction.values[0] == "bans"){
                        end = pg * 10
                        pg = 1
                        lb = 2
                        //page = Math.ceil(mute_res.length / 10)
                        initMessage.edit({
                            embeds: [changeToBans()],
                            components: components1()
                        })
                    }
                    await Interaction.deferUpdate()
                })

            }catch(err){
                console.error(chalk.redBright(err.stack))
                console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
            }
        }
    }
