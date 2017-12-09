let request = require('request')

module.exports = (d) => {
	if (!global.bot.connected || !d || d === 'TypeError: Cannot read property \'run\' of undefined') return
	if (typeof d === 'object') d = JSON.stringify(d)
	if (d === "{}") return
	if (d.includes("/marshmallow/node_modules/youtube-dl/bin/youtube-dl")) return

	global.debug.check(d)

	global.dogbox.increment('bot.error')
}