const shuffle = require("shuffle-array")
const games = new Set();
const Discord = require("discord.js");
const Collect = require("./collect");
const { noColor } = require("./Colours");
const Util = require('./Util')
const coin = Util.findEmoji(`CHPOKI_COIN`)

/** 
    * @param {Discord.Message || Discord.CommandInteraction} message The Message Object or the Interaction Object sent by the user
    * @param {object} options The options object (optional)
    * @returns Promise<Object>
    * @async
    * @example
    * const blackjack = require("discord-blackjack")
    * // other code here
    *
    * // if you are using prefix commands
    * client.on("messageCreate", async message => {
    *     if (message.content === "!blackjack") {
    *         blackjack(message)        
    *     }
    * })

    * // if you are using slash commands
    * client.on("interactionCreate", async interaction => {
    *     if (!interaction.isCommand) return;
    *     
    *     if (interaction.commandName === "blackjack") {
    *         blackjack(interaction)
    *     }
    * })
    * 
    * // other code here
*/


module.exports = async (message, options, amount) => {
    // check if all the variables given are valid
    if (!message) throw new Error("[MISSING_PARAMETER] The message or interaction parameter was not provided, was null or undefined.")
    
    // check if message and commandInteraction aren't something made up
    if (!(message instanceof Discord.Message) && !(message instanceof Discord.CommandInteraction)) throw new Error("[INVALID_PARAMATER] The message or interaction parameter provided is not valid.")

    // set all the options
    if (!options) options = {} // if options were not provided, make an empty object
    options.transition === "edit" ? options.transition = "edit" : options.transition = "delete" // how they want the embeds to be transitioned
    options.buttons === false ? options.buttons = false : options.buttons = true // check if buttons were enabled
    options.doubledown === false ? options.doubledown = false : options.doubledown = true // check if double down should appear
    options.split === false ? options.split = false : options.split = true // check if split should appear
    options.resultEmbed === false ? options.resultEmbed = false : options.resultEmbed = true // check if the result embed should be displayed
    options.normalEmbed === false ? options.normalEmbed = false : options.normalEmbed = true // check if they want the default embed when playing
    !options.emojis ? options.emojis = {} : options.emojis
    
    options.emojis = {
        clubs: options.emojis?.clubs || "♣️",
        spades: options.emojis?.spades || "♠️",
        hearts: options.emojis?.hearts || "♥️",
        diamonds: options.emojis?.diamonds || "♦️"
    }
     
    // set what type the message is
    let commandType
    if (message instanceof Discord.Message) {
        commandType = "message"
    } else if (message instanceof Discord.CommandInteraction) {
        commandType = "interaction"
    }

    options.commandType = commandType

    // check if options is an object
    if (options && !(options instanceof Object)) throw new Error(`[INVALID_PARAMATER] The options parameter expected an object, but recieved ${Array.isArray(options) ? "array" : typeof options }`)

    // check if the emojis option is an object
    if (typeof options.emojis !== "object") throw new Error(`[INVALID_PARAMATER] The options.emojis parameter expected an object, but recieved ${typeof options}.`)

    // check if the properties for the options.emojis object are strings.
    if (typeof options.emojis.spades !== "string") throw new Error(`[INVALID_PARAMATER] The emojis.spades option expected a string, but recieved ${typeof options.emojis.spades}`)
    if (typeof options.emojis.hearts !== "string") throw new Error(`[INVALID_PARAMATER] The emojis.hearts option expected a string, but recieved ${typeof options.emojis.hearts}`)
    if (typeof options.emojis.diamonds !== "string") throw new Error(`[INVALID_PARAMATER] The emojis.diamonds option expected a string, but recieved ${typeof options.emojis.diamonds}`)
    if (typeof options.emojis.clubs !== "string") throw new Error(`[INVALID_PARAMATER] The emojis.clubs option expected a string, but recieved ${typeof options.emojis.clubs}`)

    // check if the normalEmbed option was set to false but normalEmbedContent was not provided
    if (options.normalEmbed === false && !options.normalEmbedContent) throw new Error("[MISSING_PARAMETER] The normalEmbedContent option was not provided, was null or undefined when normalEmbed was set to false.")

    // check if the normalEmbed option was set to false but normalEmbedContent is not a MessageEmbed
    if (options.normalEmbed === false && typeof options.normalEmbedContent !== "object") throw new Error("[INVALID_PARAMATER] The normalEmbedContent parameter provided is not valid.")

    let starterMessage;

    // defer the reply if the commandType is interaction and if the reply has not been deffered
    if (commandType === "interaction" && !message.deferred && !message.replied) {
        starterMessage = await message.deferReply()
    } else if (commandType === "message") {
        starterMessage = await message.reply({ embeds: [{ title: "Игра начинается", description: "Игра скоро начнется, будьте готовы!" }] })
    }

    // check if the user is playing a game
    if (games.has(message.member.id)) {
        if (commandType === "message") {
            message.reply("У вас уже идет игра!")
        } else if (commandType === "interaction") {
            if (message.replied || message.deferred) {
                message.followUp({ content: "У вас уже идет игра!" })
            } else {
                message.reply({ content: "У вас уже идет игра!" })
            }
        }
        return {
            result: "None",
            method: "None",
            ycard: "None",
            dcard: "None"
        }
    }
    

    // set all the variables
    let normalEmbedContent = options.normalEmbedContent ?? "None"
    let transition = options.transition
    let buttons = options.buttons 
    let doubledown = false
    let split = false
    let resultEmbed = options.resultEmbed
    let normalEmbed = options.normalEmbed
    let userId = message.member.id
    let isSoft = false
    let method = "None"
    let copiedEmbed = {
        content: "",
        value: ""
    }

    // set the decks
    let DECK = [
        { suit: 'clubs', rank: 'A', value: [1, 11], emoji: options.emojis.clubs },
        { suit: 'clubs', rank: '2', value: 2, emoji: options.emojis.clubs },
        { suit: 'clubs', rank: '3', value: 3, emoji: options.emojis.clubs },
        { suit: 'clubs', rank: '4', value: 4, emoji: options.emojis.clubs },
        { suit: 'clubs', rank: '5', value: 5, emoji: options.emojis.clubs },
        { suit: 'clubs', rank: '6', value: 6, emoji: options.emojis.clubs },
        { suit: 'clubs', rank: '7', value: 7, emoji: options.emojis.clubs },
        { suit: 'clubs', rank: '8', value: 8, emoji: options.emojis.clubs },
        { suit: 'clubs', rank: '9', value: 9, emoji: options.emojis.clubs },
        { suit: 'clubs', rank: '10', value: 10, emoji: options.emojis.clubs },
        { suit: 'clubs', rank: 'J', value: 10, emoji: options.emojis.clubs },
        { suit: 'clubs', rank: 'Q', value: 10, emoji: options.emojis.clubs },
        { suit: 'clubs', rank: 'K', value: 10, emoji: options.emojis.clubs },

        { suit: 'diamonds', rank: 'A', value: [1, 11], emoji: options.emojis.diamonds },
        { suit: 'diamonds', rank: '2', value: 2, emoji: options.emojis.diamonds },
        { suit: 'diamonds', rank: '3', value: 3, emoji: options.emojis.diamonds },
        { suit: 'diamonds', rank: '4', value: 4, emoji: options.emojis.diamonds },
        { suit: 'diamonds', rank: '5', value: 5, emoji: options.emojis.diamonds },
        { suit: 'diamonds', rank: '6', value: 6, emoji: options.emojis.diamonds },
        { suit: 'diamonds', rank: '7', value: 7, emoji: options.emojis.diamonds },
        { suit: 'diamonds', rank: '8', value: 8, emoji: options.emojis.diamonds },
        { suit: 'diamonds', rank: '9', value: 9, emoji: options.emojis.diamonds },
        { suit: 'diamonds', rank: '10', value: 10, emoji: options.emojis.diamonds },
        { suit: 'diamonds', rank: 'J', value: 10, emoji: options.emojis.diamonds },
        { suit: 'diamonds', rank: 'Q', value: 10, emoji: options.emojis.diamonds },
        { suit: 'diamonds', rank: 'K', value: 10, emoji: options.emojis.diamonds },

        { suit: 'hearts', rank: 'A', value: [1, 11], emoji: options.emojis.hearts },
        { suit: 'hearts', rank: '2', value: 2, emoji: options.emojis.hearts },
        { suit: 'hearts', rank: '3', value: 3, emoji: options.emojis.hearts },
        { suit: 'hearts', rank: '4', value: 4, emoji: options.emojis.hearts },
        { suit: 'hearts', rank: '5', value: 5, emoji: options.emojis.hearts },
        { suit: 'hearts', rank: '6', value: 6, emoji: options.emojis.hearts },
        { suit: 'hearts', rank: '7', value: 7, emoji: options.emojis.hearts },
        { suit: 'hearts', rank: '8', value: 8, emoji: options.emojis.hearts },
        { suit: 'hearts', rank: '9', value: 9, emoji: options.emojis.hearts },
        { suit: 'hearts', rank: '10', value: 10, emoji: options.emojis.hearts },
        { suit: 'hearts', rank: 'J', value: 10, emoji: options.emojis.hearts },
        { suit: 'hearts', rank: 'Q', value: 10, emoji: options.emojis.hearts },
        { suit: 'hearts', rank: 'K', value: 10, emoji: options.emojis.hearts },

        { suit: 'spades', rank: 'A', value: [1, 11], emoji: options.emojis.spades },
        { suit: 'spades', rank: '2', value: 2, emoji: options.emojis.spades },
        { suit: 'spades', rank: '3', value: 3, emoji: options.emojis.spades },
        { suit: 'spades', rank: '4', value: 4, emoji: options.emojis.spades },
        { suit: 'spades', rank: '5', value: 5, emoji: options.emojis.spades },
        { suit: 'spades', rank: '6', value: 6, emoji: options.emojis.spades },
        { suit: 'spades', rank: '7', value: 7, emoji: options.emojis.spades },
        { suit: 'spades', rank: '8', value: 8, emoji: options.emojis.spades },
        { suit: 'spades', rank: '9', value: 9, emoji: options.emojis.spades },
        { suit: 'spades', rank: '10', value: 10, emoji: options.emojis.spades },
        { suit: 'spades', rank: 'J', value: 10, emoji: options.emojis.spades },
        { suit: 'spades', rank: 'Q', value: 10, emoji: options.emojis.spades },
        { suit: 'spades', rank: 'K', value: 10, emoji: options.emojis.spades },
    ]

    let hitbtn = { label: "Взять", style: 1, custom_id: "discord-blackjack-hitbtn", type: 2 }
    let standbtn = { label: "Оставить", style: 1, custom_id: "discord-blackjack-standbtn", type: 2 }
    let ddownbtn = { label: "Удвоить", style: 1, custom_id: "discord-blackjack-ddownbtn", type: 2 }
    let splitbtn = { label: "Разбить", style: 1, custom_id: "discord-blackjack-splitbtn", type: 2 }
    let cancelbtn = { label: "Отменить", style: 4, custom_id: "discord-blackjack-cancelbtn", type: 2 }

    let row1 = { type: 1, components: [hitbtn, standbtn] }
    let row2 = { type: 1, components: [cancelbtn] }

    shuffle(DECK)
    shuffle(DECK)
    shuffle(DECK)
    shuffle(DECK)
    shuffle(DECK)

    let currentDeck = DECK

    let yourcards = [currentDeck.pop(), currentDeck.pop()]
    let dealercards = [currentDeck.pop(), currentDeck.pop()]

    // set the embeds
    let winEmbed = { title: "Вы выйграли!", color: 0x00ae5d, description: "", fields: [], author: { name: message.member.user.tag, icon_url: message.member.user.displayAvatarURL() } }
    let loseEmbed = { title: "Вы проиграли!", color: 0x922a37, description: "", fields: [], author: { name: message.member.user.tag, icon_url: message.member.user.displayAvatarURL() } }
    let tieEmbed = { title: "Ничья", color: 0xcac719, description: "", fields: [], author: { name: message.member.user.tag, icon_url: message.member.user.displayAvatarURL() } }
    let timeoutEmbed = { title: "Время истекло!", color: 0x922a37, description: "У вас заняло больше 30 секунд на ответ. Игра отменена", fields: [], author: { name: message.member.user.tag, icon_url: message.member.displayAvatarURL() } } 
    let cancelEmbed = { title: "Игра была отменена", color: 0x922a37, description: "Вы решили отменить действуюущую игру", fields: [], author: { name: message.member.user.tag, icon_url: message.member.displayAvatarURL() } }
    let generalEmbed = normalEmbed === false ? options.normalEmbedContent : { title: "Блэкджек", color: noColor(), fields: [{ name: "Ваша рука", value: "", inline: true }, { name: `Рука ${message.client.user.username}`, value: "", inline: true }], author: { name: message.member.user.tag, icon_url: message.member.user.displayAvatarURL() } }

    // set the filters
    let allFilter = ["h", "hit", "s", "stand", "cancel"]
    
    if (yourcards[0].rank === yourcards[1].rank && yourcards[0].rank === "A") {
        yourcards[0].value = 11
        yourcards[1].value = 1
        isSoft = true
    } else if (yourcards[0].rank === "A") {
        yourcards[0].value = 11 
    } else if (yourcards[1].rank === "A") {
        yourcards[1].value = 11
    }


    if (yourcards.map(c => c.rank).includes("A")) isSoft = true

    generalEmbed.fields[0].value = `Карты: ${yourcards.map(c => `[\`${c.emoji} ${c.rank}\`](https://google.com)`).join(" ")}\nВсего:${isSoft ? " Софт" : ""} ${yourcards.map(c => c.value).reduce((a, b) => b+a)}`
    generalEmbed.fields[1].value = `Карты: [\`${dealercards[0].emoji} ${dealercards[0].rank}\`](https://google.com) \` ? \`\nВсего: \` ? \``

    options.embed = generalEmbed

    // check if we can do double down
    if (!yourcards.map(a => a.rank).includes("A") && doubledown === true) {
        if (yourcards.map(a => a.value).reduce((a, b) => b + a) === 9) {
            row1.components.push(ddownbtn)
            allFilter.push("d")
            allFilter.push("doubledown")
        } else if ((yourcards.map(a => a.value).reduce((a, b) => b+a) === 10 || yourcards.map(a => a.value).reduce((a, b) => b+a) === 11) && dealercards.map(a => a.value).reduce((a, b) => b+a) < 10) {
            row1.components.push(ddownbtn)
            allFilter.push("d")
            allFilter.push("doubledown")
        }
    }

    // check if we can do split
    if (yourcards[0].rank === yourcards[1].rank && split === true) {
        row1.components.push(splitbtn)
        allFilter.push("split")
    }
    
    // start the game

    if (yourcards.map(c => c.value).reduce((a, b) => b+a) === 21) {
        if (options.resultEmbed === true) {
            winEmbed.description = `У вас блэкджек! Вы получили ${coin}${amount}`
            winEmbed.fields.push({ name: "Ваша рука", value: `Карты: [\`${yourcards[0].emoji} ${yourcards[0].rank}\`](https://google.com) [\`${yourcards[1].emoji} ${yourcards[1].rank}\`](https://google.com)\nВсего: 21`, inline: true })
            winEmbed.fields.push({ name: `Рука ${message.client.user.username}`, value: `Карты: ${dealercards.map(c => `[\`${c.emoji} ${c.rank}\`](https://google.com)`).join(" ")}\nВсего: ${dealercards.map(card => card.rank === "A" ? 1 : card.value).reduce((a, b) => b+a)}`, inline: true })
            commandType === "message" ? message.reply({ embeds: [winEmbed] }) : message.reply({ embeds: [winEmbed] })
        }

        return {
            result: "WIN",
            method: "You had blackjack",
            ycard: yourcards,
            dcard: dealercards
        }
    }

    const editReply = async (msg, reply, commandType) => {
        if (commandType === "message") {
            return await msg.edit({ embeds: [reply], components: buttons ? [row1, row2] : [] })
        } else {
            return await message.editReply({ embeds: [reply], components: buttons ? [row1, row2] : [] })
        }
    }
    
    let currentMessage = await editReply(starterMessage, generalEmbed, commandType); 
    let finalResult = await (options.buttons ? new Collect().buttonCollect(currentMessage, userId, yourcards, dealercards, currentDeck, options, amount) : new Collect().messageCollect(currentMessage, userId, yourcards, dealercards, currentDeck, options, allFilter))

    if (options.resultEmbed === true) {
        
        let resultingEmbed = {
            "WIN": winEmbed,
            "LOSE": loseEmbed,
            "TIE": tieEmbed,
            "DOUBLE WIN": winEmbed,
            "DOUBLE LOSE": loseEmbed,
            "DOUBLE TIE": tieEmbed,
            "CANCEL": cancelEmbed,
            "TIMEOUT": timeoutEmbed
        }

        let finalEmbed = resultingEmbed[finalResult.result]
        if (finalResult.method !== "None") {
            finalEmbed.description = finalResult.method
        }
        finalEmbed.fields.push({ name: `Ваша рука`, value: `Карты: ${finalResult.ycard.map(c => `[\`${c.emoji} ${c.rank}\`](https://google.com)`).join(" ")}\nВсего: ${finalResult.ycard.map(card => card.value).reduce((a, b) => b+a)}`, inline: true })
        finalEmbed.fields.push({ name: `Рука ${message.client.user.username}`, value: `Карты: ${finalResult.dcard.map(c => `[\`${c.emoji} ${c.rank}\`](https://google.com)`).join(" ")}\nВсего: ${finalResult.dcard.map(card => card.rank === "A" ? 1 : card.value).reduce((a, b) => b+a)}`, inline: true })
        
        options.commandType === "message" ? currentMessage.edit({ embeds: [finalEmbed] }) : currentMessage.edit({ embeds: [finalEmbed] })
        
        
    }
    return finalResult;
    
}

