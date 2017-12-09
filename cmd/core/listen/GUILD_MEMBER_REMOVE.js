exports.begin = () => {
  global.bot.Dispatcher.on('GUILD_MEMBER_REMOVE', (s) => {
    global.db.check('reports', {
      main: s.guild.id
    }).then((v) => {
      if (!v.notFound) {
        v.value = JSON.parse(v.value)
        v.value.lostMembers++
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
      if (c.value['leave']) {
        /** @namespace c.value.channelID */
        if (c.value['leave'].message) {
          global.bot.Channels.get(c.value['leave'].channel.replace(' ', '')).sendMessage(c.value.message.replace(/%user%/, s.user.username).replace(/%user.id%/, s.user.id).replace(/%guild%/, s.guild.name).replace(/%guild.id%/, s.guild.id).replace(/%timestamp%/, new Date().toLocaleString()))
        } else {
          global.bot.Channels.get(c.value['leave'].channel.replace(' ', '')).sendMessage(s.user.username + ' (`' + s.user.id + '`) Left ' + s.guild.name + ' (`' + s.guild.id + '`) at ' + new Date().toLocaleString())
        }
      }
    })
  })
}