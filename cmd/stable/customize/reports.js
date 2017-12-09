exports.run = (c, suffix) => {
	suffix = suffix.split(' ')
	if (!suffix[0]) return c.message.channel.sendMessage(':x: Missing first suffix (on/off)')
	if (!suffix[1]) return c.message.channel.sendMessage(':x: Missing second suffix (Channel #mention)')
	let cid = suffix[1].replace('<#', '').replace('>', '')
	if (suffix[0] === 'on') {
		global.db.set('reports', {
			main: c.message.guild.id,
			other: JSON.stringify({
				time: `${new Date().getUTCHours()}:${new Date().getUTCMinutes()}`,
				channel: cid,
				messages: 0,
				newMembers: 0,
				commandsRan: 0,
				lostMembers: 0,
				bannedMembers: 0
			})
		}).then(() => {
			global.bot.Channels.get(cid).sendMessage('**Welcome to Reports.**\n\nAt every *' + new Date().getUTCHours() + ':' + new Date().getUTCMinutes() + '*, I will send a report here about what happened in the server in the past 24 hours.\n\nBy enabling this, you agree to this command\'s Terms of Service & Privacy Policy.')
		})
	} else if (suffix[0] === 'off') {
		global.db.set('reports', {
			main: c.message.guild.id
		}).then(() => {
			global.bot.Channels.get(cid).sendMessage(':wave: kbai.')
		})
	}
}