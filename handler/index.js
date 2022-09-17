const { glob } = require("glob");
const { promisify } = require("util");

const globPromise = promisify(glob);

/**
 * @param {Client} bot
 */
module.exports = async (bot) => {
    // Commands
    const commandFiles = await globPromise(`${process.cwd()}/commands/**/*.js`);
    commandFiles.map((value) => {
        const file = require(value);
        const splitted = value.split("/");
        const directory = splitted[splitted.length - 2];

        if (file.name) {
            const properties = { directory, ...file };
            bot.commands.set(file.name, properties);
        }
    });

    // Events
    const eventFiles = await globPromise(`${process.cwd()}/events/*.js`);
    eventFiles.map((value) => require(value));


    // Slash Commands
    const slashCommands = await globPromise(
        `${process.cwd()}/SlashCommands/*/*.js`
    );

    const arrayOfSlashCommands = [];
    slashCommands.map((value) => {
        const file = require(value);
        if (!file?.name) return;
        bot.slashCommands.set(file.name, file);

        if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
        arrayOfSlashCommands.push(file);
    });
    bot.on("ready", async () => {
        // bot.guilds.cache.forEach(async (guild) => {
        //     await bot.guilds.cache
        //         .get(guild.id)
        //         .commands.set(arrayOfSlashCommands);
        // });

        // Register for a single guild
        await bot.guilds.cache
            .get("914124553960194059")
            .commands.set(arrayOfSlashCommands);

        if(bot.user.id == "914124666258464768"){
            await bot.guilds.cache
                .get("705508214019588116")
                .commands.set(arrayOfSlashCommands);
        }

        //Register for all the guilds the bot is in. 1 horr
        //await bot.application.commands.set(arrayOfSlashCommands);
    });

};
