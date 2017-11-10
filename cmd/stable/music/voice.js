exports.run = (c, suffix) => {
    let v = require('../../../req/main_music_file')
    v.join(c.message, suffix, global.bot, c)
}
