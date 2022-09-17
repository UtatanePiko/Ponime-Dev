const { Client, CommandInteraction, ContextMenuInteraction, Message } = require("discord.js");
const { Modal, TextInputComponent, SelectMenuComponent, showModal } = require('discord-modals')
//const {findEmoji} = require('../../functions/Util')
// const checkmark = findEmoji('checkmark4')
// const cross = findEmoji('cross4')
const Reviews = require('../../models/reviews')
module.exports = {
    name: "отзыв-удалить",
    description: "Удалить свой отзыв с пользователя",
    options: [
        {
            name: "user",
            type: "USER",
            description: "Укажите пользователя, у которого хотите укдалить свой отзыв",
            required: true
        },
    ],
    /**
     *
     * @param {Client} bot
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (bot, interaction, args) => {
        // interaction.followUp({ content: `${bot.ws.ping}ms!` });
        const [ user ] = args;
        let target = interaction.guild.members.cache.get(user)
        if(target.user.id === interaction.user.id) return await interaction.reply({ content: `Вы не можете написать отзыв на самого себя`, ephemeral: true});
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
        if(!check) return interaction.reply({ content: `У этого пользователя нет отзывов от вас`, ephemeral: true});
        interaction.reply({content: `Ваш отзыв был успешно удален у ${target}`, ephemeral: true})
        await Reviews.findOneAndDelete({guildID: interaction.guild.id, userID: target.user.id, from_userID: interaction.user.id})
    },
};
