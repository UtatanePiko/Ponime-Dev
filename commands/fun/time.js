const chalk = require('chalk')
module.exports = {
    name: "time",
    description: "Описание команд",
    run: async (bot, message, args) => {

        try {

            let now = new Date(Date.now() - 60 * 1000 * 60 * 3)

            console.log(now)
        }catch(err){
            console.error(chalk.redBright(err.stack))
            console.error(chalk.yellowBright('Продолжаю работу после ошибки...'))
        }
    }
}
