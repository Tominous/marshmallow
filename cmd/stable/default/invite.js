exports.run = (c) => {
    var config = require('../../../config.json')
    c.message.channel.sendMessage("You can add me here!\n<${config.oauthURL}>")
}
