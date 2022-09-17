const chalk = require('chalk')

module.exports = {
    name: "help",
    description: "Описание команд",
    aliases: ["помощь", "хелп"],
    run: async (bot, message, args) => {

        try{


            const Discord = require('discord.js')
            const Colours = require('../../functions/Colours')
            const Guild = require('../../models/guild')
            const prefix = bot.server.get(message.guild.id).prefix

            const MainMenu = {
                label: "Главное меню",
                value: "main_menu",
                description: "Список всех доступных команд",
                default: true
            }
            const changeToMainMenu = () => {
                let embed = new Discord.MessageEmbed()
                .setTitle(`Главное меню`)
                .setColor(Colours.noColor())
                .setThumbnail(message.guild.iconURL({dynamic: true}))
                .setDescription(`Вы можете узнать о примерах, альтернативах и пояснениях команды, добавив к ней help\nПример: **\`${prefix}lb help\`**`)
                .setFields(
                    {name: `● Модерирование`, value: `**\`${prefix}ban\`** **\`${prefix}unban\`** **\`${prefix}kick\`** **\`${prefix}mute\`** **\`${prefix}unmute\`** **\`${prefix}clear\`** **\`${prefix}warn\`** **\`${prefix}warn remove\`** **\`${prefix}warns\`** **\`${prefix}temprole\`** **\`${prefix}boost\`** **\`${prefix}set\`** **\`${prefix}autorole\`** **\`${prefix}giveaway start\`** **\`${prefix}giveaway stop\`** **\`${prefix}giveaway reroll\`** **\`${prefix}event create\`** **\`${prefix}event list\`** **\`${prefix}setprefix\`** **\`${prefix}invites\`** **\`${prefix}automod\`** **\`${prefix}caps\`** **\`${prefix}spam\`** **\`${prefix}roles\`** **\`${prefix}delete\`**`},
                    //{name: `● Экономика и Левелинг`, value: `**\`${prefix}rank\`** **\`${prefix}lb\`** **\`${prefix}bal\`** **\`${prefix}dep\`** **\`${prefix}with\`** **\`${prefix}work\`** **\`${prefix}crime\`** **\`${prefix}rob\`** **\`${prefix}shop\`**`},
                    {name: `● Экономика и Левелинг`, value: `Экономика временно отключена\n**\`${prefix}lb\`** **\`${prefix}rank\`**`},
                    {name: `● Статистика и Профиль`, value: `**\`${prefix}user\`** **\`${prefix}profile\`** **\`${prefix}name\`** **\`${prefix}age\`** **\`${prefix}steam\`** **\`${prefix}inst\`** **\`${prefix}vk\`**`},
                    {name: `● Веселье`, value: `**\`${prefix}ball\`** **\`${prefix}love\`** **\`${prefix}roll\`**`},
                    {name: `● Полезное`, value: `**\`${prefix}avatar\`**`},
                    {name: `● Действия`, value: `**\`${prefix}bite\`** **\`${prefix}blush\`** **\`${prefix}bonk\`** **\`${prefix}bully\`** **\`${prefix}cringe\`** **\`${prefix}cry\`** **\`${prefix}cuddle\`** **\`${prefix}dance\`** **\`${prefix}handhold\`** **\`${prefix}happy\`** **\`${prefix}highfive\`** **\`${prefix}hug\`** **\`${prefix}kill\`** **\`${prefix}kiss\`** **\`${prefix}lick\`** **\`${prefix}pat\`** **\`${prefix}poke\`** **\`${prefix}slap\`** **\`${prefix}smile\`** **\`${prefix}wave\`** **\`${prefix}wink\`** **\`${prefix}sex\`** **\`${prefix}kuni\`** **\`${prefix}suck\`**`},
                )

                return embed
            };

            const EconomyMenu = {
                label: "Меню Экономики",
                value: "economy_menu",
                description: "Список команд экономики"
            }
            const changeToEconomyMenu = () => {
                let embed = new Discord.MessageEmbed()
                .setTitle(`Меню Экономики`)
                .setColor(Colours.noColor())
                .setThumbnail(message.guild.iconURL({dynamic: true}))
                //.setDescription(`● **\`${prefix}rank [@user]\`** - карточка пользователя\n● **\`${prefix}lb [global]\`** - таблица лидеров\n● **\`${prefix}bal [@user]\`** - баланс пользователя\n● **\`${prefix}dep <Кол-во>\`** - положить в банк\n● **\`${prefix}with <Кол-во>\`** - снять с банка\n● **\`${prefix}work\`** - поработать\n● **\`${prefix}crime\`** - совершить преступлние\n● **\`${prefix}rob <@user>\`** - обокрасть пользователя\n● **\`${prefix}shop\`** - магазин ролей`)
                .setDescription(`● **\`${prefix}rank [@user]\`** - карточка пользователя\n● **\`${prefix}lb\`** - таблица лидеров`)
                .setFields(
                    {name: `Пояснение`, value: `**\`[]\`** - необязательно для заполнения\n**\`<>\`** - обязательно для заполнения`}
                )

                return embed
            };

            const ProfileMenu = {
                label: "Меню Профиля и Статистики",
                value: "profile_menu",
                description: "Список команд профиля и статистики"
            }
            const changeToProfileMenu = () => {
                let embed = new Discord.MessageEmbed()
                .setTitle(`Меню Профиля и Статистики`)
                .setColor(Colours.noColor())
                .setThumbnail(message.guild.iconURL({dynamic: true}))
                .setDescription(`● **\`${prefix}user [@user]\`** - информация о пользователе\n● **\`${prefix}profile [@user]\`** - статистика и профиль пользователя\n● **\`${prefix}name <Имя>\`** - задать имя в профиле\n● **\`${prefix}age <Возраст>\`** - задать возраст в профиле\n● **\`${prefix}steam <Ссылка>\`** - задать ссылку на стим в профиле\n● **\`${prefix}inst <Ссылка>\`** - задать ссылку на инсту в профиле\n● **\`${prefix}vk <Ссылка>\`** - задать ссылку на вк в профиле`)
                .setFields(
                    {name: `Пояснение`, value: `**\`[]\`** - необязательно для заполнения\n**\`<>\`** - обязательно для заполнения`}
                )

                return embed
            };

            const ModeratorMenu = {
                label: "Меню Модерации",
                value: "moderator_menu",
                description: "Список команд модерирования"
            }
            const changeToModeratorMenu = () => {
                let embed = new Discord.MessageEmbed()
                .setTitle(`Меню Модерации`)
                .setColor(Colours.noColor())
                .setThumbnail(message.guild.iconURL({dynamic: true}))
                .setDescription(`● **\`${prefix}ban <@user> <Причина>\`** - бан\n● **\`${prefix}unban <userID>\`** - разбан\n● **\`${prefix}kick <@user> <Причина>\`** - кик\n● **\`${prefix}temprole <@user> <@role> <Время>\`** - временная роль\n● **\`${prefix}mute <@user> <Время> <Причина>\`** - мьют\n● **\`${prefix}unmute <@user>\`** - снять мьют\n● **\`${prefix}warn <@user> <Причина>\`** - выдать предупреждение\n● **\`${prefix}warn remove <ID случая> <Причина>\`** - снять предупреждение\n● **\`${prefix}warns [@user]\`** - преды и мьюты\n● **\`${prefix}boost <msg/ch>\`** - управление сообщениями о бусте\n● **\`${prefix}set @user coins <Кол-во>\`** - задать в базе данных\n● **\`${prefix}ar <add/remove> <@user>\`** - управление авто-ролями\n● **\`${prefix}giveaway start <#channel> <Продолжительность> <Кол-во победителей> <Название розыгрыша>\`** - создать розыгрыш\n● **\`${prefix}giveaway stop <ID сообщения>\`** - завершить розыгрыш\n● **\`${prefix}giveaway reroll <ID сообщения>\`** - перевыбор победителей розыгрыша\n● **\`${prefix}event create\`** - создание ивента\n● **\`${prefix}event list\`** - список шаблонов ивентов сервера\n● **\`${prefix}setprefix <Префикс>\`** - смена префикса бота\n● **\`${prefix}clear <Количество>\`** - удалить X сообщений\n● **\`${prefix}invites\`** - выгрузка приглашений в excel\n● **\`${prefix}automod\`** - включение/отключение авто-модерации\n● **\`${prefix}automod [block/unblock]\`** - добалвение/удаление канала в исключениях\n● **\`${prefix}automod list\`** - список исключенных каналов\n● **\`${prefix}caps <msg/dur>\`** - управление авто-модерации капса\n● **\`${prefix}spam <msg/dur>\`** - управление авто-модерации спама\n● **\`${prefix}roles <@user>\`** - управление ролями пользователя\n● **\`${prefix}delete <warn | ban | mute | review>\`** - удаление из бд`)
                .setFields(
                    {name: `Пояснение`, value: `**\`[]\`** - необязательно для заполнения\n**\`<>\`** - обязательно для заполнения`}
                )

                return embed
            };

            const FunMenu = {
                label: "Меню Веселья",
                value: "fun_menu",
                description: "Список команд веселья"
            }
            const changeToFunMenu = () => {
                let embed = new Discord.MessageEmbed()
                .setTitle(`Меню Веслья`)
                .setColor(Colours.noColor())
                .setThumbnail(message.guild.iconURL({dynamic: true}))
                .setDescription(`● **\`${prefix}ball <Вопрос>\`** - магический шар\n● **\`${prefix}love <@user>\`** - проверка на совместимость\n● **\`${prefix}roll [Число] [Число]\`** - выбросить случайное число`)
                // .setFields(
                //     {name: `Пояснение`, value: `**\`[]\`** - необязательно для заполнения\n**\`<>\`** - обязательно для заполнения`}
                // )

                return embed
            };
            
            const UtilityMenu = {
                label: "Меню Полезного",
                value: "utility_menu",
                description: "Список команд полезного"
            }
            const changeToUtilityMenu = () => {
                let embed = new Discord.MessageEmbed()
                .setTitle(`Меню Полезного`)
                .setColor(Colours.noColor())
                .setThumbnail(message.guild.iconURL({dynamic: true}))
                .setDescription(`● **\`${prefix}avatar [@user | userID]\`** - аватар пользователя`)
                // .setFields(
                //     {name: `Пояснение`, value: `**\`[]\`** - необязательно для заполнения\n**\`<>\`** - обязательно для заполнения`}
                // )

                return embed
            };

            const ActionsMenu = {
                label: "Меню Действий",
                value: "actions_menu",
                description: "Список команд действий"
            }
            const changeToActionsMenu = () => {
                let embed = new Discord.MessageEmbed()
                .setTitle(`Меню Действий`)
                .setColor(Colours.noColor())
                .setThumbnail(message.guild.iconURL({dynamic: true}))
                .setDescription(`● **\`${prefix}bite [@user]\`** - укусить\n● **\`${prefix}blush [@user]\`** - покраснеть\n● **\`${prefix}bonk [@user]\`** - бонькнуть\n● **\`${prefix}bully [@user]\`** - поиздеваться\n● **\`${prefix}cringe [@user]\`** - посмотреть с отвращением\n● **\`${prefix}cry [@user]\`** - заплакать\n● **\`${prefix}cuddle [@user]\`** - прижаться\n● **\`${prefix}dance [@user]\`** - потанцевать\n● **\`${prefix}handhold [@user]\`** - подержать за руку\n● **\`${prefix}happy [@user]\`** - порадоваться\n● **\`${prefix}highfive [@user]\`** - дать пять\n● **\`${prefix}hug [@user]\`** - обнять\n● **\`${prefix}kill [@user]\`** - убить\n● **\`${prefix}kiss [@user]\`** - поцеловать\n● **\`${prefix}lick [@user]\`** - лизнуть\n● **\`${prefix}pat [@user]\`** - погладить\n● **\`${prefix}poke [@user]\`** - потыкать\n● **\`${prefix}slap [@user]\`** - ударить\n● **\`${prefix}smile [@user]\`** - улыбнуться\n● **\`${prefix}wave [@user]\`** - помахать\n● **\`${prefix}wink [@user]\`** - подмигнуть\n● **\`${prefix}tickle [@user]\`** - пощекотать\n● **\`${prefix}feed [@user]\`** - покормить\n● **\`${prefix}sex <@user>\`** - заняться любовью (NSFW)\n● **\`${prefix}kuni <@user>\`** - сделать куни (NSFW)\n● **\`${prefix}suck <@user>\`** - отсосать (NSFW)`)
                // .setFields(
                //     {name: `Пояснение`, value: `**\`[]\`** - необязательно для заполнения\n**\`<>\`** - обязательно для заполнения`}
                // )

                return embed
            };

            const selectMenu = {
                type: "SELECT_MENU",
                customId: "select_menu",
                placeHolder: "Выберите меню",
                options: [MainMenu, ModeratorMenu,   EconomyMenu, ProfileMenu, FunMenu, UtilityMenu, ActionsMenu]
            }

            const action = {
                type: "ACTION_ROW",
                components: [selectMenu]
            }

            const initMessage = await message.reply({
                embeds: [changeToMainMenu()],
                components: [action],
            })
  
            //const filter = (interaction) => interaction.user.id === message.member.id;
            const collector = await initMessage.createMessageComponentCollector({ type: 'BUTTON', time: 120000 })
            collector.on('collect', async (button) => {
              if(button.user.id !== message.member.id) return button.reply({ content: "Вы не можете использовать чужие кнопки", ephemeral: true })


              if(button.values[0] == "main_menu"){
                MainMenu.default = true
                EconomyMenu.default = false
                ModeratorMenu.default = false
                ProfileMenu.default = false
                FunMenu.default = false
                UtilityMenu.default = false
                ActionsMenu.default = false
                initMessage.edit({
                    embeds: [changeToMainMenu()],
                    components: [action]
                })
              }

              if(button.values[0] == "economy_menu"){
                MainMenu.default = false
                EconomyMenu.default = true
                ModeratorMenu.default = false
                ProfileMenu.default = false
                FunMenu.default = false
                UtilityMenu.default = false
                ActionsMenu.default = false
                initMessage.edit({
                    embeds: [changeToEconomyMenu()],
                    components: [action]
                })
              }

              if(button.values[0] == "profile_menu"){
                MainMenu.default = false
                EconomyMenu.default = false
                ModeratorMenu.default = false
                ProfileMenu.default = true
                FunMenu.default = false
                UtilityMenu.default = false
                ActionsMenu.default = false
                initMessage.edit({
                    embeds: [changeToProfileMenu()],
                    components: [action]
                })
              }

              if(button.values[0] == "moderator_menu"){
                MainMenu.default = false
                EconomyMenu.default = false
                ModeratorMenu.default = true
                ProfileMenu.default = false
                FunMenu.default = false
                UtilityMenu.default = false
                ActionsMenu.default = false
                initMessage.edit({
                    embeds: [changeToModeratorMenu()],
                    components: [action]
                })
              }

              if(button.values[0] == "fun_menu"){
                MainMenu.default = false
                EconomyMenu.default = false
                ModeratorMenu.default = false
                ProfileMenu.default = false
                FunMenu.default = true
                UtilityMenu.default = false
                ActionsMenu.default = false
                initMessage.edit({
                    embeds: [changeToFunMenu()],
                    components: [action]
                })
              }

              if(button.values[0] == "utility_menu"){
                MainMenu.default = false
                EconomyMenu.default = false
                ModeratorMenu.default = false
                ProfileMenu.default = false
                FunMenu.default = false
                UtilityMenu.default = true
                ActionsMenu.default = false
                initMessage.edit({
                    embeds: [changeToUtilityMenu()],
                    components: [action]
                })
              }

              if(button.values[0] == "actions_menu"){
                MainMenu.default = false
                EconomyMenu.default = false
                ModeratorMenu.default = false
                ProfileMenu.default = false
                FunMenu.default = false
                UtilityMenu.default = false
                ActionsMenu.default = true
                initMessage.edit({
                    embeds: [changeToActionsMenu()],
                    components: [action]
                })
              }

              button.deferUpdate()
            })


        }catch(err){
            console.error(chalk.redBright(err.stack))
            console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
        }
    }
}
