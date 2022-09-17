const bot = require('..')
const User = require('../models/user')
const mongoose = require('mongoose')
const MongoFunc = require('../functions/MongoFunc')
const chalk = require('chalk')
const {Permissions} = require('discord.js')

bot.on('voiceStateUpdate', async (oldMember, newMember) => {

    if(newMember.guild.id != "914124553960194059" && newMember.guild.id != "705508214019588116") return

    if(newMember.channelId == newMember.guild.afkChannelId) return

    try{
        if(newMember.member.user.bot) return

        MongoFunc.createUser(newMember.id, newMember.guild.id)

        setTimeout(async() => {
            await User.findOne({guildID: newMember.guild.id, userID: newMember.id}).then(user => {
                if(user == null) return
                user.voice_active = true
                user.save().catch(err => console.error(err))
            })
        }, 1000)

        if(newMember.channelId == null){
            setTimeout(async() => {
                await User.findOne({guildID: newMember.guild.id, userID: newMember.id}).then(user => {
                    if(user == null) return
                    user.voice_active = false
                    user.save().catch(err => console.error(err))
                })
            }, 1000)
        }

    }catch(err){
        console.error(chalk.redBright(err.stack))
        console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
    }
})