exports.run = (c) => {
    let config = require('../../../config.json')
    c.message.channel.sendMessage(`
Hello!

Help can be found at <${config.helpDomain}>
You can contribute to this bot's framework at <https://github.com/radwolfdev/marshmallow>
`)
}
