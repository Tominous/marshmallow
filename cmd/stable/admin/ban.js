exports.run = (c, suffix) => {
	let debugE = global.debug.error
	let bot = global.bot
	let msg = c.message
	let guild = msg.guild
	let user = msg.author
	let botuser = bot.User
	let guildPerms = user.permissionsFor(guild)
	let botPerms = botuser.permissionsFor(guild)
	if (!guildPerms.General.BAN_MEMBERS) {
		msg.reply(':x: You\'re missing `Ban Members` permissions.')
	} else if (!botPerms.General.BAN_MEMBERS) {
		msg.channel.sendMessage(':x: I\'m missing `Ban Members` permissions.')
	} else if (msg.mentions.length === 0) {
		msg.channel.sendMessage(':x: No mentioned users.')
	} else {
		let days = suffix.split(' ')[msg.mentions.length] || 0
		if ([0, 1, 7].indexOf(parseFloat(days)) > -1) {
			msg.mentions.map(function (user) {
				let member = msg.guild.members.find((m) => m.id === user.id)
				member.ban(days).then(() => {
					msg.channel.sendMessage(`:white_check_mark: **${msg.author.username}** (\`${msg.author.id}\`) banned **${user.username}** (\`${user.id}\`) from **${guild.name}**.`)
				}).catch((error) => {
					msg.channel.sendMessage(`:x: Failed to ban ${user.username}, Try again later. If problem persists, report to RDO Hub: \`${error}\``)
					debugE(error)
				})
			})
		} else {
			msg.channel.sendMessage(`:x: Arguments invalid. Do \`:help\` for more info on how to use this bot.`)
		}
	}
}