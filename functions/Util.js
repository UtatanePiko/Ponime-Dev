const abbrev = require('../plugins/abbrev');
const bot = require('..')
const Guild = require('../models/guild')
const chalk = require('chalk');
module.exports = {
    
    shorten(text, len) {
        if (typeof text !== "string") return "";
        if (text.length <= len) return text;
        return text.substr(0, len).trim() + "...";
    },

    toAbbrev(num) {
        return abbrev(num);
    }, 

    msToTime(s) {
        var ms = s % 1000;
        s = (s - ms) / 1000;
        var secs = s % 60;
        s = (s - secs) / 60;
        var mins = s % 60;
        var hrs = (s - mins) / 60;
      
        return hrs + ':' + mins + ':' + secs + '.' + ms;
      },

    /**
     * Находит эмодзи на сервере
     * @param {string} emoji_name Название эмодзи на сервере, которе надо найти
     * @throws {Error}
     * @return {String|Number}
     */

    findEmoji(emoji_name){
        let emoji = bot.guilds.cache.get('914124553960194059').emojis.cache.find(e => e.name == `${emoji_name}`) || bot.guilds.cache.get('1010305087278678036').emojis.cache.find(e => e.name == `${emoji_name}`)
        if(!emoji) throw new Error('Не было найдено эмодзи: ' + JSON.stringify(emoji_name));
        return emoji
    }, 

    /**
     * Сообщ
     * @throws {Error}
     */

    checkPerm(who, permission){
        if(who && !who.permissions.has(permission, true)){
            return Boolean
        }
    }, 

    getWarnDurationTime(check){
        if(check == 1) return 1000 * 60 * 60 * 5
        if(check == 2) return 1000 * 60 * 60 * 12
        if(check == 3) return 1000 * 60 * 60 * 24
        return ((1000 * 60 * 60 * 24) + ((check - 3) * (1000 * 60 * 60 * 3)))
    },

    getWinner(users, max, removedArr) {
        if (users.length < 1) return false;
        let newArr = users
        //if (users.length <= max) return users;

        if(removedArr && max == 1){
            if(removedArr.length > 0){
                removedArr.forEach(async (user) => {
                    var i = newArr.indexOf(user)
                    newArr.splice(i, 1)
                });
                
                if(newArr.length < 2) return newArr

                let array = [];
                let i = 0;
                while(i < max) {
                    let random = Math.floor(Math.random() * newArr.length);
            
                    let selected = newArr[random];
                    index = newArr.indexOf(selected)
                    array.push(selected);
                    newArr.splice(index, 1)
                    i++
                }
                return array;
            }
        }
    
        let array = [];
        let i = 0;
        while(i < max) {
            let random = Math.floor(Math.random() * newArr.length);
    
            let selected = newArr[random];
            index = newArr.indexOf(selected)
            array.push(selected);
            newArr.splice(index, 1)
            i++
        }
        return array;
    }, 

    stringToDateFull(_date, _format, _format2){
        if(_date.includes("+") || _date.includes("-")) return
        _date = _date.split(" ")

        var formatLowerCase = _format.toLowerCase();
        var formatItems = formatLowerCase.split('.');
        var dateItems = _date[0].split('.');
        var monthIndex = formatItems.indexOf("mm");
        var dayIndex = formatItems.indexOf("dd");
        var yearIndex = formatItems.indexOf("yyyy");
        var month = parseInt(dateItems[monthIndex]) - 1;
        var day = parseInt(dateItems[dayIndex]);

        var format2LowerCase = _format2.toLowerCase();
        var format2Items = format2LowerCase.split(':');
        var date2Items = _date[1].split(':');
        var hoursItems = format2Items.indexOf("hh")
        var minutesItems = format2Items.indexOf("mm")
        var hours = parseInt(date2Items[hoursItems]) 
        var minutes = parseInt(date2Items[minutesItems])

        if(day > 31 || month > 11 || hours > 23 || minutes > 59) return

        var formatedDate = new Date(dateItems[yearIndex], month, day, hours, minutes);
        return formatedDate;
    },

    stringToDateTime(_date, _format){
        let now = new Date()
        if(_date.includes("+") || _date.includes("-")) return

        var formatLowerCase = _format.toLowerCase();
        var formatItems = formatLowerCase.split(':');
        var dateItems = _date.split(':');
        var hoursItems = formatItems.indexOf("hh")
        var minutesItems = formatItems.indexOf("mm")
        var hours = parseInt(dateItems[hoursItems]) 
        var minutes = parseInt(dateItems[minutesItems])

        if(hours > 23 || minutes > 59) return

        var formatedDate = new Date(now.getFullYear(), now.getMonth(), now.getHours() >= 21 && now.getTimezoneOffset() == 0 >= 21 ? now.getDate() + 1 : now.getDate(), hours, minutes);
        return formatedDate;
    }
}