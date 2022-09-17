const { Client, CommandInteraction, ContextMenuInteraction } = require("discord.js");
const { Modal, TextInputComponent, SelectMenuComponent, showModal } = require('discord-modals')
//const {findEmoji} = require('../../functions/Util')
// const checkmark = findEmoji('checkmark4')
// const cross = findEmoji('cross4')
const Reviews = require('../../models/reviews')
module.exports = {
    name: "👎 Отзыв",
    type: 'USER',
    /**
     *
     * @param {Client} bot
     * @param {ContextMenuInteraction} interaction
     * @param {String[]} args
     */
    run: async (bot, interaction, args) => {
        // interaction.followUp({ content: `${bot.ws.ping}ms!` });
        let target = interaction.guild.members.cache.get(interaction.targetId)
        let type = 'negative'
        if(target.user.id === interaction.user.id) return interaction.reply({ content: `Вы не можете написать отзыв на самого себя`, ephemeral: true});
        let eventManagerRole = interaction.guild.roles.cache.get('880962761415352390') || interaction.guild.roles.cache.get('996781830386745374')
        let control = interaction.guild.roles.cache.get('1002328129798414356') || interaction.guild.roles.cache.get('829376653795786752')
        let heplerRole = interaction.guild.roles.cache.get('830896489215688714') || interaction.guild.roles.cache.get('961566445618216960')
        let moderRole = interaction.guild.roles.cache.get('803053033259794482') || interaction.guild.roles.cache.get('925688128558223370')
        let ownerRole = interaction.guild.roles.cache.get('723369057281114162') || interaction.guild.roles.cache.get('963036787163418715')
        if(
            !target.roles.cache.has(eventManagerRole.id)
            && !target.roles.cache.has(control.id)
            && !target.roles.cache.has(heplerRole.id)
            && !target.roles.cache.has(moderRole.id)
            && !target.roles.cache.has(ownerRole.id)
        ) return interaction.reply({ content: `Отзывы можно оставлять лишь на персонал сервера`, ephemeral: true});
        let checkReview = await Reviews.findOne({guildID: interaction.guild.id, userID: target.user.id, from_userID: interaction.user.id}, {}).lean()   
        let check = checkReview ? true : false
        //if(checkReview) return interaction.reply({ content: `Вы не можете писать больше одного отзыва на одного и того же человека`, ephemeral: true});


        const modal = new Modal()
        .setCustomId('review_modal')
        .setTitle(`Отрицательный отзыв на ${target.user.username}`)
        .addComponents(
            // new SelectMenuComponent()
            // .setCustomId('review_style')
            // .setPlaceholder('Ваш отзыв положительный или отрицательный?')
            // .setMinValues(1)
            // .setMaxValues(1)
            // .addOptions(
            //     {
            //         label: "Положительный",
            //         value: "positive",
            //         //emoji: checkmark
            //     },
            //     {
            //         label: "Отрицательный",
            //         value: "negative",
            //         //emoji: cross
            //     }
            // ),
            new TextInputComponent()
            .setCustomId('review')
            .setLabel('Отзыв')
            .setStyle('LONG')
            .setMinLength(1)
            .setMaxLength(256)
            .setPlaceholder(`${check == 0 ? `Напишите здесь свой отзыв` : `Написав новый отзыв, старый будет заменен на новый`}`)
            .setRequired(true)
        );

        bot.reviews.set(interaction.user.id, {
            guildID: interaction.guild.id,
            userID: target.user.id,
            type: type
        })

        setTimeout(() => {
            bot.reviews.delete(interaction.user.id)
        }, 1000 * 60 * 10)

        showModal(modal,{
            client: bot,
            interaction: interaction
        })
    },
};
