const chalk = require('chalk')

module.exports = {
    name: "sex",
    description: "Описание команд",
    run: async (bot, message, args) => {
        try{
            
            const Discord = require('discord.js')
            const {crossText} = require('../../functions/Embed')
            const {findEmoji} = require('../../functions/Util')
            const Colours = require('../../functions/Colours')
            const cross = findEmoji('cross4')

            let Arr = [
                "https://cdn.discordapp.com/attachments/972823789324873778/972991447362076713/2d-gif-sex-20509-13.gif",
                "https://cdn.discordapp.com/attachments/972823789324873778/972991556661420042/079_1000.gif",
                "https://cdn.discordapp.com/attachments/972823789324873778/972991852133384252/473_1000.gif",
                "https://cdn.discordapp.com/attachments/972823789324873778/972991865097949244/104_1000.gif",
                "https://cdn.discordapp.com/attachments/972823789324873778/972991867400634418/529_1000.gif",
                "https://cdn.discordapp.com/attachments/972823789324873778/972991867400634418/529_1000.gif",
                "https://cdn.discordapp.com/attachments/972823789324873778/972991901064110100/017_1000.gif",
                "https://cdn.discordapp.com/attachments/972823789324873778/972992246947385484/-2021-05-10-222203401.gif",
                "https://cdn.discordapp.com/attachments/972823789324873778/972992333278752848/18017.gif",
                "https://cdn.discordapp.com/attachments/972823789324873778/972992371862159380/36307.gif",
                "https://cdn.discordapp.com/attachments/972823789324873778/972992698195796008/169425-b3ab5.gif",
                "https://cdn.discordapp.com/attachments/972823789324873778/972992904907878490/c028f584999390d2952159f315fcfa97.gif.crdownload.gif",
                "https://cdn.discordapp.com/attachments/972823789324873778/972993006892359680/180316720PZIZ_2020080503053038f65472f69fa2d7.gif",
                "https://cdn.discordapp.com/attachments/972823789324873778/972993523282477136/7471531-2399f.gif",
                "https://cdn.discordapp.com/attachments/972823789324873778/972993546661539860/202580-9e7cc.gif",
                "https://cdn.discordapp.com/attachments/972823789324873778/972993882545602601/d9c9d18de5bf554f9a853a84dbc26071b1653674.gif",
                "https://cdn.discordapp.com/attachments/972823789324873778/972993945246257262/daisuke_ichijou_and_iihara_nao_resort_boin_7ff589faca1c1962a300b64d7ef90417.gif",
                "https://cdn.discordapp.com/attachments/972823789324873778/972993984047767592/ea2913337de9c313edda1611604b56f29f6288db.gif",
                "https://cdn.discordapp.com/attachments/972823789324873778/972994002196508672/converted.gif",
                "https://cdn.discordapp.com/attachments/972823789324873778/972994009100345374/orig.gif",
                "https://cdn.discordapp.com/attachments/972823789324873778/972994292589166592/tumblr_nby5fde0q41tieaolo8_1280.gif",
                "https://cdn.discordapp.com/attachments/972823789324873778/972994066952380476/erogos_and_inshoku_chikan_densha_drawn_by_maki_daikichi_cf66a615e027fd8b1dac3491e7b4623f.gif",
                "https://cdn.discordapp.com/attachments/972823789324873778/972994338344828928/tumblr_o9oqw9vdH51tvoimto3_500.gif.crdownload.gif",
                "https://cdn.discordapp.com/attachments/972823789324873778/972994364139778098/tumblr_ofm18iWOEw1v2hfg0o2_1280.gif",
                "https://cdn.discordapp.com/attachments/972823789324873778/972994569765539911/When-you-make-a-new-account-just-to-post-hentai.gifs7c869fcfa6667b860c94b865eda7f846ce3ac6f4.gif",
                "https://cdn.discordapp.com/attachments/972823789324873778/972994871734435930/tumblr_nnzxjr9Aia1uq8aqdo4_1280.gif"
              ]
            
            let chan = message.guild.channels.cache.get('880530956304392262') || `**| Канал находится на другом сервере |**`
            if(!message.channel.nsfw) return crossText(`Канал не является ${chan}`, message)

            let target = args[0] ? message.guild.members.cache.get(args[0].replace('<@', '').replace('>', '')) ? message.guild.members.cache.get(args[0].replace('<@', '').replace('>', '')) : message.mentions.members.first() : null
            if(!target) return crossText(`Не указан или не найден пользователь`, message)
            if(target.id == message.member.id) return crossText(`Вы не можете взаимодействовать сами с собой`, message)

            let text = args.splice(1).join(" ")
            msg = `${message.member} и ${target} занялись любовью`
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
            .setDescription(`${message.member} **предложил(а) заняться любовью** ${target}`)

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
                    .setDescription(`${target} **отказал(а) в вашем предложении заняться любовью**`)
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
