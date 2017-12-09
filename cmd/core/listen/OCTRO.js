exports.begin = () => {
	global.bot.Dispatcher.on('MESSAGE_CREATE', (c) => {
		if (!c.message.guild) return
		global.db.check('octro', {
			main: c.message.guild.id
		}).then(v => {
			if (v.value === 'true') {
				if (c.message.attachments && c.message.attachments[0] && c.message.attachments[0].height) { // Unsure why this doesn't work properly.
					c.message.addReaction("👍")
					c.message.addReaction("👎")
				}
			}
		})
	})
}