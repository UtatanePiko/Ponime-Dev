module.exports = {
    name: "setbanner",
    description: "Описание команд",
    aliases: ["sb"],
    run: async (bot, message, args) => {

        if(message.author.id !== "329462919676821504") return message.channel.send('Будет доделано позже')

        const Discord = require("discord.js");
        const Canvas = require('canvas')
        const canvas = Canvas.createCanvas(955, 538);
        const ctx = canvas.getContext('2d')

        // Задний фон ----------------------------------------------------
        const background = await Canvas.loadImage('https://i.imgur.com/PaMUqjO.gifv')
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        // Текст
            // Vars
            ctx.globalAlpha = 1;
            ctx.font = '65px "Impact"'
            ctx.lineWidth = 1
            ctx.fillStyle = "#FFFFFF"
            ctx.textAlign = "left";

            // Members Count
            ctx.fillText(message.guild.memberCount, 440, 480);

            const voiceChannels = message.guild.channels.cache.filter(c => c.type === 'GUILD_VOICE');
            let count = 0
            
            for (const [id, voiceChannel] of voiceChannels) count += voiceChannel.members.size;
            
            console.log(count)

            // Voice Members Count
            ctx.fillText(count, 765, 480);


        // Создание сообщения ----------------------------------------------------
        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'rank-card.png');
        message.channel.send({ files: [attachment] }); 
    }
}
