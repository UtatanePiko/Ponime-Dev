const Discord = require("discord.js");
const bot = new Discord.Client({ 
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MEMBERS,
        Discord.Intents.FLAGS.GUILD_BANS,
        Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
        Discord.Intents.FLAGS.GUILD_WEBHOOKS,
        Discord.Intents.FLAGS.GUILD_INVITES,
        Discord.Intents.FLAGS.GUILD_VOICE_STATES,
        Discord.Intents.FLAGS.GUILD_PRESENCES,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.DIRECT_MESSAGES,
        Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING,
        Discord.Intents.FLAGS.GUILD_SCHEDULED_EVENTS,
    ],
    disableEveryone: true
});
const discordModals = require('discord-modals');
discordModals(bot)
module.exports = bot;

// Global Variables
bot.commands = new Discord.Collection();
bot.slashCommands = new Discord.Collection();
bot.clearState = new Discord.Collection();
bot.spamMap = new Discord.Collection()
bot.capsMap = new Discord.Collection()
bot.server = new Discord.Collection()
bot.reviews = new Discord.Collection()
bot.roulette = new Discord.Collection()

// Initializing the project
require("./handler")(bot);

require('dotenv').config()
//bot.login(process.env.BOT_TOKEN)
bot.login("ODU0MzY5NzAxODk0MDI5MzIy.YMi7yg.Ke5sYwU1PWUj5UsNMfaV1dbAF2o")
