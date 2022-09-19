const Discord = require('discord.js')
const Util = require('./Util')
module.exports = {
    PUBLISH_CHANNEL_SELECTMENU(message, channels, state){
        if(!message) throw new Error(`Не был указан message в PUBLISH_CHANNEL_SELECTMENU`)
        if(!channels) throw new Error(`Не был указан список каналов в PUBLISH_CHANNEL_SELECTMENU`)
        let select = new Discord.MessageSelectMenu()
                    .setCustomId('channel_select')
                    .setDisabled(state || false)
                    .setMaxValues(1)
                    .setPlaceholder('Выберите канал публикациии')
    
                    channels.forEach(chan => {
                        let findChan = message.guild.channels.cache.get(chan)
                        if(!findChan) return
                        select.addOptions({
                            label: findChan.name,
                            value: findChan.id,
                        })
                    })

        let action = new Discord.MessageActionRow().addComponents([select])
        return action
    },

    FILM_SCHEDULE_SELECTMENU(state){
        let select = new Discord.MessageSelectMenu()
                    .setCustomId('channel_select')
                    .setDisabled(state || false)
                    .setMaxValues(1)
                    .setPlaceholder('Выберите шаблон')
    
        select.addOptions({
            label: `Для одного фильма/сериала`,
            value: `one_film`
        })

        select.addOptions({
            label: `Для голосования между фильмами/сериалами`,
            value: `two_films`
        })

        let action = new Discord.MessageActionRow().addComponents([select])
        return action
    },

    PLACE_CHANNEL_SELECT_MENU(message, channels, state){
        if(!message) throw new Error(`Не был указан message в PLACE_CHANNEL_SELECT_MENU`)
        if(!channels) throw new Error(`Не был указан список каналов в PLACE_CHANNEL_SELECT_MENU`)

        let select = new Discord.MessageSelectMenu()
        .setCustomId('channel_select')
        .setDisabled(state || false)
        .setMaxValues(1)
        .setPlaceholder('Выберите из списка')

        channels.forEach(chan => {
            let findChan = message.guild.channels.cache.get(chan.id)
            if(!findChan) return
            select.addOptions({
                label: findChan.name,
                value: findChan.id,
            })
        })

        let action = new Discord.MessageActionRow().addComponents([select])
        return action
    },

    DECLINE_BUTTON(state){
        let action = new Discord.MessageActionRow().addComponents(
            [
                new Discord.MessageButton()
                .setCustomId('decline_button')
                .setDisabled(state || false)
                .setStyle("DANGER")
                .setLabel('Отмена')
            ]
        )
        return action
    },

    YES_NO_BUTTONS(state){
        let action = new Discord.MessageActionRow().addComponents(
            [
                new Discord.MessageButton()
                .setCustomId('yes_button')
                .setDisabled(state || false)
                .setStyle("PRIMARY")
                .setLabel('Да'),

                new Discord.MessageButton()
                .setCustomId('no_button')
                .setDisabled(state || false)
                .setStyle("PRIMARY")
                .setLabel('Нет')
            ]
        )
        return action
    },

    CHANGE_OR_NOT_BUTTONS(state){
        let action = new Discord.MessageActionRow().addComponents(
            [
                new Discord.MessageButton()
                .setCustomId('no_change_button')
                .setDisabled(state || false)
                .setStyle("PRIMARY")
                .setLabel('Оставить'),

                new Discord.MessageButton()
                .setCustomId('change_button')
                .setDisabled(state || false)
                .setStyle("PRIMARY")
                .setLabel('Изменить')
            ]
        )
        return action
    },

    PUBLISH_DECLINE_BUTTONS(state){
        let action = new Discord.MessageActionRow().addComponents(
            [
                new Discord.MessageButton()
                .setCustomId('publish_button')
                .setDisabled(state || false)
                .setStyle('SUCCESS')
                .setLabel('Опубликовать'),

                new Discord.MessageButton()
                .setCustomId('decline_button')
                .setDisabled(state || false)
                .setStyle("DANGER")
                .setLabel('Отмена')
            ]
        )
        return action
    },
    
    FILM_OR_SERIAL_BUTTONS(state){
        let action = new Discord.MessageActionRow().addComponents(
            [
                new Discord.MessageButton()
                .setCustomId('film_button')
                .setDisabled(state || false)
                .setStyle('PRIMARY')
                .setLabel('Фильм'),

                new Discord.MessageButton()
                .setCustomId('serial_button')
                .setDisabled(state || false)
                .setStyle("PRIMARY")
                .setLabel('Сериал')
            ]
        )
        return action
    },

    REVIEWS_BUTTON(state){
        let action = new Discord.MessageActionRow().addComponents(
            [
                new Discord.MessageButton()
                .setCustomId('reviews_button')
                .setDisabled(state || false)
                .setStyle('PRIMARY')
                .setLabel('Отзывы')
            ]
        )
        return action
    },

    DEANON_BUTTON(state){
        let action = new Discord.MessageActionRow().addComponents(
            [
                new Discord.MessageButton()
                .setCustomId('deanon_button')
                .setDisabled(state || false)
                .setStyle('PRIMARY')
                .setLabel('Деанон')
            ]
        )
        return action
    },

    ARROWS_AND_BACK_BUTTONS(pg, page, state2, deanon){
        const left = Util.findEmoji('leftarrow')
        const right = Util.findEmoji('rightarrow')
        const checkState = (name) => {
            if (["previous"].includes(name) &&
                pg === 1)
                return true;
            if (["next"].includes(name) &&
                pg >= page)
                return true;
            return false;
        };
        let action = new Discord.MessageActionRow().addComponents(
            deanon ? [
                    new Discord.MessageButton()
                    .setCustomId('previous_button')
                    .setDisabled(state2 || checkState("previous"))
                    .setStyle('PRIMARY')
                    .setEmoji(left),

                    new Discord.MessageButton()
                    .setCustomId('next_button')
                    .setDisabled(state2 || checkState("next"))
                    .setStyle('PRIMARY')
                    .setEmoji(right),

                    new Discord.MessageButton()
                    .setCustomId('profile_button')
                    .setDisabled(state2)
                    .setStyle('PRIMARY')
                    .setLabel("Профиль"),

                    
                    new Discord.MessageButton()
                    .setCustomId('deanon_button')
                    .setDisabled(state2 || false)
                    .setStyle('PRIMARY')
                    .setLabel('TEST')
                    
            ] : 
            [
                new Discord.MessageButton()
                .setCustomId('previous_button')
                .setDisabled(state2 || checkState("previous"))
                .setStyle('PRIMARY')
                .setEmoji(left),

                new Discord.MessageButton()
                .setCustomId('next_button')
                .setDisabled(state2 || checkState("next"))
                .setStyle('PRIMARY')
                .setEmoji(right),

                new Discord.MessageButton()
                .setCustomId('profile_button')
                .setDisabled(state2)
                .setStyle('PRIMARY')
                .setLabel("Профиль"),       
            ]
        )
        return action
    },

    REVIEWS_SORT_SELECTMENU(def, state){
        let select = new Discord.MessageSelectMenu()
                    .setCustomId('sort_select')
                    .setDisabled(state || false)
                    .setMaxValues(1)
                    .setPlaceholder('Выберите способ сортировки')
    
                    select.addOptions({
                        label: `Сначала старые`,
                        value: `old`,
                        default: def == "old" ? true : false
                    })

                    select.addOptions({
                        label: `Сначала новые`,
                        value: `new`,
                        default: def == "new" ? true : false
                    })

                    select.addOptions({
                        label: `Положительные`,
                        value: `positive`,
                        default: def == "positive" ? true : false
                    })

                    select.addOptions({
                        label: `Отрицательные`,
                        value: `negative`,
                        default: def == "negative" ? true : false
                    })

        let action = new Discord.MessageActionRow().addComponents([select])
        return action
    },

    TEST_BUTTON(state){
        const shiba_love = Util.findEmoji('shiba_love')
        const shiba_angry = Util.findEmoji('shiba_angry')
        const shiba_question = Util.findEmoji('shiba_question')
        let select = new Discord.MessageSelectMenu()
                    .setCustomId('instagram_select')
                    .setDisabled(state || false)
                    .setMaxValues(1)
                    .setMinValues(0)
                    .setPlaceholder('Выберите роль для получения')

                    select.addOptions({
                        label: `Есть instagram | спрашивай`,
                        value: `1`,
                        emoji: shiba_love
                    })

                    select.addOptions({
                        label: `Есть instagram | отвали`,
                        value: `2`,
                        emoji: shiba_angry
                    })

                    select.addOptions({
                        label: `Нет instagram`,
                        value: `3`,
                        emoji: shiba_question
                    })

        let action = new Discord.MessageActionRow().addComponents([select])
        return action
    },

    ARROWS_BUTTONS(pg, page, state){
        const left = Util.findEmoji('leftarrow')
        const right = Util.findEmoji('rightarrow')
        const checkState = (name) => {
            if (["previous"].includes(name) &&
                pg === 1)
                return true;
            if (["next"].includes(name) &&
                pg >= page)
                return true;
            return false;
        };
        let action = new Discord.MessageActionRow().addComponents(
            [
                new Discord.MessageButton()
                .setCustomId('previous_button')
                .setDisabled(state || checkState("previous"))
                .setStyle('PRIMARY')
                .setEmoji(left),

                new Discord.MessageButton()
                .setCustomId('next_button')
                .setDisabled(state || checkState("next"))
                .setStyle('PRIMARY')
                .setEmoji(right),     
            ]
        )
        return action
    },

    STATUS_SELECT_MENU(state){
        let select = new Discord.MessageSelectMenu()
                    .setCustomId('status_select')
                    .setDisabled(state || false)
                    .setPlaceholder('Выберите роль для получения')

                    select.addOptions({
                        label: `Есть тян | НЕ приставать`,
                        value: `1`,
                        emoji: '👩‍❤️‍👨'
                    })

                    select.addOptions({
                        label: `Ищу тян | Поприставайте`,
                        value: `2`,
                        emoji: '👱‍♀️'
                    })

                    select.addOptions({
                        label: `Есть парень | НЕ приставать`,
                        value: `3`,
                        emoji: '👫'
                    })

                    select.addOptions({
                        label: `Ищу парня | Поприставайте`,
                        value: `4`,
                        emoji: '🧑'
                    })

                    select.addOptions({
                        label: `Никого не ищу | НЕ приставать`,
                        value: `5`,
                        emoji: '🤬'
                    })

        let action = new Discord.MessageActionRow().addComponents([select])
        return action
    },

    INSTAGRAM_SELECT_MENU(state){
        const shiba_love = Util.findEmoji('shiba_love')
        const shiba_angry = Util.findEmoji('shiba_angry')
        const shiba_question = Util.findEmoji('shiba_question')
        let select = new Discord.MessageSelectMenu()
                    .setCustomId('instagram_select')
                    .setDisabled(state || false)

                    .setPlaceholder('Выберите роль для получения')

                    select.addOptions({
                        label: `Есть instagram | спрашивай`,
                        value: `1`,
                        emoji: shiba_love
                    })

                    select.addOptions({
                        label: `Есть instagram | отвали`,
                        value: `2`,
                        emoji: shiba_angry
                    })

                    select.addOptions({
                        label: `Нет instagram`,
                        value: `3`,
                        emoji: shiba_question
                    })

        let action = new Discord.MessageActionRow().addComponents([select])
        return action
    },

    POS_SELECT_MENU(state){
        let pos_1_emoji = Util.findEmoji('pos_1')
        let pos_2_emoji = Util.findEmoji('pos_2')
        let pos_3_emoji = Util.findEmoji('pos_3')
        let pos_4_emoji = Util.findEmoji('pos_4')
        let pos_5_emoji = Util.findEmoji('pos_5')
        let select = new Discord.MessageSelectMenu()
                    .setCustomId('pos_select')
                    .setDisabled(state || false)

                    .setPlaceholder('Выберите роль для получения')

                    select.addOptions({
                        label: `pos 1`,
                        value: `1`,
                        emoji: pos_1_emoji
                    })

                    select.addOptions({
                        label: `pos 2`,
                        value: `2`,
                        emoji: pos_2_emoji
                    })

                    select.addOptions({
                        label: `pos 3`,
                        value: `3`,
                        emoji: pos_3_emoji
                    })

                    select.addOptions({
                        label: `pos 4`,
                        value: `4`,
                        emoji: pos_4_emoji
                    })

                    select.addOptions({
                        label: `pos 5`,
                        value: `5`,
                        emoji: pos_5_emoji
                    })

        let action = new Discord.MessageActionRow().addComponents([select])
        return action
    },

    GAMES1_SELECT_MENU(state){
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
        let select = new Discord.MessageSelectMenu()
                    .setCustomId('games1_select')
                    .setDisabled(state || false)

                    .setPlaceholder('Выберите роль для получения')

                    select.addOptions({
                        label: `Dota 2`,
                        value: `1`,
                        emoji: dota2_emoji
                    })

                    select.addOptions({
                        label: `CS:GO`,
                        value: `2`,
                        emoji: csgo_emoji
                    })

                    select.addOptions({
                        label: `GTA V`,
                        value: `3`,
                        emoji: gta5_emoji
                    })

                    select.addOptions({
                        label: `Osu`,
                        value: `4`,
                        emoji: osu_emoji
                    })

                    select.addOptions({
                        label: `Overwatch`,
                        value: `5`,
                        emoji: overwatch_emoji
                    })

                    select.addOptions({
                        label: `Apex Legends`,
                        value: `6`,
                        emoji: apex_emoji
                    })

                    select.addOptions({
                        label: `Настолки - браузерки`,
                        value: `7`,
                        emoji: games_emoji
                    })

                    select.addOptions({
                        label: `Minecraft`,
                        value: `8`,
                        emoji: minecraft_emoji
                    })

                    select.addOptions({
                        label: `PUBG`,
                        value: `9`,
                        emoji: pubg_emoji
                    })

                    select.addOptions({
                        label: `Fortnite`,
                        value: `10`,
                        emoji: fortnite_emoji
                    })

        let action = new Discord.MessageActionRow().addComponents([select])
        return action
    },

    GAMES2_SELECT_MENU(state){
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
        let select = new Discord.MessageSelectMenu()
                    .setCustomId('games2_select')
                    .setDisabled(state || false)

                    .setPlaceholder('Выберите роль для получения')

                    select.addOptions({
                        label: `Valorant`,
                        value: `1`,
                        emoji: valorant_emoji
                    })

                    select.addOptions({
                        label: `Dead by Daylight`,
                        value: `2`,
                        emoji: dbd_emoji
                    })

                    select.addOptions({
                        label: `Tom Clancy's Rainbow Six`,
                        value: `3`,
                        emoji: rainbow6_emoji
                    })

                    select.addOptions({
                        label: `Don't Starve Together`,
                        value: `4`,
                        emoji: dont_starve_emoji
                    })

                    select.addOptions({
                        label: `Call of Duty Warzone`,
                        value: `5`,
                        emoji: cod_emoji
                    })

                    select.addOptions({
                        label: `Rust`,
                        value: `6`,
                        emoji: rust_emoji
                    })

                    select.addOptions({
                        label: `Terraria`,
                        value: `7`,
                        emoji: terraria_emoji
                    })

                    select.addOptions({
                        label: `World of Warcraft`,
                        value: `8`,
                        emoji: wow_emoji
                    })

                    select.addOptions({
                        label: `Genshin Impact`,
                        value: `9`,
                        emoji: genshin_emoji
                    })

                    select.addOptions({
                        label: `League of Legends`,
                        value: `10`,
                        emoji: lol_emoji
                    })

        let action = new Discord.MessageActionRow().addComponents([select])
        return action
    },

    GAMES3_SELECT_MENU(state){
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
        let select = new Discord.MessageSelectMenu()
                    .setCustomId('games3_select')
                    .setDisabled(state || false)

                    .setPlaceholder('Выберите роль для получения')

                    select.addOptions({
                        label: `Among Us`,
                        value: `1`,
                        emoji: amongus_emoji
                    })

                    select.addOptions({
                        label: `Brawl Stars`,
                        value: `2`,
                        emoji: brawl_emoji
                    })

                    select.addOptions({
                        label: `Hearthstone`,
                        value: `3`,
                        emoji: hearthstone_emoji
                    })

                    select.addOptions({
                        label: `Phasmophobia`,
                        value: `4`,
                        emoji: phasmaphobia_emoji
                    })

                    select.addOptions({
                        label: `Mobile Legends`,
                        value: `5`,
                        emoji: mobile_legends_emoji
                    })

                    select.addOptions({
                        label: `Escape from Tarkov`,
                        value: `6`,
                        emoji: tarkov_emoji
                    })

                    select.addOptions({
                        label: `Valheim`,
                        value: `8`,
                        emoji: valheim_emoji
                    })

                    select.addOptions({
                        label: `Моя кофейня`,
                        value: `9`,
                        emoji: my_coffeeshop_emoji
                    })

                    select.addOptions({
                        label: `Warface`,
                        value: `7`,
                        emoji: warface_emoji
                    })

                    select.addOptions({
                        label: `Rocket League`,
                        value: `10`,
                        emoji: rocket_league_emoji
                    })

        let action = new Discord.MessageActionRow().addComponents([select])
        return action
    },

    WATCH_SELECT_MENU(state){
        let watch1_emoji = Util.findEmoji('vse')
        let watch2_emoji = Util.findEmoji('anime')
        let watch3_emoji = Util.findEmoji('films')
        let select = new Discord.MessageSelectMenu()
                    .setCustomId('watch_select')
                    .setDisabled(state || false)

                    .setPlaceholder('Выберите роль для получения')

                    select.addOptions({
                        label: `Смотрю все`,
                        value: `1`,
                        emoji: watch1_emoji
                    })

                    select.addOptions({
                        label: `Смотрю аниме`,
                        value: `2`,
                        emoji: watch2_emoji
                    })

                    select.addOptions({
                        label: `Смотрю фильмы`,
                        value: `3`,
                        emoji: watch3_emoji
                    })

        let action = new Discord.MessageActionRow().addComponents([select])
        return action
    },
    
    VACATION_SELECT_MENU(state){
        let stream_emoji = Util.findEmoji('kino_master')
        let custom_emoji = Util.findEmoji('custom_master')
        let games_emoji = Util.findEmoji('games_master')
        let control_emoji = Util.findEmoji('control')
        let select = new Discord.MessageSelectMenu()
                    .setCustomId('vacation_select')
                    .setDisabled(state || false)
                    .setPlaceholder('Выберите вакансию для получения информации')

                    select.addOptions({
                        label: `Кино-стример`,
                        value: `1`,
                        emoji: stream_emoji
                    })

                    select.addOptions({
                        label: `Кастом-мастер`,
                        value: `2`,
                        emoji: custom_emoji
                    })

                    select.addOptions({
                        label: `Ведущий настолок`,
                        value: `3`,
                        emoji: games_emoji
                    })

                    select.addOptions({
                        label: `Модерация сервера`,
                        value: `4`,
                        emoji: control_emoji
                    })

        let action = new Discord.MessageActionRow().addComponents([select])
        return action
    },

    VACTION_LINK_BUTTON(type, mobile, desktop){
        let action = new Discord.MessageActionRow().addComponents(
            [
                new Discord.MessageButton()
                .setDisabled(false)
                .setStyle('LINK')
                .setLabel(
                    desktop && !mobile ? '⁣ ⁣⁣ ⁣ᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠПодать заявкуᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠ⁣ ⁣ ⁣⁣' :
                    desktop && mobile ? 'ᅠᅠᅠᅠᅠᅠПодать заявкуᅠᅠᅠᅠᅠ⁣' :
                    'ᅠᅠᅠᅠᅠᅠПодать заявкуᅠᅠᅠᅠᅠ'
                    )
                .setURL(
                    type == 'films' ? 'https://docs.google.com/forms/d/10GLV5w18QevQbvrKRK4reTVCWP-_V3CIi6D8fEC1_Tg/edit' :
                    type == 'custom' ? 'https://docs.google.com/forms/d/1NIBwACIS24nJJ9axyop5yR6-lDBQHfegH07C_6uD2VA/edit' :
                    type == 'games' ? 'https://docs.google.com/forms/d/1ckQMf6G0A4YSLyB_3CPyvlXYYk0BMEP78dGsyWHtsJw/edit#responses' :
                    type == 'moderation' ? 'https://docs.google.com/forms/d/e/1FAIpQLSfp0AiMbyzQBYn9xin9VQEIf3Cv6XzgyxpB2mda468qT5ZVkg/viewform' : null
                )
            ]
        )
        return action
    },

    REVIEW_SITE_LINK_BUTTON(mobile, desktop){
        let action = new Discord.MessageActionRow().addComponents(
            [
                new Discord.MessageButton()
                .setDisabled(false)
                .setStyle('LINK')
                .setLabel(
                    desktop && !mobile ? '⁣ ⁣⁣ ⁣ᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠОставить отзывᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠ⁣ ⁣ ⁣⁣' :
                    desktop && mobile ? 'ᅠᅠᅠᅠОставить отзывᅠᅠᅠᅠ⁣' :
                    'ᅠᅠᅠᅠОставить отзывᅠᅠᅠᅠ'
                    )
                .setURL(`https://server-discord.com/705508214019588116`)
            ]
        )
        return action
    },

    INVENTORY_SELECT_MENU(message, items, state){
        let select = new Discord.MessageSelectMenu()
                    .setCustomId('inventory_select')
                    .setDisabled(state || false)
                    .setPlaceholder('Выберите предмет для использования')

                    items.forEach(item => {
                        let name = item.name == `Снятие негативной роли` ? item.name : message.guild.roles.cache.get(item.name).name
                        let value = name == `Снятие негативной роли` ? '0' : message.guild.roles.cache.get(item.name).id.toString() + '_' + item.duration.toString()
                        select.addOptions({
                            label: name,
                            value: value
                        })
                    })

        let action = new Discord.MessageActionRow().addComponents([select])
        return action
    },

    
    NEGATIVE_SELECT_MENU(message, items, state){
        let select = new Discord.MessageSelectMenu()
                    .setCustomId('negative_select')
                    .setDisabled(state || false)
                    .setPlaceholder('Выберите роль')

                    items.forEach(item => {
                        let findRole = message.guild.roles.cache.get(item)
                        if(!item) return
                        select.addOptions({
                            label: findRole.name,
                            value: findRole.id
                        })
                    })

        let action = new Discord.MessageActionRow().addComponents([select])
        return action
    },

    INFINITE_WEEK_DECLINE_BUTTONS(infinite, week, infinite_state, state){
        const coin = Util.findEmoji('CHPOKI_COIN')
        let action = new Discord.MessageActionRow().addComponents(
            [
                new Discord.MessageButton()
                .setCustomId('infinite_button')
                .setDisabled(state || infinite_state)
                .setStyle('PRIMARY')
                .setEmoji(coin)
                .setLabel(`${infinite} Навсегда`),

                new Discord.MessageButton()
                .setCustomId('week_button')
                .setDisabled(state)
                .setStyle('PRIMARY')
                .setEmoji(coin)
                .setLabel(`${week} Неделю`),

                new Discord.MessageButton()
                .setCustomId('decline_button')
                .setDisabled(state)
                .setStyle('DANGER')
                .setLabel(`Отмена`),
            ]
        )
        return action
    },

    CHAT_INFO__SELECT_MENU(state){
        let select = new Discord.MessageSelectMenu()
                    .setCustomId('chat_info_select')
                    .setDisabled(state || false)
                    .setPlaceholder('Выберите чат/категорию для получения информации')

                    select.addOptions({
                        label: `Чат`,
                        value: `10`,
                        emoji: '💬'
                    })

                    select.addOptions({
                        label: `Немодерируемый`,
                        value: `6`,
                        emoji: '💬'
                    })

                    select.addOptions({
                        label: `Поиск пати`,
                        value: `1`,
                        emoji: '📢'
                    })

                    select.addOptions({
                        label: `Знакомства`,
                        value: `2`,
                        emoji: '💕'
                    })


                    select.addOptions({
                        label: `Лента-Ponime`,
                        value: `3`,
                        emoji: '📝'
                    })

                    select.addOptions({
                        label: `Корзина`,
                        value: `7`,
                        emoji: '🗑️'
                    })

                    select.addOptions({
                        label: `Предложения`,
                        value: `4`,
                        emoji: '💡'
                    })

                    select.addOptions({
                        label: `Жалобы`,
                        value: `5`,
                        emoji: '💢'
                    })

                    select.addOptions({
                        label: `Ивент категория`,
                        value: `8`,
                        emoji: '🔔'
                    })

                    select.addOptions({
                        label: `Кинозал категория`,
                        value: `9`,
                        emoji: '🎞️'
                    })

        let action = new Discord.MessageActionRow().addComponents([select])
        return action
    },

    FAQ_SELECT_MENU(state){
        let chpoki_coin_gif = Util.findEmoji('CHPOKI_COIN_GIF')
        let questions = Util.findEmoji('questions')
        let reviews = Util.findEmoji('reviews')
        let donation = Util.findEmoji('donation')
        let select = new Discord.MessageSelectMenu()
                    .setCustomId('faq_select')
                    .setDisabled(state || false)
                    .setPlaceholder('Выберите интересующий пункт') //

                    select.addOptions({
                        label: `Серверная валюта`,
                        value: `1`,
                        emoji: chpoki_coin_gif
                    })

                    select.addOptions({
                        label: `Не могу разобраться в сервере`,
                        value: `2`,
                        emoji: questions
                    })

                    select.addOptions({
                        label: `Система отзывов`,
                        value: `3`,
                        emoji: reviews
                    })

                    select.addOptions({
                        label: `Как поддержать сервер`,
                        value: `4`,
                        emoji: donation
                    })

        let action = new Discord.MessageActionRow().addComponents([select])
        return action
    },

    INSTRUCTIONS_LINK_BUTTON(){
        let action = new Discord.MessageActionRow().addComponents(
            [
                new Discord.MessageButton()
                .setDisabled(false)
                .setStyle('LINK')
                .setLabel(`Инструкция для ПК`)
                .setURL(`https://www.youtube.com/watch?v=WHI4cCP1ivQ`),

                new Discord.MessageButton()
                .setDisabled(false)
                .setStyle('LINK')
                .setLabel(`Инструкция для телефона`)
                .setURL(`https://www.youtube.com/watch?v=fdbycAvqLYU`),
            ]
        )
        return action
    },

    INFO_SELECT_MENU(state){
        let streamer = Util.findEmoji('streamer')
        let leveling_system = Util.findEmoji('leveling_system')
        let review = Util.findEmoji('review')
        let social = Util.findEmoji('social')
        let select = new Discord.MessageSelectMenu()
                    .setCustomId('info_select')
                    .setDisabled(state || false)
                    .setPlaceholder('Выберите для получения информации')

                    select.addOptions({
                        label: `Вы стример?`,
                        value: `1`,
                        emoji: streamer
                    })

                    select.addOptions({
                        label: `Система уровней`,
                        value: `2`,
                        emoji: leveling_system
                    })

                    select.addOptions({
                        label: `Отзыв о сервере`,
                        value: `3`,
                        emoji: review
                    })

                    select.addOptions({
                        label: `Социальные сети`,
                        value: `4`,
                        emoji: social
                    })


        let action = new Discord.MessageActionRow().addComponents([select])
        return action
    },

    SOCIAL_LINK_BUTTONS(){
        let vk = Util.findEmoji('vk')
        let steam = Util.findEmoji('steam')
        let tiktok = Util.findEmoji('tiktok')
        let telegram = Util.findEmoji('telegram')
        let instagram = Util.findEmoji('instagram')
        let action = new Discord.MessageActionRow().addComponents(
            [
                new Discord.MessageButton()
                .setDisabled(false)
                .setStyle('LINK')
                //.setLabel(`VK`)
                .setEmoji(vk)
                .setURL(`https://vk.com/ponime_3`),

                new Discord.MessageButton()
                .setDisabled(false)
                .setStyle('LINK')
                //.setLabel(`Steam`)
                .setEmoji(steam)
                .setURL(`https://steamcommunity.com/groups/ponime`),

                new Discord.MessageButton()
                .setDisabled(false)
                .setStyle('LINK')
                //.setLabel(`TikTok`)
                .setEmoji(tiktok)
                .setURL(`https://www.tiktok.com/@_ponime_`),

                new Discord.MessageButton()
                .setDisabled(false)
                .setStyle('LINK')
                //.setLabel(`Telegram`)
                .setEmoji(telegram)
                .setURL(`https://t.me/ponime007`),

                new Discord.MessageButton()
                .setDisabled(false)
                .setStyle('LINK')
                //.setLabel(`Instagram`)
                .setEmoji(instagram)
                .setURL(`https://www.instagram.com/ponime_3/`),
            ]
        )
        return action
    },
}