exports.begin = () => {
	global.bot.Dispatcher.on('GUILD_MEMBER_ADD', (s) => {
		global.db.check('reports', {
			main: s.guild.id
		}).then((v) => {
			if (!v.notFound) {
				v.value = JSON.parse(v.value)
				v.value.newMembers++
					global.db.set('reports', {
						main: s.guild.id,
						other: JSON.stringify(v.value)
					})
			}
		})

		global.db.check('announceMemberActions', {
			main: s.guild.id
		}).then(c => {
			try {
				c.value = JSON.parse(c.value)
			} catch (e) {
				return
			}
			if (c.value['join']) {
				/** @namespace c.value.channelID */
				if (c.value['join'].message) {
					global.bot.Channels.get(c.value['join'].channel.replace(' ', '')).sendMessage(c.value.message.replace(/%user%/, s.member.username).replace(/%user.id%/, s.member.id).replace(/%guild%/, s.guild.name).replace(/%guild.id%/, s.guild.id).replace(/%timestamp%/, new Date().toLocaleString()))
				} else {
					global.bot.Channels.get(c.value['join'].channel.replace(' ', '')).sendMessage(s.member.username + ' (`' + s.member.id + '`) Joined ' + s.guild.name + ' (`' + s.guild.id + '`) at ' + new Date().toLocaleString())
				}
			}
		})
	})
}