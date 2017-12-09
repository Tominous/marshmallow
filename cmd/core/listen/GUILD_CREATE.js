exports.begin = () => {
	global.bot.Dispatcher.on('GUILD_CREATE', (s) => {
		if (!global.bot.connected) return
		if (!s.becameAvailable) {
			// global.bot.Guilds.get(s.guild.id).channels.get(s.guild.id).sendMessage('__**Woohoo!**__\n\nUnlike some, you actually invited me correctly! Now, here\'s some basics;\n\n**I do learn**\n**I don\'t like memes**\n**I do make memes**\n**I do play music**\n**You can learn a thing or two from me**\n\nNeed help? just do `:help`. OK? We sorted? Awesome.')
			global.server.emit('addServer', s.guild)
		}
	})
}