exports.run = (c, suffix) => {
    let v = require('../../../req/main_music_file')
    v.shuffle(c.message, global.bot)
}
