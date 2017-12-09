exports.run = (c, suffix) => {
	if (!suffix) return c.message.channel.sendMessage(':x: Added- Wait... I can\'t add something if you don\'t give me anything to add!')
	let v = require('../../../req/main_music_file')
	let bot = global.bot
	let msg = c.message
	let u = require('url').parse(suffix)
	if (u.host === null) {
		v.request(msg, 'ytsearch:' + suffix, bot)
	} else {
		v.request(msg, suffix, bot)
	}
}