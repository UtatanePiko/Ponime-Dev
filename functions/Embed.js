const chalk = require('chalk')
const Discord = require('discord.js')
const Util = require('../functions/Util')
const cross = Util.findEmoji('cross4')
const clock = Util.findEmoji('clock')
const checkmark = Util.findEmoji('checkmark4')

class Embeds{
    constructor(options) {

        if (!options.embedTitle) throw new TypeError('Отсутствует аргумент embedTitle')
        if (!options.description) throw new TypeError('Отсутствует аргумент description')
        if (!options.embedColor) throw new TypeError('Отсутствует аргумент embedColor')
        if (!options.message) throw new TypeError('Отсутствует аргумент message')

        this.message = options.message
        this.embedColor = options.embedColor
        this.embedTitle = options.embedTitle
        this.description = options.description
        this.arguments = options.arguments
        this.alternatives = options.alternatives
        this.examples = options.examples
        this.hints = options.hints
    }

    async help(){
        const embed = new Discord.MessageEmbed()
        .setTitle(this.embedTitle)
        .setDescription(this.description)
        .setColor(this.embedColor)
        if(this.arguments !== undefined) embed.addField(`Аргументы`, this.arguments)
        if(this.alternatives !== undefined) embed.addField(`Альтернативы`, this.alternatives)
        if(this.examples !== undefined) embed.addField(`Примеры`, this.examples)
        if(this.hints !== undefined) embed.addField(`Пояснения`, this.hints)

        await this.message.reply({embeds: [embed] })
    }
}

module.exports = {

    async crossText(text, message){
        let embed = new Discord.MessageEmbed()
        .setDescription(`${cross} ${text}`)
        .setColor("#922a37")
        await message.reply({ embeds: [embed] })
    },

    async noPerms(message){
        let embed = new Discord.MessageEmbed()
        .setDescription(`${cross} У вас недостаточно прав для использования данной команды!`)
        .setColor("#922a37")
        await message.reply({ embeds: [embed] })
    },

    async checkmarkText(text, message, title){
        let embed = new Discord.MessageEmbed()
        .setDescription(`${checkmark} ${text}`)
        .setColor("#00ae5d")
        if(title) embed.setTitle(title)
        await message.reply({ embeds: [embed] })
    },

    async clockText(text, message){
        let embed = new Discord.MessageEmbed()
        .setDescription(`${clock} ${text}`)
        .setColor("#cac719")
        await message.reply({ embeds: [embed] })
    },

    async noColorEmbed(text){
        let embed = new Discord.MessageEmbed()
        .setDescription(`${text}`)
        .setColor("#2F3136")
        return embed
    },

    Embeds
}
