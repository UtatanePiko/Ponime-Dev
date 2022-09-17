const chalk = require('chalk')
module.exports = {
    name: "rank",
    category: "info",
    description: "Просмотр карточки пользователя",
    aliases: ["card", "ранг"],
    run: async (bot, message, args) => {

        try{
        
            const { registerFont } = require('canvas')
            const Canvas = require('canvas')
            const Discord = require('discord.js')
            const Guild = require('../../models/guild')
            const User = require('../../models/user')
            const Util = require('../../functions/Util')
            const { Embeds, crossText, checkmarkText } = require('../../functions/Embed') 
            const { noColor } = require('../../functions/Colours')
            let userm = args[0] ? message.guild.members.cache.get(args[0].replace('<@', '').replace('>', '')) : null
            if(!userm) userm = message.member
            const MongoFunc = require('../../functions/MongoFunc')

            const prefix = bot.server.get(message.guild.id).prefix
            if(!(bot.server.get(message.guild.id).leveling_channels).includes(message.channel.id)) return crossText(`Данная команда разрешена лишь в следующих чатах: ${message.guild.channels.cache.find(ch => ch.id == "880530956304392262") || "880530956304392262"} ${message.guild.channels.cache.find(ch => ch.id == "841889007654141982") || "841889007654141982"}`, message)
    

            if(args[0] == "help" || args[0] == "помощь"){
              const embed = new Embeds({
                  message: message,
                  description: `Карточка пользователя с недельной статистикой`,
                  embedTitle: "RANK HELP-MENU",
                  embedColor: noColor(),
                  arguments: `● **\`${prefix}rank [@user | userID | user#1234]\`**`,
                  alternatives: `● **\`${prefix}rank\`** | **\`${prefix}card\`** | **\`${prefix}ранг\`**`,
                  examples: `● **\`${prefix}rank\`** или **\`${prefix}rank @user\`**`,
                  hints: `● Ваш ранг не будет отображать в карточке, если ваша роль не участвует\n● Альтернативы используются для сокращения написания команды и ничем не отличаются\n● **\`[]\`** - необязательно для заполнения`
              })
        
              return embed.help()
            }

            const checkDbUser = await User.findOne({guildID: message.guild.id, userID: userm.id})
            if(userm.id != message.member.id) MongoFunc.createUser(userm.id, message.guild.id)

            let timeoutTime = 0
            if(checkDbUser == undefined) timeoutTime = 1000

            if(userm.user.bot) return crossText(`Нельзя запросить карточку бота`, message)
// .then(msg => { message.delete(); setTimeout(() => {msg.delete()}, 10000)})
  
            setTimeout(() => {
              try{

                User.find({
                  guildID: message.guild.id
                }).sort([
                  ['week_xp', 'descending']
                ]).exec( async (err, res) => {
                  if(err) console.error(err)
    
                  registerFont(`${__dirname}/sans.ttf`, { family: 'Serif' })
                  registerFont(`${__dirname}/noto-sans.ttf`, { family: 'Noto-Serif' })
                  registerFont(`${__dirname}/emoji.ttf`, { family: 'Emoji' })
                  registerFont(`${__dirname}/comicsans.ttf`, { family: '123' })
    
                  const canvas = Canvas.createCanvas(900, 200);
                  const ctx = canvas.getContext("2d");
    
                    for(let i = 0; i < res.length; i++){
                      if(res[i].userID !== userm.id){
                        if(i >= res.length - 1){
                          return
                        } else {
                          continue;
                        }
                      } else {
    
                        let nextLvlXp = 5 * res[i].level**2 + 50 * res[i].level + 100
    
                        // Background 1
                        const background = await Canvas.loadImage('https://i.imgur.com/QtQ7Iyt.jpg')
                        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
          
                        // Username
                        ctx.font = `bold 36px "Serif, Noto-Serif, Emoji"`;
                        ctx.fillStyle = "#FFFFFF"
                        ctx.textAlign = "start";
                        const name = Util.shorten(userm.displayName, 15);
                        ctx.fillText(`${name}`, 200, 60)
          
                        // // Discriminator
                        // ctx.font = `36px 'Serif'`;
                        // ctx.fillStyle = "#7f8286";
                        // ctx.textAlign = "center";
                        // ctx.fillText(`#${userm.user.discriminator.substr(0, 4)}`, ctx.measureText(name).width + 335, 164);
          
                        // Level
                        ctx.textAlign = "left";
                        ctx.font = `25px 'Serif'`;
                        ctx.fillStyle = "#FFFFFF";
                        ctx.fillText(`УР.`, 230, 130);
            
                        ctx.font = `50px 'Serif'`;
                        ctx.fillStyle = "#FFFFFF";
                        ctx.fillText(Util.toAbbrev(parseInt(res[i].level)), 275, 130);
  
                        let LvlLength = Util.toAbbrev(res[i].level).toString().length
                        if(LvlLength >= 4) LvlLength -= 0.5
  
                        // Rank
                        if(res[i].xp_block == false){
                          ctx.font = `bold 25px 'Serif'`;
                          ctx.fillStyle = "#FFFFFF";
                          ctx.fillText(`РАНГ`, 285 + 30 * LvlLength, 130);
              
                          ctx.font = `50px 'Serif'`;
                          ctx.fillStyle = "#FFFFFF";
                          ctx.fillText("#" + Util.toAbbrev(parseInt(i + 1)), 360 + LvlLength * 30, 130);
                        }
  
                        let NextLvlXpLength = Util.toAbbrev(nextLvlXp).toString().length
                        if(NextLvlXpLength >= 4) NextLvlXpLength -= 0.5
          
                        // XP
                        ctx.font = `bold 25px "123"`; 
                        ctx.fillStyle = "#FFFFFF";
                        ctx.textAlign = "right";
                        let nextXp = ctx.fillText("/ " + Util.toAbbrev(nextLvlXp) + " EXP", 870, 130);
                        
                        ctx.fillStyle = "#FFFFFF";
                        ctx.fillText(Util.toAbbrev(res[i].xp), 770 - NextLvlXpLength * 10, 130);
  
  
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
  
                        ctx.fillText(msToTime(res[i].voice_time), 870, 95);
  
                        let vcTimeLength = msToTime(res[i].voice_time).toString().length
                        if(vcTimeLength == 5){
                          vcTimeLength = 745
                        } else if(vcTimeLength == 8){
                          vcTimeLength = 715
                        } else if(vcTimeLength == 9){
                          vcTimeLength = 705
                        }
                        const micro = await Canvas.loadImage("https://i.imgur.com/C8PTscN.png").catch(err => console.error(err))
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
                        if(res[i].xp > 0){
                          ctx.beginPath();
                          ctx.fillStyle = "#FFFFFF";
                          ctx.arc(225, 157.5, 18.5, 1.5 * Math.PI, 0.5 * Math.PI, true);
                          ctx.fill();
                          ctx.fillRect(225, 139, (res[i].xp * 635) / nextLvlXp, 37.5);
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
                        ctx.restore();
          
                        const attachment2 = new Discord.MessageAttachment(canvas.toBuffer(), 'rank-card.png');
                        await message.reply({files: [attachment2]}).catch(err => console.error(err))
                  
                      }
                  }
              })

              }catch(err){
                console.error(chalk.redBright(err.stack))
                console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
              }
            }, timeoutTime)
          }catch(err){
            console.error(chalk.redBright(err.stack))
            console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
        }
    }
}