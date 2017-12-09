exports.run = (c, suffix) => {
	let debugE = global.debug.error
	let bot = global.bot
	let msg = c.message
	let guild = msg.guild
	let user = msg.author
	let userPerms = user.permissionsFor(guild)
	let botPerms = bot.User.permissionsFor(guild)
	if (!userPerms.Text.MANAGE_MESSAGES) {
		msg.channel.sendMessage(':x: You\'re missing `Manage Message` permissions.')
	} else if (!botPerms.Text.MANAGE_MESSAGES) {
		msg.channel.sendMessage(':x: I\'m missing `Manage Message` permissions.')
	} else {
		if (!suffix || isNaN(suffix) || suffix > 100 || suffix < 0) {
			msg.channel.sendMessage(`:x: \`${suffix ? suffix : '0'}\` isn't a valid number.`)
		} else {
			msg.channel.fetchMessages(suffix).then((result) => {
				bot.Messages.deleteMessages(result.messages)
				msg.channel.sendMessage(`:white_check_mark: Purged **${suffix}** messages`)
			}).catch((error) => {
				if (!msg.channel) return guild.generalChannel.sendMessage(":x: Failed to fetch channel to delete messages in. If the channel exists and I can see it, please report this to the RDO Devs.")
				msg.channel.sendMessage(`:x: Couldn't fetch messages, Try again later. If problem persists, report this to RDO Hub: \`${error}\``)
				debugE(error)
			})
		}
	}
}