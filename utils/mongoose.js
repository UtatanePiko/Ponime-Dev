  
const mongoose = require('mongoose');
const bot = require('../bot.js')
module.exports = {
    init: () => {

        if(bot.user.id == "914124666258464768"){
            mongoose.connect("mongodb+srv://Admin:12348765@ponimeeurope.m2efb.mongodb.net/Ponime?retryWrites=true&w=majority", {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })  
        } else {
            mongoose.connect("mongodb+srv://Admin:12348765@ponime-dev.8ticm.mongodb.net/PonimeDev?retryWrites=true&w=majority", {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })   
        }

        mongoose.connection.on('connected', () => {
            console.log('MongoDB: успешно подключен!');
        });

        mongoose.connection.on('err', err => {
            console.log(`MongoDB: ошибка подключения:\n${err.stack}`);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB: соединение потеряно');
        });
    }
}