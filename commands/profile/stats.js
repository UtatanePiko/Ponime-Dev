const chalk = require('chalk')
const {REVIEWS_BUTTON, DEANON_BUTTON, ARROWS_AND_BACK_BUTTONS, REVIEWS_SORT_SELECTMENU} = require('../../functions/Buttons')
module.exports = {
    name: "statistics",
    description: "Описание команд",
    aliases: ["stats", "profile", "стата", "профиль", "prof", "инфо"],
    run: async (bot, message, args) => {

      try{

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
      }

        const { registerFont } = require('canvas')
        const Canvas = require('canvas')
        const Discord = require('discord.js')
        const ms = require("parse-ms");
        const fs = require('fs')
        const User = require('../../models/user')
        const Util = require('../../functions/Util')
        const { Embeds, crossText, checkmarkText } = require('../../functions/Embed') 
        const { noColor } = require('../../functions/Colours')
        const Guild = require('../../models/guild')
        const userm = args[0] ? message.guild.members.cache.get(args[0].replace('<@', '').replace('>', '')) : null || message.member
        const MongoFunc = require('../../functions/MongoFunc')
        
        const prefix = bot.server.get(message.guild.id).prefix
        if(!(bot.server.get(message.guild.id).leveling_channels).includes(message.channel.id) && message.member.id != "329462919676821504") return crossText(`Данная команда разрешена лишь в следующих чатах: ${message.guild.channels.cache.find(ch => ch.id == "880530956304392262") || "880530956304392262"} ${message.guild.channels.cache.find(ch => ch.id == "841889007654141982") || "841889007654141982"}`, message)

        if(args[0] == "help" || args[0] == "помощь"){
          const embed = new Embeds({
              message: message,
              description: `Информация/Статистика пользователя`,
              embedTitle: "PROFILE HELP-MENU",
              embedColor: noColor(),
              arguments: `● **\`${prefix}profile [@user | userID]\`**`,
              alternatives: `●  **\`${prefix}profile\`** | **\`${prefix}stats\`** | **\`${prefix}info\`** | **\`${prefix}prof\`** | **\`${prefix}стата\`** | **\`${prefix}инфо\`**`,
              examples: `● **\`${prefix}profile\`**\n● **\`${prefix}profile @user\`**`,
              hints: `● **\`[]\`** - необязательно для заполнения`
          })
    
          return embed.help()
      }

        if(userm.id != message.member.id) MongoFunc.createUser(userm.id, message.guild.id)
        let check = await User.findOne({userID: userm.id,guildID: message.guild.id}, {}).limit(1).lean()
        let timeout = 0
        if(!check || check == null) timeout = 500

        if(userm.user.bot) return crossText(`Боты не имеют своей карточки!`, message)
// .then(msg => { message.delete(); setTimeout(() => {msg.delete()}, 10000)})

        setTimeout(async () => {
          try{
            let dbUser = await User.find({
              guildID: message.guild.id,
              userID: userm.id
            }, {userID: 1, total_level: 1, total_voice_time: 1, txp: 1, name: 1, age: 1, currency: 1, bank: 1, total_currency: 1, steam: 1, vk: 1, inst: 1, total_messages: 1, warnings: 1}).limit(1).lean()
          let res = await User.find({total_xp: {$gt: 0}, guildID: message.guild.id}, {userID: 1}).sort({total_xp: -1}).limit(500).lean()

            registerFont(`${__dirname}/sans.ttf`, { family: 'Serif' })
            registerFont(`${__dirname}/noto-sans.ttf`, { family: 'Noto-Serif' })
            registerFont(`${__dirname}/emoji.ttf`, { family: 'Emoji' })
            registerFont(`${__dirname}/comicsans.ttf`, { family: '123' })

            const canvas = Canvas.createCanvas(900, 200);
            const ctx = canvas.getContext("2d");

              // for(let i = 0; i < res.length; i++){
              //   if(dbUser[0].userID !== userm.id){
              //     if(i >= res.length - 1){
              //       return
              //     } else {
              //       continue;
              //     }
              //   } else {

                t = 0
                c = 0
        
                for(let b = 0; b < res.length; b++){
                  if(res[b].userID !== userm.id){
                    if(b >= res.length - 1){
                      t = 1
                      break
                    } else {
                      continue
                    }
                  } else {
                    t = 0
                    c = b
                    break
                  }
                }

                  let nextLvlXp = 5 * dbUser[0].total_level**2 + 50 * dbUser[0].total_level + 100

                  // Background 1
                  const background = await Canvas.loadImage('https://i.imgur.com/QtQ7Iyt.jpg')
                  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    
                  // Username
                  ctx.font = `bold 36px "Serif, Noto-Serif, Emoji"`;
                  ctx.fillStyle = "#FFFFFF"
                  ctx.textAlign = "start";
                  const name = Util.shorten(userm.displayName, 15);
                  ctx.fillText(`${name}`, 200, 60)
    
                  // Level
                  ctx.textAlign = "left";
                  ctx.font = `25px "Serif"`;
                  ctx.fillStyle = "#FFFFFF";
                  ctx.fillText(`УР.`, 230, 130);
      
                  ctx.font = `50px "Serif"`;
                  ctx.fillStyle = "#FFFFFF";
                  ctx.fillText(Util.toAbbrev(parseInt(dbUser[0].total_level)), 275, 130);

                  let LvlLength = Util.toAbbrev(dbUser[0].total_level).toString().length
                  if(LvlLength >= 4) LvlLength -= 0.5

                  // Rank
                  ctx.font = `bold 25px "Serif"`;
                  ctx.fillStyle = "#FFFFFF";
                  ctx.fillText(`РАНГ`, 285 + 30 * LvlLength, 130);
      
                  ctx.font = `50px "Serif"`;
                  ctx.fillStyle = "#FFFFFF";
                  ctx.fillText("#" + Util.toAbbrev(parseInt(t == 0 ? c + 1 : "500+")), 360 + LvlLength * 30, 130);

                  let NextLvlXpLength = Util.toAbbrev(nextLvlXp).toString().length
                  if(NextLvlXpLength >= 4) NextLvlXpLength -= 0.5
    
                  // XP
                  ctx.font = `bold 25px "123"`; 
                  ctx.fillStyle = "#FFFFFF";
                  ctx.textAlign = "right";
                  let nextXp = ctx.fillText("/ " + Util.toAbbrev(nextLvlXp) + " EXP", 870, 130);
                  
                  ctx.fillStyle = "#FFFFFF";
                  ctx.fillText(Util.toAbbrev(dbUser[0].txp), 770 - NextLvlXpLength * 10, 130);

                  // Voice Time
                      function msToTime(millis) {
                        var hours = Math.floor(millis / (60000 * 60));
                        var minutes = Math.floor((millis % (60000 * 60)) / 60000).toFixed(0);
                        var seconds = ((millis % 60000) / 1000).toFixed(0);
                        if(hours >= 1){
                          return (hours < 10 ? '0' : '') + hours + ":" + (minutes < 10 ? '0' : '') + minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
                        } else {
                          return (minutes < 10 ? '0' : '') + minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
                        }
                      }

                      //ctx.fillText(msToTime(dbUser[0].total_voice_time), 870, 95);
                      ctx.fillText(`${Math.floor(dbUser[0].total_voice_time / (1000 * 60 * 60))}ч`, 870, 95);

                      let vcTimeLength = (Math.floor(dbUser[0].total_voice_time / (1000 * 60 * 60))).toString().length
                      vcTimeLength = 795 - 13 * vcTimeLength
                      const micro = await Canvas.loadImage("https://i.imgur.com/0j6b479.png").catch(err => console.error(err))
                      ctx.drawImage(micro, vcTimeLength, 45, 80, 80);
    
                  // Progress Bar
                  ctx.globalAlpha = 0.5;
                  ctx.fillStyle = "#484b4e";
                  ctx.beginPath()
                  ctx.arc(225, 157.5, 18.5, 1.5 * Math.PI, 0.5 * Math.PI, true);
                  ctx.fill();
                  ctx.closePath()
                  ctx.fillRect(225, 139, 635, 37.5);
                  ctx.beginPath()
                  ctx.arc(225 + 635, 157.5, 18.75, 1.5 * Math.PI, 0.5 * Math.PI, false);
                  ctx.fill();
                  ctx.closePath()

                  ctx.globalAlpha = 1;
                  if(dbUser[0].txp > 0){
                    ctx.beginPath();
                    ctx.fillStyle = "#FFFFFF";
                    ctx.arc(225, 157.5, 18.5, 1.5 * Math.PI, 0.5 * Math.PI, true);
                    ctx.fill();
                    ctx.fillRect(225, 139, (dbUser[0].txp * 635) / nextLvlXp, 37.5);
                    ctx.fill();
                    ctx.save()
                  }

                  let status_color = "#00c453"

                  if(!userm.presence){
                    status_color = "#555555"
                  }else if(userm.presence.status == "dnd"){
                    status_color = "#ed4245"
                  } else if(userm.presence.status == "idle"){
                    status_color = "#faa81a"
                  } else if(userm.presence.status == "offline"){
                    status_color = "#555555"
                  }

                  ctx.globalAlpha = 1;
    
                  // Avatar Line
                  ctx.beginPath();
                  ctx.arc(105, 105, 82, 0, Math.PI * 2, true);
                  ctx.strokeStyle = status_color;
                  ctx.lineWidth = 6;
                  ctx.stroke();
                  
                  // Avatar Cut
                  ctx.beginPath();
                  ctx.arc(105, 105, 80, 0, Math.PI * 2, true);
                  ctx.closePath();
                  ctx.clip();

                  ctx.beginPath();
                  ctx.fillStyle = "#00FF00";
                  ctx.arc(162, 162, 17.5, 0, 2 * Math.PI);
                  ctx.fill();
                  ctx.closePath();
    
                  const avatar = await Canvas.loadImage(userm.user.displayAvatarURL({ format: 'png', size: 1024, dynamic: false})).catch(err => console.error(err))
                  ctx.drawImage(avatar, 25, 25, 160, 160);

                  var joinedAt = userm.joinedAt, joinedAtFormat =
                  ("00" + (joinedAt.getUTCDate())).slice(-2) + "." +
                  ("00" + joinedAt.getUTCMonth()).slice(-2) + "." +
                  joinedAt.getUTCFullYear() + " " +
                  ("00" + joinedAt.getUTCHours()).slice(-2) + ":" +
                  ("00" + joinedAt.getUTCMinutes()).slice(-2)
          
                  var createdAt = userm.user.createdAt, createdAtFormat =
                  ("00" + (createdAt.getUTCDate())).slice(-2) + "." +
                  ("00" + createdAt.getUTCMonth()).slice(-2) + "." +
                  createdAt.getUTCFullYear() + " " +
                  ("00" + createdAt.getUTCHours()).slice(-2) + ":" +
                  ("00" + createdAt.getUTCMinutes()).slice(-2)
      
                  //let time = ms(dbUser[0].total_voice_time, {colonNotation: true, secondsDecimalDigits: 0})
                  let time = (Math.floor(dbUser[0].total_voice_time / (1000 * 60 * 60)))

                  var buf =  canvas.toBuffer();
                  fs.writeFileSync(`profile_${userm.id}.png`, buf)

                  let Man = userm.roles.cache.find(r => r.name == "Мэнчики")
                  let Woman = userm.roles.cache.find(r => r.name == "Леди") || userm.roles.cache.find(r => r.name == "ЛЕДИ")
                  if(Man){
                    gender = "Мужской"
                  } else if (Woman){
                    gender = "Женский"
                  } else {
                    gender = "Нет роли"
                  }
                  let coin = Util.findEmoji("CHPOKI_COIN")
                  let steam = Util.findEmoji("steam")
                  let inst = Util.findEmoji("instagram")
                  let vk = Util.findEmoji("vk")
                  let like = Util.findEmoji("like")
                  let dislike = Util.findEmoji("dislike")

                  let eventManagerRole = message.guild.roles.cache.get('880962761415352390') || message.guild.roles.cache.get('996781830386745374')
                  let heplerRole = message.guild.roles.cache.get('830896489215688714') || message.guild.roles.cache.get('961566445618216960')
                  let control = message.guild.roles.cache.get('1002328129798414356') || message.guild.roles.cache.get('829376653795786752')
                  let moderRole = message.guild.roles.cache.get('803053033259794482') || message.guild.roles.cache.get('925688128558223370')
                  let ownerRole = message.guild.roles.cache.get('723369057281114162') || message.guild.roles.cache.get('963036787163418715')

                  let isStuff = userm.roles.cache.has(eventManagerRole.id) ||
                                userm.roles.cache.has(heplerRole.id) ||
                                userm.roles.cache.has(moderRole.id) ||
                                userm.roles.cache.has(ownerRole.id) ||
                                userm.roles.cache.has(control.id) ? true : false
                                              

                  let mainEmbed = new Discord.MessageEmbed()
                  .setTitle(`Профиль ${userm.displayName}`)
                  .setColor(noColor())
                  .setThumbnail(userm.displayAvatarURL({format: 'png', size: 1024, dynamic: false}))
                  .setFields(
                      {name: `Имя`, value: `${dbUser[0].name}`, inline: true},
                      {name: `Возраст`, value: `${dbUser[0].age}`, inline: true},
                      {name: `Пол`, value: `${gender}`, inline: true},
                      {name: `На руках`, value: `${dbUser[0].currency} ${coin}`, inline: true},
                      {name: `В банке`, value: `${dbUser[0].bank} ${coin}`, inline: true},
                      {name: `Всего`, value: `${dbUser[0].total_currency} ${coin}`, inline: true},   
                  )
                  .setImage(`attachment://profile_${userm.id}.png`)
                  if(dbUser[0].steam || dbUser[0].inst || dbUser[0].vk){
                    mainEmbed.addField(`Соц. сети`, `${dbUser[0].steam ? `${steam} [Steam](${dbUser[0].steam})` : dbUser[0].inst ? `${inst} [Instagram](${dbUser[0].inst})` : dbUser[0].vk ? `${vk} [VK](${dbUser[0].vk})` : ""}`, true)
                    mainEmbed.addField(`⁣`, `${dbUser[0].steam ? dbUser[0].inst ? `${inst} [Instagram](${dbUser[0].inst})` : dbUser[0].vk ? `${vk} [VK](${dbUser[0].vk})` : "⁣" : dbUser[0].vk && dbUser[0].inst ? `${vk} [VK](${dbUser[0].vk})` : "⁣"}`, true)
                    mainEmbed.addField(`⁣`, dbUser[0].steam && dbUser[0].inst ? dbUser[0].vk ? `${vk} [VK](${dbUser[0].vk})` : "⁣" : "⁣", true)
                  }
                  mainEmbed.addField(`Статистика`,`\`\`\`js\nУчастник отправил ${dbUser[0].total_messages} сообщений\nИмеет ${dbUser[0].warnings} предупреждений\nПровел ${time}ч в войсе\n\`\`\``)
                  //setTimeout(async() => {
                      const initMessage = await message.reply({
                        embeds: [mainEmbed], 
                        files: [`./profile_${userm.id}.png`],
                        components: isStuff ? [REVIEWS_BUTTON()] : null
                      }).then(
                        setTimeout(() => {
                          if(fs.existsSync(`./profile_${userm.id}.png`)){
                            fs.unlinkSync(`./profile_${userm.id}.png`)
                          }
                        }, 60000 * 5)
                      )

                    //.then(setTimeout(() => { fs.unlinkSync(`./test_${userm.id}.png`)}, 300))
                  //}, 100)

                  if(isStuff){
                    const Reviews = require('../../models/reviews')
                    var findReviews = await Reviews.find({guildID: message.guild.id, userID: userm.id}).lean()

                    page = Math.ceil(findReviews.length / 5)
                    var pg = 1
                    var sort_type = 'old'

                    const generateReviews = (sort_type) => {
                      ReviewsArray = findReviews
                      if(sort_type == "new") ReviewsArray = findReviews.sort((a, b) => b.ID - a.ID)
                      if(sort_type == "old") ReviewsArray = findReviews.sort((a, b) => a.ID - b.ID)
                      if(sort_type == "positive") ReviewsArray = findReviews.filter(rev => rev.positive == true).sort((a, b) => a.ID - b.ID)
                      if(sort_type == "negative") ReviewsArray = findReviews.filter(rev => rev.positive == false).sort((a, b) => a.ID - b.ID)
                      var end = pg * 5
                      var start = pg * 5 - 5

                      let now = new Date
                      let embed = new Discord.MessageEmbed().setTitle(`Список отзывов ${userm.displayName}`).setColor(noColor()).setFooter({text: `Стр. ${pg} из ${page}`})
                      .setThumbnail(userm.displayAvatarURL({format: 'png', size: 1024, dynamic: true}))
                      .setFields(
                        {name: `Положительных:`, value: `\`\`\`${findReviews.filter(rev => rev.positive == true).length.toString()}\`\`\``, inline: true},
                        {name: `Отрицательных:`, value: `\`\`\`${findReviews.filter(rev => rev.positive == false).length.toString()}\`\`\``, inline: true},
                        {name: `Соотношение:`, value: `\`\`\`${Math.ceil(100 / findReviews.length * findReviews.filter(rev => rev.positive == true).length)}%\`\`\``, inline: true},
                      )
                      if(ReviewsArray.length <= end){
                        for(i = start; i < ReviewsArray.length; i++){
                          let review = ReviewsArray[i]
                          let reviewDate = new Date(now.getTimezoneOffset() != 0 ? review.date : review.date + 1000 * 60 * 60 * 3).customFormat( "#DD# #MMMM# #YYYY#г., #hhhh#:#mm#" )
                          embed.addFields({
                            name: `Отзыв №${review.ID}`,
                            value: `**Тип отзыва:** ${review.positive ? `положительный ${like}` : `отрицательный ${dislike}`}\n**Дата отзыва:** ${reviewDate}\n**Отзыв:** ${review.review}`
                          })  
                        }
                      } else {
                          for(i = start; i < end; i++){                      
                            let review = ReviewsArray[i]
                            let reviewDate = new Date(now.getTimezoneOffset() != 0 ? review.date : review.date + 1000 * 60 * 60 * 3).customFormat( "#DD# #MMMM# #YYYY#г., #hhhh#:#mm#" )
                            embed.addFields({
                              name: `Отзыв №${review.ID}`,
                              value: `**Тип отзыва:** ${review.positive ? `положительный ${like}` : `отрицательный ${dislike}`}\n**Дата отзыва:** ${reviewDate}\n**Отзыв:** ${review.review}`
                            })  
                          }
                      }
                      return embed
                    }
  
                    const channelFilter = (m) => m.author.id === message.member.id
                    const Collector = initMessage.createMessageComponentCollector({channelFilter, time: 60000 * 5, errors: ['time']})
  
                    Collector.on('collect', async interaction => {
                      if (interaction.member.id != message.member.id) return await interaction.reply({ content: `Эта кнопка не для вас`, ephemeral: true });
                      if(interaction.customId == "reviews_button"){
                        if(findReviews.length == 0){
                          let emptyEmbed = new Discord.MessageEmbed().setTitle(`Список отзывов ${userm.displayName}`).setColor(noColor())
                          .setThumbnail(userm.displayAvatarURL({format: 'png', size: 1024, dynamic: true}))
                          .setDescription(`У этого пользователя отсутствуют какие-либо отзывы`)

                          initMessage.edit({
                            embeds: [emptyEmbed],
                            components: [],
                            files: []
                          })
                        } else {
                          initMessage.edit({
                            embeds: [generateReviews()],
                            components: [REVIEWS_SORT_SELECTMENU(sort_type), ARROWS_AND_BACK_BUTTONS(pg, page, false, message.author.id == "248453176745787393" ? true : false)],
                            files: []
                          })
                        }
                        interaction.deferUpdate()
                      } else if (interaction.customId == "deanon_button"){
                        var end = pg * 5
                        var start = pg * 5 - 5
                        let now = new Date
                        let embed = new Discord.MessageEmbed().setColor(noColor())
                        if(findReviews.length <= end){
                          for(i = start; i < findReviews.length; i++){
                            let review = findReviews[i]
                            let findMember = message.guild.members.cache.get(review.from_userID) || `${review.from_userID}`
                            let reviewDate = new Date(now.getTimezoneOffset() != 0 ? review.date : review.date + 1000 * 60 * 60 * 3).customFormat( "#DD# #MMMM# #YYYY#г., #hhhh#:#mm#" )
                            embed.addFields({
                              name: `Отзыв №${review.ID}`,
                              value: `**Пользователь:** ${findMember}\n**Тип отзыва:** ${review.positive ? `положительный ${like}` : `отрицательный ${dislike}`}\n**Дата отзыва:** ${reviewDate}\n**Отзыв:** ${review.review}`
                            })  
                          }
                      } else {
                          for(i = start; i < end; i++){                                
                            let review = findReviews[i]
                            let findMember = message.guild.members.cache.get(review.from_userID) || `${review.from_userID}`
                            let reviewDate = new Date(now.getTimezoneOffset() != 0 ? review.date : review.date + 1000 * 60 * 60 * 3).customFormat( "#DD# #MMMM# #YYYY#г., #hhhh#:#mm#" )
                            embed.addFields({
                              name: `Отзыв №${review.ID}`,
                              value: `**Пользователь:** ${findMember}\n**Тип отзыва:** ${review.positive ? `положительный ${like}` : `отрицательный ${dislike}`}\n**Дата отзыва:** ${reviewDate}\n**Отзыв:** ${review.review}`
                            })  
                          }
                        }
                        return await interaction.reply({
                          embeds: [embed],
                          ephemeral: true
                        })
                      } else if(interaction.customId == "profile_button") {
                        initMessage.edit({
                          embeds: [mainEmbed], 
                          files: [`./profile_${userm.id}.png`],
                          components: isStuff ? [REVIEWS_BUTTON()] : null
                        })
                        interaction.deferUpdate()
                      } else if(interaction.customId == 'next_button'){
                        pg++
                        initMessage.edit({
                          embeds: [generateReviews()],
                          components: [REVIEWS_SORT_SELECTMENU(sort_type), ARROWS_AND_BACK_BUTTONS(pg, page, false, message.author.id == "248453176745787393" ? true : false)],
                          files: []
                        })
                        interaction.deferUpdate()
                      } else if(interaction.customId == 'previous_button'){
                        pg--
                        initMessage.edit({
                          embeds: [generateReviews()],
                          components: [REVIEWS_SORT_SELECTMENU(sort_type), ARROWS_AND_BACK_BUTTONS(pg, page, false, message.author.id == "248453176745787393" ? true : false)],
                          files: []
                        })
                        interaction.deferUpdate()
                      } else if(interaction.customId == "sort_select" && interaction.values[0] == "new"){
                        pg = 1
                        page = Math.ceil(findReviews.length / 5)
                        initMessage.edit({
                          embeds: [generateReviews("new")],
                          components: [REVIEWS_SORT_SELECTMENU("new"), ARROWS_AND_BACK_BUTTONS(pg, page, false, message.author.id == "248453176745787393" ? true : false)],
                          files: []
                        })
                        interaction.deferUpdate()
                      } else if(interaction.customId == "sort_select" && interaction.values[0] == "old"){
                        pg = 1
                        page = Math.ceil(findReviews.length / 5)
                        initMessage.edit({
                          embeds: [generateReviews("old")],
                          components: [REVIEWS_SORT_SELECTMENU("old"), ARROWS_AND_BACK_BUTTONS(pg, page, false, message.author.id == "248453176745787393" ? true : false)],
                          files: []
                        })
                        interaction.deferUpdate()
                      } else if(interaction.customId == "sort_select" && interaction.values[0] == "positive"){
                        pg = 1
                        page = Math.ceil(findReviews.filter(rev => rev.positive == true).length / 5)
                        initMessage.edit({
                          embeds: [generateReviews("positive")],
                          components: [REVIEWS_SORT_SELECTMENU("positive"), ARROWS_AND_BACK_BUTTONS(pg, page, false, message.author.id == "248453176745787393" ? true : false)],
                          files: []
                        })
                        interaction.deferUpdate()
                      } else if(interaction.customId == "sort_select" && interaction.values[0] == "negative"){
                        pg = 1
                        page = Math.ceil(findReviews.filter(rev => rev.positive == false).length / 5)
                        initMessage.edit({
                          embeds: [generateReviews("negative")],
                          components: [REVIEWS_SORT_SELECTMENU("negative"), ARROWS_AND_BACK_BUTTONS(pg, page, false, message.author.id == "248453176745787393" ? true : false)],
                          files: []
                        })
                        interaction.deferUpdate()
                      }
                    })
                  }
                //}
            //}
      }catch(err){
        console.error(chalk.redBright(err.stack))
        console.error(chalk.yellowBright('Продолжаю работу после ошибки в setTimeout()...'))
    }
      }, timeout)
      }catch(err){
        console.error(chalk.redBright(err.stack))
        console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
    }
  }
}
