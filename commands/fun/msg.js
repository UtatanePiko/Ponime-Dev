const chalk = require('chalk')
module.exports = {
    name: "msg",
    description: "Описание команд",
    run: async (bot, message, args) => {

        if(message.author.id != "329462919676821504") return
        message.delete()

        try {

            const {noColor, botColorMessage} = require('../../functions/Colours')
            const {crossText}= require('../../functions/Embed')
            const Discord = require('discord.js')
            const fs = require('fs')
            const {registerFont} = require('canvas')
            const path = require('path')
            const axios = require('axios')
            const User = require('../../models/user')
            const Guild = require('../../models/guild')
            const Util = require('../../functions/Util')
            const fetch = require('node-fetch')
            const cross = Util.findEmoji("text_no")
            const coin = Util.findEmoji('CHPOKI_COIN')
            const dateFormat = require("dateformat")
            const Events = require('../../models/events')
            const mongoose = require('mongoose')
            const {
                INSTAGRAM_SELECT_MENU, 
                STATUS_SELECT_MENU,
                POS_SELECT_MENU,
                GAMES1_SELECT_MENU,
                GAMES2_SELECT_MENU,
                GAMES3_SELECT_MENU,
                WATCH_SELECT_MENU,
                VACATION_SELECT_MENU,
                CHAT_INFO__SELECT_MENU,
                FAQ_SELECT_MENU,
                INFO_SELECT_MENU
            } = require('../../functions/Buttons')
            
            if(args[0] == '1'){
                let status1 = message.guild.roles.cache.get('992500237711192124') || message.guild.roles.cache.get('802517034708762645')
                let status2 = message.guild.roles.cache.get('992500245374181477') || message.guild.roles.cache.get('802517420027805716')
                let status3 = message.guild.roles.cache.get('992500253909598248') || message.guild.roles.cache.get('802516897232060446')
                let status4 = message.guild.roles.cache.get('992500261723590738') || message.guild.roles.cache.get('802517416147419157')
                let status5 = message.guild.roles.cache.get('992500269629845554') || message.guild.roles.cache.get('805965834463084554')
                let statusEmbed = new Discord.MessageEmbed().setColor(noColor())
                .setDescription(`👩‍❤️‍👨 ${status1}\n👱‍♀️ ${status2}\n👫 ${status3}\n🧑 ${status4}\n🤬 ${status5}⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ `)

                await message.channel.send({
                    files: [`https://imgur.com/tjjVp2l.png`],
                    embeds: [statusEmbed],
                    components: [STATUS_SELECT_MENU()]
                })

                let inst1 = message.guild.roles.cache.get('992500202781016144') || message.guild.roles.cache.get('802518371517726730')
                let inst2 = message.guild.roles.cache.get('992500220682313858') || message.guild.roles.cache.get('802518524450570281')
                let inst3 = message.guild.roles.cache.get('992500229058347118') || message.guild.roles.cache.get('803069285647384576')
                let shiba_love = Util.findEmoji('shiba_love')
                let shiba_angry = Util.findEmoji('shiba_angry')
                let shiba_what = Util.findEmoji('shiba_question')
                let instEmbed = new Discord.MessageEmbed().setColor(noColor())
                .setDescription(`${shiba_love} ${inst1}\n${shiba_angry} ${inst2}\n${shiba_what} ${inst3}⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣`)

                await message.channel.send({
                    files: [`https://imgur.com/w7Uw0Wx.png`],
                    embeds: [instEmbed],
                    components: [INSTAGRAM_SELECT_MENU()]
                })

                let pos_1_role = message.guild.roles.cache.get('992500276659490849') || message.guild.roles.cache.get('802519536225484811')
                let pos_2_role = message.guild.roles.cache.get('992500286985863219') || message.guild.roles.cache.get('802519680010158080')
                let pos_3_role = message.guild.roles.cache.get('1010312171751735416') || message.guild.roles.cache.get('802519680857276429')
                let pos_4_role = message.guild.roles.cache.get('1010312205767540787') || message.guild.roles.cache.get('802519682585985024')
                let pos_5_role = message.guild.roles.cache.get('1010312214323929198') || message.guild.roles.cache.get('802519747177742346')
                let pos_1_emoji = Util.findEmoji('pos_1')
                let pos_2_emoji = Util.findEmoji('pos_2')
                let pos_3_emoji = Util.findEmoji('pos_3')
                let pos_4_emoji = Util.findEmoji('pos_4')
                let pos_5_emoji = Util.findEmoji('pos_5')
                let posEmbed = new Discord.MessageEmbed().setColor(noColor())
                .setDescription(`${pos_1_emoji} ${pos_1_role}\n${pos_2_emoji} ${pos_2_role}\n${pos_3_emoji} ${pos_3_role}\n${pos_4_emoji} ${pos_4_role}\n${pos_5_emoji} ${pos_5_role}⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣`)

                await message.channel.send({
                    files: [`https://imgur.com/oh4Q1PH.png`],
                    embeds: [posEmbed],
                    components: [POS_SELECT_MENU()]
                })

                let dota2 = message.guild.roles.cache.get('1010312220783149246') || message.guild.roles.cache.get('803069284275716097')
                let csgo = message.guild.roles.cache.get('1010312229276618843') || message.guild.roles.cache.get('802670397442490449')
                let gta5 = message.guild.roles.cache.get('1010312235370954782') || message.guild.roles.cache.get('830797818309640193')
                let osu = message.guild.roles.cache.get('1010312242576756797') || message.guild.roles.cache.get('802672486633701436')
                let overwatch = message.guild.roles.cache.get('1010312250139082823') || message.guild.roles.cache.get('826218435934945330')
                let apex = message.guild.roles.cache.get('1010312256455708754') || message.guild.roles.cache.get('813178039118463046')
                let games = message.guild.roles.cache.get('1010312262726189216') || message.guild.roles.cache.get('815668323081256990')
                let minecraft = message.guild.roles.cache.get('1010312269537747024') || message.guild.roles.cache.get('803066381121749042')
                let pubg = message.guild.roles.cache.get('1010312275862753300') || message.guild.roles.cache.get('815668506330398767')
                let fortnite = message.guild.roles.cache.get('1010312281806090303') || message.guild.roles.cache.get('815668320388382721')
                let dota2_emoji = Util.findEmoji('dota2')
                let csgo_emoji = Util.findEmoji('csgo')
                let gta5_emoji = Util.findEmoji('gta5')
                let osu_emoji = Util.findEmoji('osu')
                let overwatch_emoji = Util.findEmoji('overwatch')
                let apex_emoji = Util.findEmoji('apex_legends')
                let games_emoji = Util.findEmoji('games_folder')
                let minecraft_emoji = Util.findEmoji('minecraft')
                let fortnite_emoji = Util.findEmoji('fortnite')
                let pubg_emoji = Util.findEmoji('pubg')
                let games1Embed = new Discord.MessageEmbed().setColor(noColor())
                .setFields(
                    {name: '⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ', value: `${dota2_emoji} ${dota2}\n${csgo_emoji} ${csgo}\n${gta5_emoji} ${gta5}\n${osu_emoji} ${osu}\n${overwatch_emoji} ${overwatch}`, inline: true},
                    {name: '\u200B', value: `${apex_emoji} ${apex}\n${games_emoji} ${games}\n${minecraft_emoji} ${minecraft}\n${fortnite_emoji} ${pubg}\n${pubg_emoji} ${fortnite}`, inline: true}
                )

                await message.channel.send({
                    files: [`https://imgur.com/eBUzFWy.png`],
                    embeds: [games1Embed],
                    components: [GAMES1_SELECT_MENU()]
                })

                let valorant = message.guild.roles.cache.get('1010312287531323545') || message.guild.roles.cache.get('815668505529548882')
                let dbd = message.guild.roles.cache.get('1010312293843738635') || message.guild.roles.cache.get('815668322426683432')
                let rainbow6 = message.guild.roles.cache.get('1010312299950637077') || message.guild.roles.cache.get('826218607935225867')
                let dont_starve = message.guild.roles.cache.get('1010312308226011346') || message.guild.roles.cache.get('916458389490511902')
                let cod = message.guild.roles.cache.get('1010312315536670770') || message.guild.roles.cache.get('868249561091690538')
                let rust = message.guild.roles.cache.get('1010312322344026122') || message.guild.roles.cache.get('830843657262334024')
                let terraria = message.guild.roles.cache.get('1010312328220266586') || message.guild.roles.cache.get('830843650228486154')
                let wow = message.guild.roles.cache.get('1010312333857398925') || message.guild.roles.cache.get('868249465142796328')
                let genshin = message.guild.roles.cache.get('1010312341222596648') || message.guild.roles.cache.get('826216120045797427')
                let lol = message.guild.roles.cache.get('1010312348306788432') || message.guild.roles.cache.get('826218767742402592')
                let valorant_emoji = Util.findEmoji('valorant')
                let dbd_emoji = Util.findEmoji('dbd')
                let rainbow6_emoji = Util.findEmoji('rainbow6')
                let dont_starve_emoji = Util.findEmoji('dont_starve')
                let cod_emoji = Util.findEmoji('cod_warzone')
                let rust_emoji = Util.findEmoji('rust')
                let terraria_emoji = Util.findEmoji('terraria')
                let wow_emoji = Util.findEmoji('wow')
                let genshin_emoji = Util.findEmoji('genshin_impact')
                let lol_emoji = Util.findEmoji('lol')
                let games2Embed = new Discord.MessageEmbed().setColor(noColor())
                .setFields(
                    {name: '⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣', value: `${valorant_emoji} ${valorant}\n${dbd_emoji} ${dbd}\n${rainbow6_emoji} ${rainbow6}\n${dont_starve_emoji} ${dont_starve}\n${cod_emoji} ${cod}`, inline: true},
                    {name: '\u200B', value: `${rust_emoji} ${rust}\n${terraria_emoji} ${terraria}\n${wow_emoji} ${wow}\n${genshin_emoji} ${genshin}\n${lol_emoji} ${lol}`, inline: true}
                )

                await message.channel.send({
                    files: [`https://imgur.com/mQ97uTe.png`],
                    embeds: [games2Embed],
                    components: [GAMES2_SELECT_MENU()]
                })

                let amongus = message.guild.roles.cache.get('1010312354761805920') || message.guild.roles.cache.get('896761741038473226')
                let brawl = message.guild.roles.cache.get('1010313415371268106') || message.guild.roles.cache.get('991457427608305735')
                let hearthstone = message.guild.roles.cache.get('1010313422770012181') || message.guild.roles.cache.get('896764012933574678')
                let phasmaphobia = message.guild.roles.cache.get('1010313431796162692') || message.guild.roles.cache.get('872986442241040465')
                let mobile_legends = message.guild.roles.cache.get('1010313438322491485') || message.guild.roles.cache.get('884553790374699008')
                let tarkov = message.guild.roles.cache.get('1010313445377323118') || message.guild.roles.cache.get('872986283725688903')
                let amongus_emoji = Util.findEmoji('among_us')
                let brawl_emoji = Util.findEmoji('brawl_stars')
                let hearthstone_emoji = Util.findEmoji('hearthstone')
                let phasmaphobia_emoji = Util.findEmoji('phasmophobia')
                let mobile_legends_emoji = Util.findEmoji('mobile_legends')
                let tarkov_emoji = Util.findEmoji('escape_from_tarkov')
                let games3Embed = new Discord.MessageEmbed().setColor(noColor())
                .setFields(
                    {name: '⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣', 
                    value: `${amongus_emoji} ${amongus}\n${brawl_emoji} ${brawl}\n${hearthstone_emoji} ${hearthstone}`, inline: true},
                    {name: '\u200B', value: `${phasmaphobia_emoji} ${phasmaphobia}\n${mobile_legends_emoji} ${mobile_legends}\n${tarkov_emoji} ${tarkov}`, inline: true}
                )

                await message.channel.send({
                    files: [`https://imgur.com/IH4PeHL.png`],
                    embeds: [games3Embed],
                    components: [GAMES3_SELECT_MENU()]
                })

                let watch1 = message.guild.roles.cache.get('1010347096152473680') || message.guild.roles.cache.get('812993501620994118')
                let watch2 = message.guild.roles.cache.get('1010347105514160218') || message.guild.roles.cache.get('812993391427059713')
                let watch3 = message.guild.roles.cache.get('1010347114196369458') || message.guild.roles.cache.get('812993427536216076')
                let watch1_emoji = Util.findEmoji('vse')
                let watch2_emoji = Util.findEmoji('anime')
                let watch3_emoji = Util.findEmoji('films')
                let watchEmbed = new Discord.MessageEmbed().setColor(noColor())
                .setDescription(`${watch1_emoji} ${watch1}\n${watch2_emoji} ${watch2}\n${watch3_emoji} ${watch3}⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ `)

                await message.channel.send({
                    files: [`https://imgur.com/LHvFBih.png`],
                    embeds: [watchEmbed],
                    components: [WATCH_SELECT_MENU()]
                })
            }

            if(args[0] == '2'){
                message.channel.send({
                    files: ['https://imgur.com/bG042Je.png'],
                    components: [VACATION_SELECT_MENU()]
                })
            }

            if(args[0] == '3'){
                message.channel.send({
                    files: ['https://imgur.com/RL2fgn2.png'],
                    components: [CHAT_INFO__SELECT_MENU()]
                })
            }

            if(args[0] == '4'){
                message.channel.send({
                    files: ['https://imgur.com/oltXT82.png'],
                    components: [FAQ_SELECT_MENU()]
                })
            }

            if(args[0] == '5'){
                message.channel.send({
                    files: ['https://imgur.com/eeTstIQ.png'],
                    components: [INFO_SELECT_MENU()]
                })
            }

        }catch(err){
            console.error(chalk.redBright(err.stack))
            console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
        }
    }
}
