exports.run = (c, suffix) => {
    let v = require('../../../req/main_music_file')
    v.leave(c.message, suffix, global.bot)
}
