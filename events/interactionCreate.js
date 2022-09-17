const bot = require("..");
const Discord = require('discord.js')
const { noColor } = require('../functions/Colours')
const {
    STATUS_SELECT_MENU,
    INSTAGRAM_SELECT_MENU,
    POS_SELECT_MENU,
    GAMES1_SELECT_MENU,
    GAMES2_SELECT_MENU,
    GAMES3_SELECT_MENU,
    WATCH_SELECT_MENU,
    VACATION_SELECT_MENU,
    VACTION_LINK_BUTTON,
    CHAT_INFO__SELECT_MENU,
    FAQ_SELECT_MENU,
    INSTRUCTIONS_LINK_BUTTON,
    INFO_SELECT_MENU,
    SOCIAL_LINK_BUTTONS,
    REVIEW_SITE_LINK_BUTTON
} = require('../functions/Buttons')
const Util = require('../functions/Util')
bot.on("interactionCreate", async (interaction) => {
    // Slash Command Handling
    if (interaction.isCommand()) {
        //await interaction.deferReply({ ephemeral: false }).catch(() => {});

        const cmd = bot.slashCommands.get(interaction.commandName);
        if (!cmd)
            return interaction.followUp({ content: "An error has occured " });

        const args = [];

        for (let option of interaction.options.data) {
            if (option.type === "SUB_COMMAND") {
                if (option.name) args.push(option.name);
                option.options?.forEach((x) => {
                    if (x.value) args.push(x.value);
                });
            } else if (option.value) args.push(option.value);
        }
        interaction.member = interaction.guild.members.cache.get(interaction.user.id);

        cmd.run(bot, interaction, args);
    }

    // Context Menu Handling
    if (interaction.isContextMenu()) {
        //await interaction.deferReply({ ephemeral: true });
        const command = bot.slashCommands.get(interaction.commandName);
        if (command) command.run(bot, interaction);
    }
    
    // STATUS SELECT-MENU
    if(interaction.customId == 'status_select'){
        await interaction.deferUpdate()
        await interaction.editReply({components: [STATUS_SELECT_MENU()]})
        let role1 = interaction.guild.roles.cache.get('992500237711192124') || interaction.guild.roles.cache.get('802517034708762645')
        let role2 = interaction.guild.roles.cache.get('992500245374181477') || interaction.guild.roles.cache.get('802517420027805716')
        let role3 = interaction.guild.roles.cache.get('992500253909598248') || interaction.guild.roles.cache.get('802516897232060446')
        let role4 = interaction.guild.roles.cache.get('992500261723590738') || interaction.guild.roles.cache.get('802517416147419157')
        let role5 = interaction.guild.roles.cache.get('992500269629845554') || interaction.guild.roles.cache.get('805965834463084554')
        if(interaction.values[0] == '1'){
            let hasRole = Boolean(interaction.member.roles.cache.has(role1.id))
            await interaction.followUp({
                content: !hasRole ? `${interaction.member} была выдана роль ${role1}` : `${interaction.member} была убрана роль ${role1}`,
                ephemeral: true
            })
            hasRole ? interaction.member.roles.remove(role1.id) : interaction.member.roles.add(role1.id)
            if(interaction.member.roles.cache.has(role2.id)) interaction.member.roles.remove(role2.id)
            if(interaction.member.roles.cache.has(role3.id)) interaction.member.roles.remove(role3.id)
            if(interaction.member.roles.cache.has(role4.id)) interaction.member.roles.remove(role4.id)
            if(interaction.member.roles.cache.has(role5.id)) interaction.member.roles.remove(role5.id)
        } else if(interaction.values[0] == '2'){
            let hasRole = Boolean(interaction.member.roles.cache.has(role2.id))
            await interaction.followUp({
                content: !hasRole ? `${interaction.member} была выдана роль ${role2}` : `${interaction.member} была убрана роль ${role2}`,
                ephemeral: true
            })
            hasRole ? interaction.member.roles.remove(role2.id) : interaction.member.roles.add(role2.id)
            if(interaction.member.roles.cache.has(role1.id)) interaction.member.roles.remove(role1.id)
            if(interaction.member.roles.cache.has(role3.id)) interaction.member.roles.remove(role3.id)
            if(interaction.member.roles.cache.has(role4.id)) interaction.member.roles.remove(role4.id)
            if(interaction.member.roles.cache.has(role5.id)) interaction.member.roles.remove(role5.id)
        } else if(interaction.values[0] == '3'){
            let hasRole = Boolean(interaction.member.roles.cache.has(role3.id))
            await interaction.followUp({
                content: !hasRole ? `${interaction.member} была выдана роль ${role3}` : `${interaction.member} была убрана роль ${role3}`,
                ephemeral: true
            })
            hasRole ? interaction.member.roles.remove(role3.id) : interaction.member.roles.add(role3.id)
            if(interaction.member.roles.cache.has(role2.id)) interaction.member.roles.remove(role2.id)
            if(interaction.member.roles.cache.has(role1.id)) interaction.member.roles.remove(role1.id)
            if(interaction.member.roles.cache.has(role4.id)) interaction.member.roles.remove(role4.id)
            if(interaction.member.roles.cache.has(role5.id)) interaction.member.roles.remove(role5.id)
        } else if(interaction.values[0] == '4'){
            let hasRole = Boolean(interaction.member.roles.cache.has(role4.id))
            await interaction.followUp({
                content: !hasRole ? `${interaction.member} была выдана роль ${role4}` : `${interaction.member} была убрана роль ${role4}`,
                ephemeral: true
            })
            hasRole ? interaction.member.roles.remove(role4.id) : interaction.member.roles.add(role4.id)
            if(interaction.member.roles.cache.has(role2.id)) interaction.member.roles.remove(role2.id)
            if(interaction.member.roles.cache.has(role3.id)) interaction.member.roles.remove(role3.id)
            if(interaction.member.roles.cache.has(role1.id)) interaction.member.roles.remove(role1.id)
            if(interaction.member.roles.cache.has(role5.id)) interaction.member.roles.remove(role5.id)
        } else if(interaction.values[0] == '5'){
            let hasRole = Boolean(interaction.member.roles.cache.has(role5.id))
            await interaction.followUp({
                content: !hasRole ? `${interaction.member} была выдана роль ${role5}` : `${interaction.member} была убрана роль ${role5}`,
                ephemeral: true
            })
            hasRole ? interaction.member.roles.remove(role5.id) : interaction.member.roles.add(role5.id)
            if(interaction.member.roles.cache.has(role2.id)) interaction.member.roles.remove(role2.id)
            if(interaction.member.roles.cache.has(role3.id)) interaction.member.roles.remove(role3.id)
            if(interaction.member.roles.cache.has(role4.id)) interaction.member.roles.remove(role4.id)
            if(interaction.member.roles.cache.has(role1.id)) interaction.member.roles.remove(role1.id)
        }
    }

    // INSTAGRAM SELECT-MENU
    if(interaction.customId == 'instagram_select'){
        let inst1 = interaction.guild.roles.cache.get('992500202781016144') || interaction.guild.roles.cache.get('802518371517726730')
        let inst2 = interaction.guild.roles.cache.get('992500220682313858') || interaction.guild.roles.cache.get('802518524450570281')
        let inst3 = interaction.guild.roles.cache.get('992500229058347118') || interaction.guild.roles.cache.get('803069285647384576')
        let shiba_love = Util.findEmoji('shiba_love')
        let shiba_angry = Util.findEmoji('shiba_angry')
        let shiba_what = Util.findEmoji('shiba_question')
        let instEmbed = new Discord.MessageEmbed().setColor(noColor())
        .setDescription(`${shiba_love} ${inst1}\n${shiba_angry} ${inst2}\n${shiba_what} ${inst3}⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣`)

        await interaction.deferUpdate()
        await interaction.editReply({
            embeds: [instEmbed],
            components: [INSTAGRAM_SELECT_MENU()]
        })
        let role1 = interaction.guild.roles.cache.get('992500202781016144') || interaction.guild.roles.cache.get('802518371517726730')
        let role2 = interaction.guild.roles.cache.get('992500220682313858') || interaction.guild.roles.cache.get('802518524450570281')
        let role3 = interaction.guild.roles.cache.get('992500229058347118') || interaction.guild.roles.cache.get('803069285647384576')
        if(interaction.values[0] == '1'){
            let hasRole = Boolean(interaction.member.roles.cache.has(role1.id))
            await interaction.followUp({
                content: !hasRole ? `${interaction.member} была выдана роль ${role1}` : `${interaction.member} была убрана роль ${role1}`,
                ephemeral: true
            })
            hasRole ? interaction.member.roles.remove(role1.id) : interaction.member.roles.add(role1.id)
            if(interaction.member.roles.cache.has(role2.id)) interaction.member.roles.remove(role2.id)
            if(interaction.member.roles.cache.has(role3.id)) interaction.member.roles.remove(role3.id)
        } else if(interaction.values[0] == '2'){
            let hasRole = Boolean(interaction.member.roles.cache.has(role2.id))
            await interaction.followUp({
                content: !hasRole ? `${interaction.member} была выдана роль ${role2}` : `${interaction.member} была убрана роль ${role2}`,
                ephemeral: true
            })
            hasRole ? interaction.member.roles.remove(role2.id) : interaction.member.roles.add(role2.id)
            if(interaction.member.roles.cache.has(role1.id)) interaction.member.roles.remove(role1.id)
            if(interaction.member.roles.cache.has(role3.id)) interaction.member.roles.remove(role3.id)
        } else if(interaction.values[0] == '3'){
            let hasRole = Boolean(interaction.member.roles.cache.has(role3.id))
            await interaction.followUp({
                content: !hasRole ? `${interaction.member} была выдана роль ${role3}` : `${interaction.member} была убрана роль ${role3}`,
                ephemeral: true
            })
            hasRole ? interaction.member.roles.remove(role3.id) : interaction.member.roles.add(role3.id)
            if(interaction.member.roles.cache.has(role2.id)) interaction.member.roles.remove(role2.id)
            if(interaction.member.roles.cache.has(role1.id)) interaction.member.roles.remove(role1.id)
        }
    }

    // Dota 2 positions SELECT-MENU
    if(interaction.customId == 'pos_select'){
        let pos_1_role = interaction.guild.roles.cache.get('992500276659490849') || interaction.guild.roles.cache.get('802519536225484811')
        let pos_2_role = interaction.guild.roles.cache.get('992500286985863219') || interaction.guild.roles.cache.get('802519680010158080')
        let pos_3_role = interaction.guild.roles.cache.get('1010312171751735416') || interaction.guild.roles.cache.get('802519680857276429')
        let pos_4_role = interaction.guild.roles.cache.get('1010312205767540787') || interaction.guild.roles.cache.get('802519682585985024')
        let pos_5_role = interaction.guild.roles.cache.get('1010312214323929198') || interaction.guild.roles.cache.get('802519747177742346')
        let pos_1_emoji = Util.findEmoji('pos_1')
        let pos_2_emoji = Util.findEmoji('pos_2')
        let pos_3_emoji = Util.findEmoji('pos_3')
        let pos_4_emoji = Util.findEmoji('pos_4')
        let pos_5_emoji = Util.findEmoji('pos_5')
        let posEmbed = new Discord.MessageEmbed().setColor(noColor())
        .setDescription(`${pos_1_emoji} ${pos_1_role}\n${pos_2_emoji} ${pos_2_role}\n${pos_3_emoji} ${pos_3_role}\n${pos_4_emoji} ${pos_4_role}\n${pos_5_emoji} ${pos_5_role}⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣`)

        await interaction.deferUpdate()
        await interaction.editReply({
            embeds: [posEmbed],
            components: [POS_SELECT_MENU()]
        })
        if(interaction.values[0] == '1'){
            let role = interaction.guild.roles.cache.get('992500276659490849') || interaction.guild.roles.cache.get('802519536225484811')
            let hasRole = Boolean(interaction.member.roles.cache.has(role.id))
            await interaction.followUp({
                content: !hasRole ? `${interaction.member} была выдана роль ${role}` : `${interaction.member} была убрана роль ${role}`,
                ephemeral: true
            })
            hasRole ? interaction.member.roles.remove(role.id) : interaction.member.roles.add(role.id)
        } else if(interaction.values[0] == '2'){
            let role = interaction.guild.roles.cache.get('992500286985863219') || interaction.guild.roles.cache.get('802519680010158080')
            let hasRole = Boolean(interaction.member.roles.cache.has(role.id))
            await interaction.followUp({
                content: !hasRole ? `${interaction.member} была выдана роль ${role}` : `${interaction.member} была убрана роль ${role}`,
                ephemeral: true
            })
            hasRole ? interaction.member.roles.remove(role.id) : interaction.member.roles.add(role.id)
        } else if(interaction.values[0] == '3'){
            let role = interaction.guild.roles.cache.get('1010312171751735416') || interaction.guild.roles.cache.get('802519680857276429')
            let hasRole = Boolean(interaction.member.roles.cache.has(role.id))
            await interaction.followUp({
                content: !hasRole ? `${interaction.member} была выдана роль ${role}` : `${interaction.member} была убрана роль ${role}`,
                ephemeral: true
            })
            hasRole ? interaction.member.roles.remove(role.id) : interaction.member.roles.add(role.id)
        } else if(interaction.values[0] == '4'){
            let role = interaction.guild.roles.cache.get('1010312205767540787') || interaction.guild.roles.cache.get('802519682585985024')
            let hasRole = Boolean(interaction.member.roles.cache.has(role.id))
            await interaction.followUp({
                content: !hasRole ? `${interaction.member} была выдана роль ${role}` : `${interaction.member} была убрана роль ${role}`,
                ephemeral: true
            })
            hasRole ? interaction.member.roles.remove(role.id) : interaction.member.roles.add(role.id)
        } else if(interaction.values[0] == '5'){
            let role = interaction.guild.roles.cache.get('1010312214323929198') || interaction.guild.roles.cache.get('802519747177742346')
            let hasRole = Boolean(interaction.member.roles.cache.has(role.id))
            await interaction.followUp({
                content: !hasRole ? `${interaction.member} была выдана роль ${role}` : `${interaction.member} была убрана роль ${role}`,
                ephemeral: true
            })
            hasRole ? interaction.member.roles.remove(role.id) : interaction.member.roles.add(role.id)
        }
    }

    // GAMES 1 SELECT-MENU
    if(interaction.customId == 'games1_select'){
        let dota2 = interaction.guild.roles.cache.get('1010312220783149246') || interaction.guild.roles.cache.get('803069284275716097')
        let csgo = interaction.guild.roles.cache.get('1010312229276618843') || interaction.guild.roles.cache.get('802670397442490449')
        let gta5 = interaction.guild.roles.cache.get('1010312235370954782') || interaction.guild.roles.cache.get('830797818309640193')
        let osu = interaction.guild.roles.cache.get('1010312242576756797') || interaction.guild.roles.cache.get('802672486633701436')
        let overwatch = interaction.guild.roles.cache.get('1010312250139082823') || interaction.guild.roles.cache.get('826218435934945330')
        let apex = interaction.guild.roles.cache.get('1010312256455708754') || interaction.guild.roles.cache.get('813178039118463046')
        let games = interaction.guild.roles.cache.get('1010312262726189216') || interaction.guild.roles.cache.get('815668323081256990')
        let minecraft = interaction.guild.roles.cache.get('1010312269537747024') || interaction.guild.roles.cache.get('803066381121749042')
        let pubg = interaction.guild.roles.cache.get('1010312275862753300') || interaction.guild.roles.cache.get('815668506330398767')
        let fortnite = interaction.guild.roles.cache.get('1010312281806090303') || interaction.guild.roles.cache.get('815668320388382721')
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
            {name: '\u200B', value: `${apex_emoji} ${apex}\n${games_emoji} ${games}\n${minecraft_emoji} ${minecraft}\n${pubg_emoji} ${pubg}\n${fortnite_emoji} ${fortnite}`, inline: true}
        )

        await interaction.deferUpdate()
        await interaction.editReply({
            embeds: [games1Embed],
            components: [GAMES1_SELECT_MENU()]
        })
        if(interaction.values[0] == '1'){
            let role = interaction.guild.roles.cache.get('1010312220783149246') || interaction.guild.roles.cache.get('803069284275716097')
            let hasRole = Boolean(interaction.member.roles.cache.has(role.id))
            await interaction.followUp({
                content: !hasRole ? `${interaction.member} была выдана роль ${role}` : `${interaction.member} была убрана роль ${role}`,
                ephemeral: true
            })
            hasRole ? interaction.member.roles.remove(role.id) : interaction.member.roles.add(role.id)
        } else if(interaction.values[0] == '2'){
            let role = interaction.guild.roles.cache.get('1010312229276618843') || interaction.guild.roles.cache.get('802670397442490449')
            let hasRole = Boolean(interaction.member.roles.cache.has(role.id))
            await interaction.followUp({
                content: !hasRole ? `${interaction.member} была выдана роль ${role}` : `${interaction.member} была убрана роль ${role}`,
                ephemeral: true
            })
            hasRole ? interaction.member.roles.remove(role.id) : interaction.member.roles.add(role.id)
        } else if(interaction.values[0] == '3'){
            let role = interaction.guild.roles.cache.get('1010312235370954782') || interaction.guild.roles.cache.get('830797818309640193')
            let hasRole = Boolean(interaction.member.roles.cache.has(role.id))
            await interaction.followUp({
                content: !hasRole ? `${interaction.member} была выдана роль ${role}` : `${interaction.member} была убрана роль ${role}`,
                ephemeral: true
            })
            hasRole ? interaction.member.roles.remove(role.id) : interaction.member.roles.add(role.id)
        } else if(interaction.values[0] == '4'){
            let role = interaction.guild.roles.cache.get('1010312242576756797') || interaction.guild.roles.cache.get('802672486633701436')
            let hasRole = Boolean(interaction.member.roles.cache.has(role.id))
            await interaction.followUp({
                content: !hasRole ? `${interaction.member} была выдана роль ${role}` : `${interaction.member} была убрана роль ${role}`,
                ephemeral: true
            })
            hasRole ? interaction.member.roles.remove(role.id) : interaction.member.roles.add(role.id)
        } else if(interaction.values[0] == '5'){
            let role = interaction.guild.roles.cache.get('1010312250139082823') || interaction.guild.roles.cache.get('826218435934945330')
            let hasRole = Boolean(interaction.member.roles.cache.has(role.id))
            await interaction.followUp({
                content: !hasRole ? `${interaction.member} была выдана роль ${role}` : `${interaction.member} была убрана роль ${role}`,
                ephemeral: true
            })
            hasRole ? interaction.member.roles.remove(role.id) : interaction.member.roles.add(role.id)
        } else if(interaction.values[0] == '6'){
            let role = interaction.guild.roles.cache.get('1010312256455708754') || interaction.guild.roles.cache.get('813178039118463046')
            let hasRole = Boolean(interaction.member.roles.cache.has(role.id))
            await interaction.followUp({
                content: !hasRole ? `${interaction.member} была выдана роль ${role}` : `${interaction.member} была убрана роль ${role}`,
                ephemeral: true
            })
            hasRole ? interaction.member.roles.remove(role.id) : interaction.member.roles.add(role.id)
        } else if(interaction.values[0] == '7'){
            let role = interaction.guild.roles.cache.get('1010312262726189216') || interaction.guild.roles.cache.get('815668323081256990')
            let hasRole = Boolean(interaction.member.roles.cache.has(role.id))
            await interaction.followUp({
                content: !hasRole ? `${interaction.member} была выдана роль ${role}` : `${interaction.member} была убрана роль ${role}`,
                ephemeral: true
            })
            hasRole ? interaction.member.roles.remove(role.id) : interaction.member.roles.add(role.id)
        } else if(interaction.values[0] == '8'){
            let role = interaction.guild.roles.cache.get('1010312269537747024') || interaction.guild.roles.cache.get('803066381121749042')
            let hasRole = Boolean(interaction.member.roles.cache.has(role.id))
            await interaction.followUp({
                content: !hasRole ? `${interaction.member} была выдана роль ${role}` : `${interaction.member} была убрана роль ${role}`,
                ephemeral: true
            })
            hasRole ? interaction.member.roles.remove(role.id) : interaction.member.roles.add(role.id)
        } else if(interaction.values[0] == '9'){
            let role = interaction.guild.roles.cache.get('1010312275862753300') || interaction.guild.roles.cache.get('815668506330398767')
            let hasRole = Boolean(interaction.member.roles.cache.has(role.id))
            await interaction.followUp({
                content: !hasRole ? `${interaction.member} была выдана роль ${role}` : `${interaction.member} была убрана роль ${role}`,
                ephemeral: true
            })
            hasRole ? interaction.member.roles.remove(role.id) : interaction.member.roles.add(role.id)
        } else if(interaction.values[0] == '10'){
            let role = interaction.guild.roles.cache.get('1010312281806090303') || interaction.guild.roles.cache.get('815668320388382721')
            let hasRole = Boolean(interaction.member.roles.cache.has(role.id))
            await interaction.followUp({
                content: !hasRole ? `${interaction.member} была выдана роль ${role}` : `${interaction.member} была убрана роль ${role}`,
                ephemeral: true
            })
            hasRole ? interaction.member.roles.remove(role.id) : interaction.member.roles.add(role.id)
        }
    }

    // GAMES 2 SELECT-MENU
    if(interaction.customId == 'games2_select'){
        let valorant = interaction.guild.roles.cache.get('1010312287531323545') || interaction.guild.roles.cache.get('815668505529548882')
        let dbd = interaction.guild.roles.cache.get('1010312293843738635') || interaction.guild.roles.cache.get('815668322426683432')
        let rainbow6 = interaction.guild.roles.cache.get('1010312299950637077') || interaction.guild.roles.cache.get('826218607935225867')
        let dont_starve = interaction.guild.roles.cache.get('1010312308226011346') || interaction.guild.roles.cache.get('916458389490511902')
        let cod = interaction.guild.roles.cache.get('1010312315536670770') || interaction.guild.roles.cache.get('868249561091690538')
        let rust = interaction.guild.roles.cache.get('1010312322344026122') || interaction.guild.roles.cache.get('830843657262334024')
        let terraria = interaction.guild.roles.cache.get('1010312328220266586') || interaction.guild.roles.cache.get('830843650228486154')
        let wow = interaction.guild.roles.cache.get('1010312333857398925') || interaction.guild.roles.cache.get('868249465142796328')
        let genshin = interaction.guild.roles.cache.get('1010312341222596648') || interaction.guild.roles.cache.get('826216120045797427')
        let lol = interaction.guild.roles.cache.get('1010312348306788432') || interaction.guild.roles.cache.get('826218767742402592')
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

        await interaction.deferUpdate()
        await interaction.editReply({
            embeds: [games2Embed],
            components: [GAMES2_SELECT_MENU()]
        })
        if(interaction.values[0] == '1'){
            let role = interaction.guild.roles.cache.get('1010312287531323545') || interaction.guild.roles.cache.get('815668505529548882')
            let hasRole = Boolean(interaction.member.roles.cache.has(role.id))
            await interaction.followUp({
                content: !hasRole ? `${interaction.member} была выдана роль ${role}` : `${interaction.member} была убрана роль ${role}`,
                ephemeral: true
            })
            hasRole ? interaction.member.roles.remove(role.id) : interaction.member.roles.add(role.id)
        } else if(interaction.values[0] == '2'){
            let role = interaction.guild.roles.cache.get('1010312293843738635') || interaction.guild.roles.cache.get('815668322426683432')
            let hasRole = Boolean(interaction.member.roles.cache.has(role.id))
            await interaction.followUp({
                content: !hasRole ? `${interaction.member} была выдана роль ${role}` : `${interaction.member} была убрана роль ${role}`,
                ephemeral: true
            })
            hasRole ? interaction.member.roles.remove(role.id) : interaction.member.roles.add(role.id)
        } else if(interaction.values[0] == '3'){
            let role = interaction.guild.roles.cache.get('1010312299950637077') || interaction.guild.roles.cache.get('826218607935225867')
            let hasRole = Boolean(interaction.member.roles.cache.has(role.id))
            await interaction.followUp({
                content: !hasRole ? `${interaction.member} была выдана роль ${role}` : `${interaction.member} была убрана роль ${role}`,
                ephemeral: true
            })
            hasRole ? interaction.member.roles.remove(role.id) : interaction.member.roles.add(role.id)
        } else if(interaction.values[0] == '4'){
            let role = interaction.guild.roles.cache.get('1010312308226011346') || interaction.guild.roles.cache.get('916458389490511902')
            let hasRole = Boolean(interaction.member.roles.cache.has(role.id))
            await interaction.followUp({
                content: !hasRole ? `${interaction.member} была выдана роль ${role}` : `${interaction.member} была убрана роль ${role}`,
                ephemeral: true
            })
            hasRole ? interaction.member.roles.remove(role.id) : interaction.member.roles.add(role.id)
        } else if(interaction.values[0] == '5'){
            let role = interaction.guild.roles.cache.get('1010312315536670770') || interaction.guild.roles.cache.get('868249561091690538')
            let hasRole = Boolean(interaction.member.roles.cache.has(role.id))
            await interaction.followUp({
                content: !hasRole ? `${interaction.member} была выдана роль ${role}` : `${interaction.member} была убрана роль ${role}`,
                ephemeral: true
            })
            hasRole ? interaction.member.roles.remove(role.id) : interaction.member.roles.add(role.id)
        } else if(interaction.values[0] == '6'){
            let role = interaction.guild.roles.cache.get('1010312322344026122') || interaction.guild.roles.cache.get('830843657262334024')
            let hasRole = Boolean(interaction.member.roles.cache.has(role.id))
            await interaction.followUp({
                content: !hasRole ? `${interaction.member} была выдана роль ${role}` : `${interaction.member} была убрана роль ${role}`,
                ephemeral: true
            })
            hasRole ? interaction.member.roles.remove(role.id) : interaction.member.roles.add(role.id)
        } else if(interaction.values[0] == '7'){
            let role = interaction.guild.roles.cache.get('1010312328220266586') || interaction.guild.roles.cache.get('830843650228486154')
            let hasRole = Boolean(interaction.member.roles.cache.has(role.id))
            await interaction.followUp({
                content: !hasRole ? `${interaction.member} была выдана роль ${role}` : `${interaction.member} была убрана роль ${role}`,
                ephemeral: true
            })
            hasRole ? interaction.member.roles.remove(role.id) : interaction.member.roles.add(role.id)
        } else if(interaction.values[0] == '8'){
            let role = interaction.guild.roles.cache.get('1010312333857398925') || interaction.guild.roles.cache.get('868249465142796328')
            let hasRole = Boolean(interaction.member.roles.cache.has(role.id))
            await interaction.followUp({
                content: !hasRole ? `${interaction.member} была выдана роль ${role}` : `${interaction.member} была убрана роль ${role}`,
                ephemeral: true
            })
            hasRole ? interaction.member.roles.remove(role.id) : interaction.member.roles.add(role.id)
        } else if(interaction.values[0] == '9'){
            let role = interaction.guild.roles.cache.get('1010312341222596648') || interaction.guild.roles.cache.get('826216120045797427')
            let hasRole = Boolean(interaction.member.roles.cache.has(role.id))
            await interaction.followUp({
                content: !hasRole ? `${interaction.member} была выдана роль ${role}` : `${interaction.member} была убрана роль ${role}`,
                ephemeral: true
            })
            hasRole ? interaction.member.roles.remove(role.id) : interaction.member.roles.add(role.id)
        } else if(interaction.values[0] == '10'){
            let role = interaction.guild.roles.cache.get('1010312348306788432') || interaction.guild.roles.cache.get('826218767742402592')
            let hasRole = Boolean(interaction.member.roles.cache.has(role.id))
            await interaction.followUp({
                content: !hasRole ? `${interaction.member} была выдана роль ${role}` : `${interaction.member} была убрана роль ${role}`,
                ephemeral: true
            })
            hasRole ? interaction.member.roles.remove(role.id) : interaction.member.roles.add(role.id)
        }
    }

    // GAMES 3 SELECT-MENU
    if(interaction.customId == 'games3_select'){
        let amongus = interaction.guild.roles.cache.get('1010312354761805920') || interaction.guild.roles.cache.get('896761741038473226')
        let brawl = interaction.guild.roles.cache.get('1010313415371268106') || interaction.guild.roles.cache.get('991457427608305735')
        let hearthstone = interaction.guild.roles.cache.get('1010313422770012181') || interaction.guild.roles.cache.get('896764012933574678')
        let phasmaphobia = interaction.guild.roles.cache.get('1010313431796162692') || interaction.guild.roles.cache.get('872986442241040465')
        let mobile_legends = interaction.guild.roles.cache.get('1010313438322491485') || interaction.guild.roles.cache.get('884553790374699008')
        let tarkov = interaction.guild.roles.cache.get('1010313445377323118') || interaction.guild.roles.cache.get('872986283725688903')
        let warface = interaction.guild.roles.cache.get('1012314071535730740') || interaction.guild.roles.cache.get('1012305006571028580')
        let valheim = interaction.guild.roles.cache.get('1012314084131217438') || interaction.guild.roles.cache.get('1012305121310408734')
        let my_coffeeshop = interaction.guild.roles.cache.get('1012314091622240346') || interaction.guild.roles.cache.get('1012308000813359134')
        let rocket_league = interaction.guild.roles.cache.get('1012314099650138165') || interaction.guild.roles.cache.get('1012312174150029373')
        let amongus_emoji = Util.findEmoji('among_us')
        let brawl_emoji = Util.findEmoji('brawl_stars')
        let hearthstone_emoji = Util.findEmoji('hearthstone')
        let phasmaphobia_emoji = Util.findEmoji('phasmophobia')
        let mobile_legends_emoji = Util.findEmoji('mobile_legends')
        let tarkov_emoji = Util.findEmoji('escape_from_tarkov')
        let warface_emoji = Util.findEmoji('warface')
        let valheim_emoji = Util.findEmoji('valheim')
        let my_coffeeshop_emoji = Util.findEmoji('my_coffeshop')
        let rocket_league_emoji = Util.findEmoji('rocket_league')
        let games3Embed = new Discord.MessageEmbed().setColor(noColor())
        .setFields(
            {name: '⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣', 
            value: `${amongus_emoji} ${amongus}\n${brawl_emoji} ${brawl}\n${hearthstone_emoji} ${hearthstone}\n${phasmaphobia_emoji} ${phasmaphobia}\n${mobile_legends_emoji} ${mobile_legends}`, inline: true},
            {name: '\u200B', value: `\n${tarkov_emoji} ${tarkov}\n${valheim_emoji} ${valheim}\n${my_coffeeshop_emoji} ${my_coffeeshop}\n${warface_emoji} ${warface}\n${rocket_league_emoji} ${rocket_league}`, inline: true}
        )

        await interaction.deferUpdate()
        await interaction.editReply({
            embeds: [games3Embed],
            components: [GAMES3_SELECT_MENU()]
        })
        if(interaction.values[0] == '1'){
            let role = interaction.guild.roles.cache.get('1010312354761805920') || interaction.guild.roles.cache.get('896761741038473226')
            let hasRole = Boolean(interaction.member.roles.cache.has(role.id))
            await interaction.followUp({
                content: !hasRole ? `${interaction.member} была выдана роль ${role}` : `${interaction.member} была убрана роль ${role}`,
                ephemeral: true
            })
            hasRole ? interaction.member.roles.remove(role.id) : interaction.member.roles.add(role.id)
        } else if(interaction.values[0] == '2'){
            let role = interaction.guild.roles.cache.get('1010313415371268106') || interaction.guild.roles.cache.get('991457427608305735')
            let hasRole = Boolean(interaction.member.roles.cache.has(role.id))
            await interaction.followUp({
                content: !hasRole ? `${interaction.member} была выдана роль ${role}` : `${interaction.member} была убрана роль ${role}`,
                ephemeral: true
            })
            hasRole ? interaction.member.roles.remove(role.id) : interaction.member.roles.add(role.id)
        } else if(interaction.values[0] == '3'){
            let role = interaction.guild.roles.cache.get('1010313422770012181') || interaction.guild.roles.cache.get('896764012933574678')
            let hasRole = Boolean(interaction.member.roles.cache.has(role.id))
            await interaction.followUp({
                content: !hasRole ? `${interaction.member} была выдана роль ${role}` : `${interaction.member} была убрана роль ${role}`,
                ephemeral: true
            })
            hasRole ? interaction.member.roles.remove(role.id) : interaction.member.roles.add(role.id)
        } else if(interaction.values[0] == '4'){
            let role = interaction.guild.roles.cache.get('1010313431796162692') || interaction.guild.roles.cache.get('872986442241040465')
            let hasRole = Boolean(interaction.member.roles.cache.has(role.id))
            await interaction.followUp({
                content: !hasRole ? `${interaction.member} была выдана роль ${role}` : `${interaction.member} была убрана роль ${role}`,
                ephemeral: true
            })
            hasRole ? interaction.member.roles.remove(role.id) : interaction.member.roles.add(role.id)
        } else if(interaction.values[0] == '5'){
            let role = interaction.guild.roles.cache.get('1010313438322491485') || interaction.guild.roles.cache.get('884553790374699008')
            let hasRole = Boolean(interaction.member.roles.cache.has(role.id))
            await interaction.followUp({
                content: !hasRole ? `${interaction.member} была выдана роль ${role}` : `${interaction.member} была убрана роль ${role}`,
                ephemeral: true
            })
            hasRole ? interaction.member.roles.remove(role.id) : interaction.member.roles.add(role.id)
        } else if(interaction.values[0] == '6'){
            let role = interaction.guild.roles.cache.get('1010313445377323118') || interaction.guild.roles.cache.get('872986283725688903')
            let hasRole = Boolean(interaction.member.roles.cache.has(role.id))
            await interaction.followUp({
                content: !hasRole ? `${interaction.member} была выдана роль ${role}` : `${interaction.member} была убрана роль ${role}`,
                ephemeral: true
            })
            hasRole ? interaction.member.roles.remove(role.id) : interaction.member.roles.add(role.id)
        } else if(interaction.values[0] == '7'){
            let role = interaction.guild.roles.cache.get('1012314071535730740') || interaction.guild.roles.cache.get('1012305006571028580')
            let hasRole = Boolean(interaction.member.roles.cache.has(role.id))
            await interaction.followUp({
                content: !hasRole ? `${interaction.member} была выдана роль ${role}` : `${interaction.member} была убрана роль ${role}`,
                ephemeral: true
            })
            hasRole ? interaction.member.roles.remove(role.id) : interaction.member.roles.add(role.id)
        } else if(interaction.values[0] == '8'){
            let role = interaction.guild.roles.cache.get('1012314084131217438') || interaction.guild.roles.cache.get('1012305121310408734')
            let hasRole = Boolean(interaction.member.roles.cache.has(role.id))
            await interaction.followUp({
                content: !hasRole ? `${interaction.member} была выдана роль ${role}` : `${interaction.member} была убрана роль ${role}`,
                ephemeral: true
            })
            hasRole ? interaction.member.roles.remove(role.id) : interaction.member.roles.add(role.id)
        } else if(interaction.values[0] == '9'){
            let role = interaction.guild.roles.cache.get('1012314091622240346') || interaction.guild.roles.cache.get('1012308000813359134')
            let hasRole = Boolean(interaction.member.roles.cache.has(role.id))
            await interaction.followUp({
                content: !hasRole ? `${interaction.member} была выдана роль ${role}` : `${interaction.member} была убрана роль ${role}`,
                ephemeral: true
            })
            hasRole ? interaction.member.roles.remove(role.id) : interaction.member.roles.add(role.id)
        } else if(interaction.values[0] == '10'){
            let role = interaction.guild.roles.cache.get('1012314099650138165') || interaction.guild.roles.cache.get('1012312174150029373')
            let hasRole = Boolean(interaction.member.roles.cache.has(role.id))
            await interaction.followUp({
                content: !hasRole ? `${interaction.member} была выдана роль ${role}` : `${interaction.member} была убрана роль ${role}`,
                ephemeral: true
            })
            hasRole ? interaction.member.roles.remove(role.id) : interaction.member.roles.add(role.id)
        }
    }

    // WATCH SELECT-MENU    
    if(interaction.customId == 'watch_select'){
        let watch1 = interaction.guild.roles.cache.get('1010347096152473680') || interaction.guild.roles.cache.get('812993501620994118')
        let watch2 = interaction.guild.roles.cache.get('1010347105514160218') || interaction.guild.roles.cache.get('812993391427059713')
        let watch3 = interaction.guild.roles.cache.get('1010347114196369458') || interaction.guild.roles.cache.get('812993427536216076')
        let watch1_emoji = Util.findEmoji('vse')
        let watch2_emoji = Util.findEmoji('anime')
        let watch3_emoji = Util.findEmoji('films')
        let watchEmbed = new Discord.MessageEmbed().setColor(noColor())
        .setDescription(`${watch1_emoji} ${watch1}\n${watch2_emoji} ${watch2}\n${watch3_emoji} ${watch3}⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ ⁣ `)

        await interaction.deferUpdate()
        await interaction.editReply({
            embeds: [watchEmbed],
            components: [WATCH_SELECT_MENU()]
        })
        let role1 = interaction.guild.roles.cache.get('1010347096152473680') || interaction.guild.roles.cache.get('812993501620994118')
        let role2 = interaction.guild.roles.cache.get('1010347105514160218') || interaction.guild.roles.cache.get('812993391427059713')
        let role3 = interaction.guild.roles.cache.get('1010347114196369458') || interaction.guild.roles.cache.get('812993427536216076')
        if(interaction.values[0] == '1'){
            let hasRole = Boolean(interaction.member.roles.cache.has(role1.id))
            await interaction.followUp({
                content: !hasRole ? `${interaction.member} была выдана роль ${role1}` : `${interaction.member} была убрана роль ${role1}`,
                ephemeral: true
            })
            hasRole ? interaction.member.roles.remove(role1.id) : interaction.member.roles.add(role1.id)
            if(interaction.member.roles.cache.has(role2.id)) interaction.member.roles.remove(role2.id)
            if(interaction.member.roles.cache.has(role3.id)) interaction.member.roles.remove(role3.id)
        } else if(interaction.values[0] == '2'){
            let hasRole = Boolean(interaction.member.roles.cache.has(role2.id))
            await interaction.followUp({
                content: !hasRole ? `${interaction.member} была выдана роль ${role2}` : `${interaction.member} была убрана роль ${role2}`,
                ephemeral: true
            })
            hasRole ? interaction.member.roles.remove(role2.id) : interaction.member.roles.add(role2.id)
            if(interaction.member.roles.cache.has(role1.id)) interaction.member.roles.remove(role1.id)
            if(interaction.member.roles.cache.has(role3.id)) interaction.member.roles.remove(role3.id)
        } else if(interaction.values[0] == '3'){
            let hasRole = Boolean(interaction.member.roles.cache.has(role3.id))
            await interaction.followUp({
                content: !hasRole ? `${interaction.member} была выдана роль ${role3}` : `${interaction.member} была убрана роль ${role3}`,
                ephemeral: true
            })
            hasRole ? interaction.member.roles.remove(role3.id) : interaction.member.roles.add(role3.id)
            if(interaction.member.roles.cache.has(role2.id)) interaction.member.roles.remove(role2.id)
            if(interaction.member.roles.cache.has(role1.id)) interaction.member.roles.remove(role1.id)
        }
    }

    // VACATION SELECT-MENU
    if(interaction.customId == 'vacation_select'){
        await interaction.deferUpdate()
        await interaction.editReply({components: [VACATION_SELECT_MENU()]})
        const devices = interaction.member.presence?.clientStatus || {}
        let mobile = Boolean(Object.hasOwn(devices, 'mobile'))
        let desktop = Boolean(Object.hasOwn(devices, 'desktop'))
        if(interaction.values[0] == '1'){
            let role = interaction.guild.roles.cache.get('1010592362638090360') || interaction.guild.roles.cache.get('842529252954996752')
            let event_manager = interaction.guild.roles.cache.get('996781830386745374') || interaction.guild.roles.cache.get('880962761415352390')
            let embed = new Discord.MessageEmbed().setColor(noColor())
            .setDescription(`${role} - проводят стримы фильмов, сериалов, аниме на сервере\n\n**Мы предлагаем:**\n• Закрытый текстовый канал для ивентеров\n• Бонусное вознаграждение за проведение ивента\n• Возможность проводить ивенты в удобное время\n• Отдельная роль в правой колонке ${event_manager}\n• Управление голосовыми каналами категории #кинозал\n• Более ранее получение новостей об изменениях сервера или глобальных мероприятий\n\n**Требования:**\n• Минимум 1 стрим в неделю\n• Знание правил сервер\n• Адекватность и стрессоустойчивость\n• Возраст 16+`)
            await interaction.followUp({
                files: ['https://imgur.com/pWiRO3T.png'],
                embeds: [embed],
                components: [VACTION_LINK_BUTTON('films', mobile, desktop)],
                ephemeral: true
            })
        } else if(interaction.values[0] == '2'){
            let role = interaction.guild.roles.cache.get('1010592377267814400') || interaction.guild.roles.cache.get('884196554297188392')
            let event_manager = interaction.guild.roles.cache.get('996781830386745374') || interaction.guild.roles.cache.get('880962761415352390')
            let dota2 = interaction.guild.roles.cache.get('1010312220783149246') || interaction.guild.roles.cache.get('803069284275716097')
            let csgo = interaction.guild.roles.cache.get('1010312229276618843') || interaction.guild.roles.cache.get('802670397442490449')
            let embed = new Discord.MessageEmbed().setColor(noColor())
            .setDescription(`${role} - проводят игры 5x5 и кастом в ${dota2} ${csgo} и т.д.\n\n**Мы предлагаем:**\n• Закрытый текстовый канал для ивентеров\n• Бонусное вознаграждение за проведение ивента\n• Возможность проводить ивенты в удобное время\n• Отдельная роль в правой колонке ${event_manager}\n• Управление голосовыми каналами категории #ивенты\n• Более ранее получение новостей об изменениях сервера или глобальных мероприятий\n\n**Требования:**\n• Минимум 1 ивент в неделю\n• Знание правил сервер\n• Адекватность и стрессоустойчивость\n• Опыт в игре\n• Возраст 16+`)
            await interaction.followUp({
                files: ['https://imgur.com/JQuGBQE.png'],
                embeds: [embed],
                components: [VACTION_LINK_BUTTON('custom', mobile, desktop)],
                ephemeral: true
            })
        } else if(interaction.values[0] == '3'){
            let role = interaction.guild.roles.cache.get('1010592370141712557') || interaction.guild.roles.cache.get('815761166017232906')
            let event_manager = interaction.guild.roles.cache.get('996781830386745374') || interaction.guild.roles.cache.get('880962761415352390')
            let embed = new Discord.MessageEmbed().setColor(noColor())
            .setDescription(`${role} - проводят ивенты по настольным играм Мафия, Своя игра, Бункер, сломанный телефон и т.д.\n\n**Мы предлагаем:**\n• Закрытый текстовый канал для ивентеров\n• Бонусное вознаграждение за проведение ивента\n• Возможность проводить ивенты в удобное время\n• Отдельная роль в правой колонке ${event_manager}\n• Управление голосовыми каналами категории #ивенты\n• Более ранее получение новостей об изменениях сервера или глобальных мероприятий\n\n**Требования:**\n• Минимум 1 ивент в неделю\n• Знание правил сервер и игры\n• Адекватность и стрессоустойчивость\n• Опыт в игре\n• Возраст 16+`)
            await interaction.followUp({
                files: ['https://imgur.com/Wq9w5w6.png'],
                embeds: [embed],
                components: [VACTION_LINK_BUTTON('games', mobile, desktop)],
                ephemeral: true
            })
        } else if(interaction.values[0] == '4'){
            let role = interaction.guild.roles.cache.get('1002328129798414356') || interaction.guild.roles.cache.get('829376653795786752')
            let embed = new Discord.MessageEmbed().setColor(noColor())
            .setDescription(`Ответственный и справедливый? Можешь найти контакт абсолютно с любым человеком и никогда не откажешь в помощи? Тогда скорее заполняй заявку на должность ${role} и вступай в ряды модерации PONIME\n\n**Мы предлагаем:**\n• Отдельная роль в правой колонке\n• Закрытый текстовый канал модерации\n• Вознаграждение в виде роли или комнаты\n• Более ранее получение новостей об изменениях на сервере или глобальных мероприятий\n\n**Обязанности:**\n• Отчёт о проделанной работе\n• Помощь и гиды новым участникам\n• Помощь в организации мероприятий\n• Контроль и мониторинг текстовых чатов\n• Активность в голосовых и текстовых каналах\n• Рассылка рекламных сообщений (аккаунты предоставляем)\n• Уважительное отношение к составу Модерации и Администрации. Это значит, что Вы должны уметь брать ответственность за свои действия\n\n**Требования:**\n• Возраст 16+\n• Знание правил и команд сервера\n• Адекватность и стрессоустойчивость и стрессоустойчивость\n• От 3-х часов свободного времени в день\n• Иметь двухфакторную аутентификацию`)
            await interaction.followUp({
                files: ['https://imgur.com/clByTgv.png'],
                embeds: [embed],
                components: [VACTION_LINK_BUTTON('moderation', mobile, desktop)],
                ephemeral: true
            })
        }
    }

    // CHAT INFO SELECT-MENU
    if(interaction.customId == 'chat_info_select'){
        await interaction.deferUpdate()
        await interaction.editReply({components: [CHAT_INFO__SELECT_MENU()]})
        // const devices = interaction.member.presence?.clientStatus || {}
        // let mobile = Boolean(Object.hasOwn(devices, 'mobile'))
        // let desktop = Boolean(Object.hasOwn(devices, 'desktop'))
        if(interaction.values[0] == '1'){
            let embed = new Discord.MessageEmbed().setColor(noColor())
            .setDescription(`Здесь Вы можете найти пати в любую игру, используйте упоминания @Название_игры/ранг/уровень/ммр\n\nЕсли данной игры нет в списке упоминаний, Вы все равно можете оставить свой запрос о поиске тиммейта, а так же написать в <#802685061274402866> о добавление данной игры\n\nЕсли Вы хотите так же получать уведомления, когда кто-то будет искать пати в ту или иную игру или с определённым рейтингом, то Вы можете получить роли в <#1001952806871253032>, а потвердеть рейтинг у одного из <@&803053033259794482>\n\nЖелательно не тегать вместе игру и рейтинг из неё же. Пример: <@&803069284275716097> <@&802515886460239902> или <@&802670397442490449> <@&806847345298898964>, аналогично с другими ролями - ибо и так будет понятно что Вы ищите пати в <@&802670397442490449> или <@&803069284275716097>, тегая дополнительные роли из этой игры\n\nИногда просматривайте профиля участников сервера на наличие ролей, чтобы не ждать ответа`)
            await interaction.followUp({
                files: ['https://imgur.com/fLRrLcz.png'],
                embeds: [embed],
                ephemeral: true
            })
        } else if(interaction.values[0] == '2'){
            let embed = new Discord.MessageEmbed().setColor(noColor())
            .setDescription(`**Одиноко? Найди любовь в PONIME**\n\n**Канал создан с целью размещения анкет, в формате:**\n- Имя\n- Возраст\n- Город (если не против раскрыть эту информацию)\n- О себе\n- Кого ищете\n\n**Строго запрещается:**\n- Копипаста анкет\n- Шуточные анкеты\n- Использовать упоминание каких-либо ролей или участников\n- Анкеты содержащие оскорбительный или провацирующий характер\n\nЧтобы ответить взаимностью, достаточно прожать реакцию или проявить инициативу написав лс`)
            await interaction.followUp({
                files: ['https://imgur.com/kuJ22Kv.png'],
                embeds: [embed],
                ephemeral: true
            })
        } else if(interaction.values[0] == '3'){
            let embed = new Discord.MessageEmbed().setColor(noColor())
            .setDescription(`У Вас появились фотографии, мемы или хотите поделиться шуткой? Этот чат создан для этого!\n\nВ данном чате предусмотрены комментарии под сообщениями - поэтому любое общение внутри чата, запрещено!\n\nДля того чтобы упростить поиск при публикации контента отправляйте #хештег, такие как #селфи #фотографии #обои #творечество #анекдот #мемы и т.д`)
            await interaction.followUp({
                files: ['https://imgur.com/un0aX7j.png'],
                embeds: [embed],
                ephemeral: true
            })
        } else if(interaction.values[0] == '4'){
            let embed = new Discord.MessageEmbed().setColor(noColor())
            .setDescription(`**У Вас появилась идея как улучшить сервер?** \nТогда смело опишите и публикуйте её\n\n**Чтобы ни у кого не осталось вопросов, используйте следующий шаблон:**\n1) Опишите что конкретно Вы хотите добавить или изменить\n2) Почему мы должно это сделать? В чём заключается идея?\n3) Если это добавление голосового/текстового канала - предоставьте эмодзи и название для этого канала\n\nВ чате предусмотрены комментарии под сообщениями - поэтому любое общение внутри чата запрещено!`)
            await interaction.followUp({
                files: ['https://imgur.com/tFM2Hd6.png'],
                embeds: [embed],
                ephemeral: true
            })
        } else if(interaction.values[0] == '5'){
            let embed = new Discord.MessageEmbed().setColor(noColor())
            .setDescription(`Вы заметили, что участник сервера нарушает правила?** Заходит и выходит с голосового канала или оскорбляет и провоцируют Вас - тогда оставьте на него жалобу\n\n**Шаблон жалобы:**\n1. Никнейм нарушителя\n2. Что нарушил участник\n3. Доказательство\n\n**Пример жалобы:**\n1. <@248453176745787393>\n2. Оскорбительное поведение\n3. Видео запись\n\n**Под доказательствами предполагается:**\n• Скриншот переписки\n• Более 3 свидетелей\n• Видео запись\n• Откат\n\nВ чате предусмотрены комментарии - поэтому любое общение внутри чата запрещено!`)
            await interaction.followUp({
                files: ['https://imgur.com/IfvOQVR.png'],
                embeds: [embed],
                ephemeral: true
            })
        } else if(interaction.values[0] == '6'){
            let embed = new Discord.MessageEmbed().setColor(noColor())
            .setDescription(`Вы любите разжигать конфликты, спорить о политике и немного пошалить?\n\n**Возможности:**\n• Споры о политике\n• Отправка контента 18+\n• Использование бот команд\n• Оскорбление других участников\n• Разрешен 1 тег для привлечения внимания другого участника сервера\n\n**Запрещено:**\n• Реклама\n• Скам ссылки\n• Линковать участников сервера, которые не вовлечены в диалог`)
            await interaction.followUp({
                files: ['https://imgur.com/EZ58VOa.png'],
                embeds: [embed],
                ephemeral: true
            })
        } else if(interaction.values[0] == '7'){
            let embed = new Discord.MessageEmbed().setColor(noColor())
            .setDescription(`Чат предназначен \`исключительно\` для использования бот-команд\n\nВы можете давать комментарии или общаться лишь по поводу бот-команд, в ином случае **общение в данном чате запрещено!**\n\nПример комментариев/общения \"Ставь все на красное\" или \"Заполни свой профил\"\n\nВсе возможные команды Вы можете найти в <#803551630934016010>`)
            await interaction.followUp({
                files: ['https://imgur.com/W7HCivX.png'],
                embeds: [embed],
                ephemeral: true
            })
        } else if(interaction.values[0] == '8'){
            let embed = new Discord.MessageEmbed().setColor(noColor())
            .setDescription(`Данная категория предназначена исключительно для проведения ивентов на сервере, которые проводит модерация сервера и <@&880962761415352390>\n\nОбщение или нахождение в голосовых и текстовых каналах разрешено лишь во время проведения ивента!\n\nЕсли у Вас есть желание проводить ивенты на сервере, Вы можете подать свою кандидатуру через **вакансии** в <#820302782857740319>`)
            await interaction.followUp({
                files: ['https://imgur.com/2aZmN7Y.png'],
                embeds: [embed],
                ephemeral: true
            })
        } else if(interaction.values[0] == '9'){
            let embed = new Discord.MessageEmbed().setColor(noColor())
            .setDescription(`Данная категория предназначена исключительно для обсуждения и просмотра фильмов, сериалов, аниме\n\n**Любое общение не касаемо фильмов, сериалов - запрещено**\n\nЕсли Вы хотите собрать больше людей на просмотр, то используйте следующий **шаблон:**\n\n1. Тегните одну из ролей <@&812993391427059713> <@&812993427536216076> и дополнительно <@&812993501620994118>\n2. Название\n3. Дата выхода\n3. Жанр\n4. Длительность/количество серий\n5. Время начала просмотра (желательно написать за час до начала)\n6. Постер\n\nТак же в этой категории проводят стримы (в виде ивента) фильмов, сериалов и аниме. Если у Вас есть желание проводить ивенты на сервере, Вы можете подать свою кандидатуру через **вакансии** в <#820302782857740319>`)
            await interaction.followUp({
                files: ['https://imgur.com/E0xM37l.png'],
                embeds: [embed],
                ephemeral: true
            })
        } else if(interaction.values[0] == '10'){
            let embed = new Discord.MessageEmbed().setColor(noColor())
            .setDescription(`Здесь происходит основное общение между участниками сервера\n\n**Разрешено:**\n• Ламповое общение\n• Команды действий\n• Отправка картинок, гифок\n\n**Запрещено:**\n• Отправка 18+ контент\n• Отправка шок контента\n• Обсуждение политики\n• Оскорбительное поведение`)
            await interaction.followUp({
                files: ['https://imgur.com/nj0Zzj0.png'],
                embeds: [embed],
                ephemeral: true
            })
        }
    }

    // FAQ SELECT-MENU
    if(interaction.customId == 'faq_select'){
        await interaction.deferUpdate()
        await interaction.editReply({components: [FAQ_SELECT_MENU()]})
        if(interaction.values[0] == '1'){
            let embed = new Discord.MessageEmbed().setColor(noColor())
            .setDescription(`Заработать валюту Вы можете общаясь на сервере, а также участвуя в ивентах, которые публикуются в <#811199400604598332> и <#887454770380550204>, чтобы не пропускать начало ивентов, Вам необходимо получите роль <@&815668323081256990> в <#1001952806871253032>\n\nЕсть северные команды и мини игры для дополнительного заработка. Примером будет игра \`blackjack\` и команда \`work\`, полный список команд можете найти в <#803551630934016010>`)
            await interaction.followUp({
                files: ['https://imgur.com/3eWhsex.png'],
                embeds: [embed],
                ephemeral: true
            })
        } else if(interaction.values[0] == '2'){
            let embed = new Discord.MessageEmbed().setColor(noColor())
            .setDescription(`Все, что может быть Вам полезно прописано в категории <#802679770285342800>. Внимательно прочитайте эту категорию и скорее всего Вы найдете ответы на свои вопросы.\n\nЕсли у Вас все ещё остались вопросы - отпишите одному из членов модерации <@&723369057281114162> <@&803053033259794482> <@&830896489215688714> в личные сообщения`)
            await interaction.followUp({
                files: ['https://imgur.com/M4rzXcT.png'],
                embeds: [embed],
                ephemeral: true
            })
        } else if(interaction.values[0] == '3'){
            let embed = new Discord.MessageEmbed().setColor(noColor())
            .setDescription(`**Вам понравилось как ведущий провел ивент? Или как модератор провел гид по серверу?** Вы можете оставить положительный или отрицательный отзыв о работе модерации/ивентеров сервера\n\nЕсли Вы считаете действия члена модерации/ивентеров не допустимыми, Вы можете дополнительно подать жалобу в <#812070015133810718>\n\nРоли на которые можно оставить отзыв <@&723369057281114162> <@&803053033259794482> <@&830896489215688714> <@&829376653795786752> <@&880962761415352390>`)
            await interaction.followUp({
                files: ['https://imgur.com/9SmeEzh.png'],
                components: [INSTRUCTIONS_LINK_BUTTON()],
                embeds: [embed],
                ephemeral: true
            })
        } else if(interaction.values[0] == '4'){
            let embed = new Discord.MessageEmbed().setColor(noColor())
            .setDescription(`**Если Вы хотите поддержать сервер**, можете сделать перевод на sber/qiwi/steam. Для этого напишите <@248453176745787393> в личные сообщения. Если данные источники перевода Вам не доступны, мы можем поискать другой вариант перевода. \n\n**Все полученные переводы пойдут на рекламу и развитие сервера**`)
            await interaction.followUp({
                //files: ['https://imgur.com/tFM2Hd6.png'],
                embeds: [embed],
                ephemeral: true
            })
        }
    }

    // INFO SELECT-MENU
    if(interaction.customId == 'info_select'){
        let review_emoji = Util.findEmoji(`review_emoji`)
        const devices = interaction.member.presence?.clientStatus || {}
        let mobile = Boolean(Object.hasOwn(devices, 'mobile'))
        let desktop = Boolean(Object.hasOwn(devices, 'desktop'))
        await interaction.deferUpdate()
        await interaction.editReply({components: [INFO_SELECT_MENU()]})
        if(interaction.values[0] == '1'){
            let embed = new Discord.MessageEmbed().setColor(noColor())
            .setDescription(`Для того, чтобы получить роль <@&812395998264557580> и уведомления о начале трансляции начали автоматически  появлялись в <#812395360215236639>, нужно:\n\n• Иметь 150 и более фолловеров\n• Проводить минимум 1 стрим в неделю\n• Вставить в описание под стримом постоянное приглашение на наш дискорд сервер\n• Картинку можете вставить свою либо нашу (она прикреплена ниже)\n\nПосле того, как все сделаете  или будут вопросы, отпишите одному из <@&803053033259794482>`)
            .setImage(`https://imgur.com/mNRnbrt.png`)
            await interaction.followUp({
                files: ['https://imgur.com/s7nCpg9.png'],
                embeds: [embed],
                ephemeral: true
            })
        } else if(interaction.values[0] == '2'){
            let embed = new Discord.MessageEmbed().setColor(noColor())
            .setDescription(`Пользователь набравший наибольший уровень за неделю, получает <@&803024816847978537> на 7д и 1000 <:CHPOKI_COIN:894630924761825331>\n\nКаждую неделю, начиная с понедельника 0:00, сбрасывается уровень. Вы  можете посмотреть свой уровень и таблицу лидеров в <#841889007654141982> используя команду !lb\n\nОпыт в голосовых каналах начисляется при условии, что в войсе находятся 2 и более участников с включенными микрофонами и звуком\n\nПользователи с ролями <@&803053033259794482> <@&830896489215688714> <@&889544926117896203> <@&803024816847978537> не участвуют в недельном опыте\n\nПосмотреть статистику уровней за все время, можно в <#841889007654141982> используя команду !lb global или !lb перейдя по кнопке в глобальную`)
            await interaction.followUp({
                files: ['https://imgur.com/n5hDLyi.png'],
                embeds: [embed],
                ephemeral: true
            })
        } else if(interaction.values[0] == '3'){
            let embed = new Discord.MessageEmbed().setColor(noColor())
            .setDescription(`**Тебе понравился наш сервер? Ты нашел друзей или вторую половинку?**\n\nИ все ещё хочешь познакомиться с новыми личностями? \nУ нас есть способ привлечь ещё больше людей!\nПросто оставь свой отзыв на [сайте](https://server-discord.com/705508214019588116)\n\n**Пусть все знают , что у нас ламповое общение и комфортный сервер!**\n\n${review_emoji} Очень любим вас. От администрации Ponime`)
            await interaction.followUp({
                files: ['https://imgur.com/RAwf4nx.png'],
                components: [REVIEW_SITE_LINK_BUTTON(mobile, desktop)],
                embeds: [embed],
                ephemeral: true
            })
        } else if(interaction.values[0] == '4'){
            let embed = new Discord.MessageEmbed().setColor(noColor())
            .setDescription(`**У нашего сервера есть соц.сети, куда мы постим контент с сервера**\n\nЕсли у Вас есть какой то контент с сервера, мы можем его залить в одну из наших соц.сетей\n\nПо поводу добавление контента - скиньте и отпишите <@248453176745787393>`)
            await interaction.followUp({
                files: ['https://imgur.com/UBRl8v4.png'],
                components: [SOCIAL_LINK_BUTTONS()],
                embeds: [embed],
                ephemeral: true
            })
        }
    }
});
