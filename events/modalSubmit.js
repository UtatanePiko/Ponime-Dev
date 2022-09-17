const bot = require("..");
const chalk = require('chalk')
const Discord = require('discord.js')
const Reviews = require('../models/reviews')
const mongoose = require('mongoose')
const Util = require('../functions/Util')
bot.on("modalSubmit", async (modal) => {
    
    try{

        if(modal.customId == 'review_modal'){
            let getReviewInfo = bot.reviews.get(modal.user.id)
            const isPositive = 
            //modal.getSelectMenuValues('review_style') == 'positive' ? true : false || 
            getReviewInfo.type == 'positive' ? true : false
            const review = modal.getTextInputValue('review')
            const checkReview = await Reviews.findOne({guildID: modal.guild.id, userID: getReviewInfo.userID, from_userID: modal.user.id}, {})
            let like = Util.findEmoji("like")
            let dislike = Util.findEmoji("dislike")
            modal.reply({ content: `Спасибо, что оставили ваш отзыв на данного человека!`, ephemeral: true})

            let lastID = await Reviews.findOne().sort({"_id":-1}).limit(1).lean()
            //let embed = new Discord.MessageEmbed().setTitle(`${!checkReview ? `Новый отзыв №${parseInt(lastID.ID) + 1}` : `Отзыв изменен №${checkReview.ID}`}`).setColor("#00ae5d")
            //.setDescription(`**Тип отзыва:** ${isPositive ? `позитивный ${like}` : `отрицательный ${dislike}`}\n**Отзыв:** ${review}`)
            let findMem = modal.guild.members.cache.get(getReviewInfo.userID)
            if(findMem) findMem.send({
                content: !checkReview ? `У вас новый отзыв **№${lastID.ID}**` : `Ваш отзыв **№${checkReview.ID}** был изменен`
            }).catch(err => {console.log(`Не удалось отправить уведомление об отзыве пользователю ${findMem.displayName}`)})
            // bot.guilds.cache.get('914124553960194059').channels.cache.get('962400061441056799').send({
            //     content: `${modal.member} оставил **${isPositive ? "положительный" : "негативый"}** отзыв на ${modal.guild.members.cache.get(getReviewInfo.userID)}\nСодержание отзыва: ${review}`
            // })
            if(!checkReview){
                let newReview = new Reviews({
                    _id: mongoose.Types.ObjectId(),
                    ID: lastID ? lastID.ID + 1 : 0,
                    date: Date.now(),
                    guildID: getReviewInfo.guildID,
                    userID: getReviewInfo.userID,
                    from_userID: modal.user.id,
                    positive: isPositive,
                    review: review.trim()
                })
                newReview.save().catch()
            } else {
                checkReview.positive = isPositive
                checkReview.review = review
                checkReview.save().catch()
            }
        }

    }catch(err){
        console.error(chalk.redBright(err.stack))
        console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
    }

});