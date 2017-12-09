exports.run = (c, suffix) => {
	let v = require('../../../req/main_music_file')
	v.skip(c.message, suffix, global.bot)
}