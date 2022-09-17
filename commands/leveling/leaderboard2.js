const chalk = require('chalk')

module.exports = {
  name: "leaderboard",
  description: "Описание команд",
  aliases: ["lb", "лидеры"],
  run: async (bot, message, args) => {

    try{

      const Discord = require('discord.js')
      const User = require('../../models/user')
      const Guild = require('../../models/guild')
      const MongoFunc = require('../../functions/MongoFunc')
      const Util = require('../../functions/Util')
      const { Embeds, crossText, checkmarkText } = require('../../functions/Embed') 
      const { noColor } = require('../../functions/Colours')
      const prefix = bot.server.get(message.guild.id).prefix
      if(!(bot.server.get(message.guild.id).leveling_channels).includes(message.channel.id)) return crossText(`Данная команда разрешена лишь в следующих чатах: ${message.guild.channels.cache.find(ch => ch.id == "880530956304392262") || "880530956304392262"} ${message.guild.channels.cache.find(ch => ch.id == "841889007654141982") || "841889007654141982"}`, message)

    if(args[0] == "help" || args[0] == "помощь"){
      const embed = new Embeds({
          message: message,
          description: `Таблица лидеров по опыту и валюте\nНедельная таблица сбрасывается каждый понедельник в 00:00 (по мск)`,
          embedTitle: "LEADERBOARD HELP-MENU",
          embedColor: noColor(),
          arguments: `● **\`${prefix}leaderboard [coin | global]\`**`,
          alternatives: `● **\`${prefix}leaderboard\`** | **\`${prefix}lb\`** | **\`${prefix}лидеры\`**`,
          examples: `● **\`${prefix}lb\`**`,
          hints: `● Альтернативы используются для сокращения написания команды и ничем не отличаются\n● **\`[]\`** - необязательно для заполнения\nВ глоабльной таблице показаны пользователя, которые не участвуют в недельной борьбе по опыту`
      })

      return embed.help()
  }

      let coin = Util.findEmoji("CHPOKI_COIN") || "🪙"
      let xp = Util.findEmoji("xp1") 
      let left = Util.findEmoji("leftarrow")
      let right = Util.findEmoji("rightarrow")
      let global = Util.findEmoji("global")

      const defaultEmojis = {
        previous: left,
        next: right,
        coin: `${coin}`,
        xp: xp,
        global: global
      };

      var pg
      var lb = args[0] == "global" ? 2 : args[0] == "coin" ?  1 : 0
      var page
      var repeat = false
      var week_res
      var global_res
      var coins_res

    const generateButtons1 = (state) => {
        const checkState = (name) => {
            if (["previous"].includes(name) &&
                pg === 1)
                return true;
            if (["next"].includes(name) &&
                pg === page)
                return true;
            return false;
        };
        let names = ["previous", "next", "coin"];
        let accumulator = []
        names.forEach(name => {
          accumulator.push(new Discord.MessageButton()
          .setEmoji(defaultEmojis[name])
          .setCustomId(name)
          .setDisabled(state || checkState(name))
          .setStyle("PRIMARY"));
        })
          accumulator.push(new Discord.MessageButton()
          .setLabel('GLOBAL')
          .setCustomId("global")
          .setDisabled(state || checkState("global"))
          .setStyle("PRIMARY"));
        return accumulator;
      };

    const generateButtons2 = (state) => {
        const checkState = (name) => {
          if (["previous"].includes(name) &&
              pg === 1)
              return true;
          if (["next"].includes(name) &&
              pg === page)
              return true;
          return false;
      };
      let names = ["previous", "next", "xp"];
      let accumulator = []
      names.forEach(name => {
        accumulator.push(new Discord.MessageButton()
        .setEmoji(defaultEmojis[name])
        .setCustomId(name)
        .setDisabled(state || checkState(name))
        .setStyle("PRIMARY"));
      })
        accumulator.push(new Discord.MessageButton()
        .setLabel('GLOBAL')
        .setCustomId("global")
        .setDisabled(state || checkState("global"))
        .setStyle("PRIMARY"));
      return accumulator;
      };

      const generateButtons3 = (state) => {
        const checkState = (name) => {
            if (["previous"].includes(name) &&
                pg === 1)
                return true;
            if (["next"].includes(name) &&
                pg === page)
                return true;
            return false;
        };
        let names = ["previous", "next", "xp", "coin"];
        return names.reduce((accumulator, name) => {
            accumulator.push(new Discord.MessageButton()
                .setEmoji(defaultEmojis[name])
                .setCustomId(name)
                .setDisabled(state || checkState(name))
                .setStyle("PRIMARY"));
            return accumulator;
        }, []);
      };
    const components1 = (state) => [
        new Discord.MessageActionRow().addComponents(generateButtons1(state)),
    ];

    const components2 = (state) => [
        new Discord.MessageActionRow().addComponents(generateButtons2(state)),
    ];

    const components3 = (state) => [
      new Discord.MessageActionRow().addComponents(generateButtons3(state)),
  ];

    const changeToXP = async () => {
        let dbUser = await User.findOne({guildID: message.guild.id, userID: message.author.id}).limit(1)
        if(dbUser && dbUser.week_xp == 0){
            dbUser.week_xp += 15
            await dbUser.save().catch()
        }
        if(!repeat) week_res = await User.find({guildID: message.guild.id, xp_block: false, week_xp: {$gt: 0}}, {userID: 1, level: 1, week_xp: 1, voice_time: 1}).sort({week_xp: -1}).limit(500).lean()
        repeat = true
        page = Math.ceil(week_res.length / 10)
        if(pg != Math.floor(pg)) pg = 1
        if(!pg) pg = 1
        var end = pg * 10
        var start = pg * 10 - 10
        t = 0
        c = 0

        for(let b = 0; b < week_res.length; b++){
          if(week_res[b].userID !== message.member.id && dbUser.xp_block == false){
            if(b >= week_res.length - 1){
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
          //} else {

              let embed = new Discord.MessageEmbed()
              .setTitle(`Таблица лидеров: Опыт [WEEK]`)
              .setThumbnail(message.guild.iconURL({dynamic: true}))
              .setColor(noColor())

              if(dbUser.xp_block == false){
                embed.setFooter({text: `Стр. ${pg} из ${page} • Ваш ранг: ${t == 0 ? c + 1 : "500+"} `, iconURL: message.member.displayAvatarURL({format: 'png', size: 256, dynamic: false})})
              } else {
                embed.setFooter({text: `Стр. ${pg} из ${page} • Ваш ранг: Не участвует`, iconURL: message.member.displayAvatarURL({format: 'png', size: 256, dynamic: false})})
              }

              if(week_res.length <= end){
                  for(i = start; i < week_res.length; i++){
                    let mem = message.guild.members.cache.find(mem => mem.id === week_res[i].userID) || `${week_res[i].userID}`
                    //if(!mem) continue
                    let hours = Math.floor(week_res[i].voice_time / (1000 * 60 * 60))
                    let minutes = Math.floor((week_res[i].voice_time % (1000 * 60 * 60)) / (1000 * 60))
                    let seconds = Math.floor((week_res[i].voice_time % (1000 * 60 * 60)) % (1000 * 60) / 1000)
                    let convertedTime = `${hours > 0 ? `${hours < 10 ? `0${hours}:` : `${hours}:`}` : ''}`
                    + `${week_res[i].voice_time > 1000 ? minutes > 0 ? `${minutes < 10 ? `0${minutes}:` : `${minutes}:`}` : '00:' : ''}`
                    + `${week_res[i].voice_time > 1000 ? seconds > 0 ? `${seconds < 10 ? `0${seconds}` : `${seconds}`}` : '00' : ''}`
                      embed.addFields(
                          //{name: `${i + 1}. ${mem.displayName}`, value: `**Уровень:** ${week_res[i].level} | **Опыт:** ${week_res[i].week_xp} | 🎤 ${ms(week_res[i].voice_time, {colonNotation: true, secondsDecimalDigits: 0})}`}
                          {name: `${i + 1}. ${mem ? mem.displayName : week_res[i].userID}`, value: `**Уровень:** ${week_res[i].level} | **Опыт:** ${week_res[i].week_xp} ${week_res[i].voice_time >= 1000 ? `| 🎤 ${convertedTime}` : ""}`}
                      )
                  }
              } else {
                  for(i = start; i < end; i++){
                    let mem = message.guild.members.cache.find(mem => mem.id === week_res[i].userID)
                    //if(!mem) continue
                    let hours = Math.floor(week_res[i].voice_time / (1000 * 60 * 60))
                    let minutes = Math.floor((week_res[i].voice_time % (1000 * 60 * 60)) / (1000 * 60))
                    let seconds = Math.floor((week_res[i].voice_time % (1000 * 60 * 60)) % (1000 * 60) / 1000)
                    let convertedTime = `${hours > 0 ? `${hours < 10 ? `0${hours}:` : `${hours}:`}` : ''}`
                    + `${week_res[i].voice_time > 1000 ? minutes > 0 ? `${minutes < 10 ? `0${minutes}:` : `${minutes}:`}` : '00:' : ''}`
                    + `${week_res[i].voice_time > 1000 ? seconds > 0 ? `${seconds < 10 ? `0${seconds}` : `${seconds}`}` : '00' : ''}`
                      embed.addFields(
                          //{name: `${i + 1}. ${mem.displayName}`, value: `**Уровень:** ${week_res[i].level} | **Опыт:** ${week_res[i].week_xp} | 🎤 ${ms(week_res[i].voice_time, {colonNotation: true, secondsDecimalDigits: 0})}`}
                          {name: `${i + 1}. ${mem ? mem.displayName : week_res[i].userID}`, value: `**Уровень:** ${week_res[i].level} | **Опыт:** ${week_res[i].week_xp} ${week_res[i].voice_time >= 1000 ? `| 🎤 ${convertedTime}` : ""}`}
                      )
                  }
              }
              return embed
            //}
          //}
      }

      const changeToCoins = async () => {
        if(!repeat) coins_res = await User.find({guildID: message.guild.id}, {userID: 1, currency: 1, bank: 1, total_currency: 1}).sort([['total_currency', 'descending']]).limit(500).lean()
        repeat = true
        page = Math.ceil(coins_res.length / 10)
        if(pg != Math.floor(pg)) pg = 1
        if(!pg) pg = 1
        var end = pg * 10
        var start = pg * 10 - 10
        t = 0
        c = 0

        // for(let b = 0; b < coins_res.length; b++){
        //   if(coins_res[b].userID !== message.member.id){
        //     if(b >= coins_res.length - 1){
        //       return console.log(`Не было найдено такого человка в таблице монет. Хотя это невозможно!`)
        //     } else {
        //       continue;
        //     }

        for(let b = 0; b < coins_res.length; b++){
          if(coins_res[b].userID !== message.member.id){
            if(b >= coins_res.length - 1){
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
          //} else {
              let embed = new Discord.MessageEmbed()
              .setTitle(`Таблица лидеров: Баланс`)
              .setThumbnail(message.guild.iconURL({dynamic: true}))
              .setColor(noColor())
              .setFooter({text: `Стр. ${pg} из ${page} • Ваш ранг: ${ t == 0 ? c + 1 : `500+`}`, iconURL: message.member.displayAvatarURL({format: 'png', size: 256, dynamic: false})})
              if(coins_res.length <= end){
                  for(i = start; i < coins_res.length; i++){
                    let mem = message.guild.members.cache.find(mem => mem.id === coins_res[i].userID) || `${coins_res[i].userID}`
                      embed.addFields(
                          {name: `${i + 1}. ${mem ? mem.displayName : week_res[i].userID}`, value: `Всего: ${coins_res[i].total_currency}${coin} | На руках: ${coins_res[i].currency}${coin} | В банке: ${coins_res[i].bank}${coin}`}
                      )
                  }
              } else {
                  for(i = start; i < end; i++){
                    let mem = message.guild.members.cache.find(mem => mem.id === coins_res[i].userID) || `${coins_res[i].userID}`
                    embed.addFields(
                      {name: `${i + 1}. ${mem ? mem.displayName : week_res[i].userID}`, value: `Всего: ${coins_res[i].total_currency}${coin} | На руках: ${coins_res[i].currency}${coin} | В банке: ${coins_res[i].bank}${coin}`}
                    )
                  }

              }
              return embed
          //}
        //}
      }

      const changeToGlobalXP = async () => {
        if(!repeat) global_res = await User.find({total_xp: {$gt: 100}, guildID: message.guild.id}, {total_xp: 1, total_level: 1, total_voice_time: 1, userID: 1}).sort({total_xp: -1}).limit(500).lean()
        repeat = true
        page = Math.ceil(global_res.length / 10)
        if(pg != Math.floor(pg)) pg = 1
        if(!pg) pg = 1
        var end = pg * 10
        var start = pg * 10 - 10

        let finded = await global_res.find(el => el.userID === message.author.id)
        let index = await global_res.indexOf(finded)
          //} else {

              let embed = new Discord.MessageEmbed()
              .setTitle(`Таблица лидеров: Опыт [GLOBAL]`)
              .setThumbnail(message.guild.iconURL({dynamic: true}))
              .setColor(noColor())

            
              embed.setFooter({text: `Стр. ${pg} из ${page} • Ваш ранг: ${index != -1 ? index + 1 : "500+"}`, iconURL: message.member.displayAvatarURL({format: 'png', size: 256, dynamic: false})})

              if(global_res.length <= end){
                  for(i = start; i < global_res.length; i++){
                    let mem = await message.guild.members.cache.find(mem => mem.id === global_res[i].userID) || `${global_res[i].userID}`
                    //if(!mem) continue
                      embed.addFields(
                          {name: `${i + 1}. ${mem ? mem.displayName : week_res[i].userID}`, value: `**Уровень:** ${global_res[i].total_level} | **Опыт:** ${global_res[i].total_xp} | 🎤 ${Math.round(global_res[i].total_voice_time / (1000 * 60 * 60))} ч`}
                      )
                  }
              } else {
                  for(i = start; i < end; i++){
                    let mem = await message.guild.members.cache.find(mem => mem.id === global_res[i].userID) || `${global_res[i].userID}`
                    //if(!mem) continue
                    embed.addFields(
                        {name: `${i + 1}. ${mem ? mem.displayName : week_res[i].userID}`, value: `**Уровень:** ${global_res[i].total_level} | **Опыт:** ${global_res[i].total_xp} | 🎤 ${Math.round(global_res[i].total_voice_time / (1000 * 60 * 60))} ч`}
                    )
                  }
              }
              return embed
            //}
          //}
      }
      let initMessage
      if(args[0] == "coin"){
        initMessage = await message.reply({
          embeds: [await changeToCoins()],
          components: components2(),
      })
      } else if(args[0] == "global"){
        initMessage = await message.reply({
          embeds: [await changeToGlobalXP()],
          components: components3(),
      })
      } else {
        initMessage = 
        await message.reply({
          embeds: [await changeToXP()],
          components: components1(),
      })
    }

    const collector = await initMessage.createMessageComponentCollector({ type: 'BUTTON', time: 120000 })
    collector.on('collect', async (button) => {
      if(button.user.id !== message.member.id) return button.reply({ content: "Вы не можете использовать чужие кнопки", ephemeral: true })
      await button.deferUpdate()
        if(button.customId == "next"){
          pg++
            if(lb == 0){
              await initMessage.edit({
                  embeds: [await changeToXP()],
                  components: components1()
              })
            } else if(lb == 1) {
              await initMessage.edit({  
                  embeds: [await changeToCoins()],
                  components: components2()
              })
            } else if(lb == 2){
              await initMessage.edit({  
                embeds: [await changeToGlobalXP()],
                components: components3()
              })
            }
        } else if(button.customId == "previous"){
            pg--
            if(lb == 0){
              await initMessage.edit({
                  embeds: [await changeToXP()],
                  components: components1()
              })
            } else if(lb == 1) {
              await initMessage.edit({
                  embeds: [await changeToCoins()],
                  components: components2()
              })
            } else if(lb == 2){
              await initMessage.edit({  
                embeds: [await changeToGlobalXP()],
                components: components3()
              })
            }
        } else if(button.customId == "coin"){
          lb = 1
          pg = 1
          repeat = false
            await initMessage.edit({
                embeds: [await changeToCoins()],
                components: components2()
            })
        } else if(button.customId == "xp"){
          lb = 0
          pg = 1
          repeat = false
          await initMessage.edit({
              embeds: [await changeToXP()],
              components: components1()
          })
      } else if(button.customId == "global"){
        lb = 2
        pg = 1
        repeat = false
        await initMessage.edit({
            embeds: [await changeToGlobalXP()],
            components: components3()
        })
      }
    })

    collector.on('end', () => {
      if(!message.channel) return
      if(lb == 0){
        initMessage.edit({
          components: components1(true)
        })
      } else if(lb == 1) {
        initMessage.edit({
          components: components2(true)
        })
      } else if(lb == 2){
        initMessage.edit({  
          components: components3(true)
        })
      }
    })

    }catch(err){
      console.error(chalk.redBright(err.stack))
      console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
    }
  }
}
