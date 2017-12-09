exports.run = (c, suffix) => {
	let v = require('../../../req/main_music_file')
	v.voteSkip(c.message, global.bot)
}