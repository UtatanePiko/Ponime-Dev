const chalk = require('chalk')

module.exports = {
    name: "suck",
    description: "Описание команд",
    run: async (bot, message, args) => {
        try{
            
            const Discord = require('discord.js')
            const {crossText} = require('../../functions/Embed')
            const {findEmoji} = require('../../functions/Util')
            const Colours = require('../../functions/Colours')
            const cross = findEmoji('cross4')

            let Arr = [
                "https://cdn.discordapp.com/attachments/972823844165419058/972996393729949747/3bceb7f9b42a1a0e43002187c9cf3ffec225d1ef_hq.gif",
                "https://cdn.discordapp.com/attachments/972823844165419058/972996538475347968/57e8296285024f19e06dfcef4c21033d2487ba76.gif",
                "https://cdn.discordapp.com/attachments/972823844165419058/972996696852291604/97f58a7d7c4dee7bea30586f01733d04610cdbad.gif",
                "https://cdn.discordapp.com/attachments/972823844165419058/972996865379414076/118_1000.gif",
                "https://cdn.discordapp.com/attachments/972823844165419058/972996957419229244/132_1000.gif",
                "https://cdn.discordapp.com/attachments/972823844165419058/972997227721150574/233_1000.gif",
                "https://cdn.discordapp.com/attachments/972823844165419058/972997331358203934/766_1000.gif",
                "https://cdn.discordapp.com/attachments/972823844165419058/972997432214446131/888_1000.gif",
                "https://cdn.discordapp.com/attachments/972823844165419058/972997545603239967/17934.gif",
                "https://cdn.discordapp.com/attachments/972823844165419058/972997545603239967/17934.gif",
                "https://cdn.discordapp.com/attachments/972823844165419058/972997669142282310/17942.gif",
                "https://cdn.discordapp.com/attachments/972823844165419058/972997806639939635/22958.gif",
                "https://cdn.discordapp.com/attachments/972823844165419058/972997911640154132/23278.gif",
                "https://cdn.discordapp.com/attachments/972823844165419058/972998000555225138/37176.gif",
                "https://cdn.discordapp.com/attachments/972823844165419058/972998039016992789/37247.gif",
                "https://cdn.discordapp.com/attachments/972823844165419058/972998229585166436/chidoria_mika_erogos_and_in_series_drawn_by_maki_daikichi_208fdf8f38bba35622f6b8a6db8c6eaa.gif",
                "https://cdn.discordapp.com/attachments/972823844165419058/972998484569518080/k987p7t0b1781.gif",
                "https://cdn.discordapp.com/attachments/972823844165419058/972998574109511730/tumblr_m5hnw6BzqB1rwtt7po1_500.gif",
            ]

            let msg = ''
            let chan = message.guild.channels.cache.get('880530956304392262') || `**| Канал находится на другом сервере |**`
            if(!message.channel.nsfw) return crossText(`Канал не является ${chan}`, message)

            let target = args[0] ? message.guild.members.cache.get(args[0].replace('<@', '').replace('>', '')) ? message.guild.members.cache.get(args[0].replace('<@', '').replace('>', '')) : message.mentions.members.first() : null
            if(!target) return crossText(`Не указан или не найден пользователь`, message)
            if(target.id == message.member.id) return crossText(`Вы не можете взаимодействовать сами с собой`, message)

            let text = args.splice(1).join(" ")
            msg = `${message.member} **отсосал(а) у** ${target}`
            if(text) msg = `${msg}\nПотому что **${text}**`
            
            const action = {
                type: "ACTION_ROW",
                components:[
                    {
                        type: "BUTTON",
                        label: `Согласиться`,
                        customId: "accept",
                        style: "PRIMARY",
                    },
                    {
                        type: "BUTTON",
                        label: `Отказаться`,
                        customId: "decline",
                        style: "DANGER",
                    },
                ]
            }

            let embed = new Discord.MessageEmbed()
            .setColor("#cac719")
            .setDescription(`${message.member} **предложил(а) отсосать у** ${target}`)

            const initMessage = await message.channel.send({
                embeds: [embed],
                components: [action],
            });

            const filter = (interaction) => interaction.user.id === target.id;
            const collector = await initMessage.createMessageComponentCollector({ filter, time: 30000, max: 1 })

            collector.on('collect', async (Interaction) => {
                //if(Interaction.user.id !== target.id) return 

                var rand = Math.round(Math.random()*(Arr.length-1));

                if(Interaction.customId == "accept"){
                    if(initMessage) initMessage.delete()
                    let embed = new Discord.MessageEmbed()
                    .setDescription(msg)
                    .setColor(Colours.noColor())
                    .setImage(Arr[rand])
                    message.channel.send({embeds: [embed]})
                }

                if(Interaction.customId == "decline"){
                    if(initMessage) initMessage.delete()
                    let embed = new Discord.MessageEmbed()
                    .setDescription(`${target} **отказал(а) в вашем предложении**`)
                    .setColor("#922a37")
                    message.channel.send({content: `${message.member}`, embeds: [embed]})
                }

                await Interaction.deferUpdate()
            })

            collector.on('end', async (collected) => {

                if(collected.size == 0){
                    let embed = new Discord.MessageEmbed()
                    .setDescription(`${cross} **Время предложения истекло**`)
                    .setColor("#922a37")
                    initMessage.edit({
                        embeds: [embed],
                        components: []
                    })
                }
            })
        }catch(err){
            console.error(chalk.redBright(err.stack))
            console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
        }
    }
}
