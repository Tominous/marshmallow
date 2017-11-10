exports.run = (c, suffix) => {
    let msg = c.message
    let bot = global.bot
    if (msg.author.id === bot.User.id) return
    let util = require('util')
    try {
        let returned = eval(suffix)
        let str = util.inspect(returned, {
            depth: 1
        })
        if (str.length > 1900) {
            str = str.substr(0, 1897)
            str = str + '...'
        }
        str = str.replace(new RegExp(bot.token, 'gi'), '( ͡° ͜ʖ ͡°)')
        msg.channel.sendMessage('```js\n' + str + '\n```').then((ms) => {
            if (returned !== undefined && returned !== null && typeof returned.then === 'function') {
                returned.then(() => {
                    let str = util.inspect(returned, {
                        depth: 1
                    })
                    if (str.length > 1900) {
                        str = str.substr(0, 1897)
                        str = str + '...'
                    }
                    ms.edit('```js\n' + str + '\n```')
                }, (e) => {
                    let str = util.inspect(e, {
                        depth: 1
                    })
                    if (str.length > 1900) {
                        str = str.substr(0, 1897)
                        str = str + '...'
                    }
                    ms.edit('```js\n' + str + '\n```')
                })
            }
        })
    } catch (e) {
        msg.channel.sendMessage('```js\n' + e + '\n```')
    }
}
