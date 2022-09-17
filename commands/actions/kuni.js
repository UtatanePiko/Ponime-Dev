const chalk = require('chalk')

module.exports = {
    name: "kuni",
    description: "Описание команд",
    run: async (bot, message, args) => {
        try{
            
            const Discord = require('discord.js')
            const {crossText} = require('../../functions/Embed')
            const {findEmoji} = require('../../functions/Util')
            const Colours = require('../../functions/Colours')
            const cross = findEmoji('cross4')

            let Arr = [
                "https://cdn.discordapp.com/attachments/972823827228811294/972995827800871002/tumblr_n1ydpkFizB1s0sk8ho1_500_yapfiles.ru.gif",
                "https://cdn.discordapp.com/attachments/972823827228811294/972995847052730389/36298.gif",
                "https://cdn.discordapp.com/attachments/972823827228811294/973384446944366612/2.gif",
                "https://cdn.discordapp.com/attachments/972823827228811294/973384569887789116/3.gif",
                "https://cdn.discordapp.com/attachments/972823827228811294/973384582357459034/6.gif",
                "https://cdn.discordapp.com/attachments/972823827228811294/973384582474903572/4.gif",
                "https://cdn.discordapp.com/attachments/972823827228811294/973384598325198849/7.gif",
                "https://cdn.discordapp.com/attachments/972823827228811294/973387471331151892/5b8u4v4g9wm41.gif",
                "https://cdn.discordapp.com/attachments/972823827228811294/973387644442648627/20200215055633-7ccb5f12.gif",
                "https://cdn.discordapp.com/attachments/972823827228811294/973387684548595752/ZjndIzr.gif",
                "https://cdn.discordapp.com/attachments/972823827228811294/973387702089170994/b12ab430d6e4932a07959907e8e36b18.gif",
                "https://cdn.discordapp.com/attachments/972823827228811294/973387732179116072/35.gif",
                "https://cdn.discordapp.com/attachments/972823827228811294/973389784938594364/450_1000.gif",
                "https://cdn.discordapp.com/attachments/972823827228811294/973389789460062208/b9d811d26ce7c0de87d9c82041b43db4.gif",
                "https://cdn.discordapp.com/attachments/972823827228811294/973392228716277830/hentai_cunnilingu-9205.gif",
                "https://cdn.discordapp.com/attachments/972823827228811294/973392252607004732/af5132f9cf78f4b0463bdb8e72772ad1.gif",
                "https://cdn.discordapp.com/attachments/972823827228811294/973392261280837682/411_1000.gif",
                "https://cdn.discordapp.com/attachments/972823827228811294/973392413508902922/0e953f4b402b9d9c2d617cc0fe31ac20.gif",      
            ]

            let msg = ''
            let chan = message.guild.channels.cache.get('880530956304392262') || `**| Канал находится на другом сервере |**`
            if(!message.channel.nsfw) return crossText(`Канал не является ${chan}`, message)

            let target = args[0] ? message.guild.members.cache.get(args[0].replace('<@', '').replace('>', '')) ? message.guild.members.cache.get(args[0].replace('<@', '').replace('>', '')) : message.mentions.members.first() : null
            if(!target) return crossText(`Не указан или не найден пользователь`, message)
            if(target.id == message.member.id) return crossText(`Вы не можете взаимодействовать сами с собой`, message)

            let text = args.splice(1).join(" ")
            msg = `${message.member} **сделал(а) куни** ${target}`
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
            .setDescription(`${message.member} **предложил(а) сделать куни** ${target}`)

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
