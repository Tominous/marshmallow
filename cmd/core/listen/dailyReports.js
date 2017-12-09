let on = {}

exports.run = () => {}

exports.begin = () => {
  if (!global.message) return
  if (on[global.message.guild.id]) return
  setInterval(() => {
    global.db.check('reports', {
      main: global.message.guild.id
    }).then((v) => {
      if (!v.notFound) {
        if (!on[global.message.guild.id]) {
          global.debug.listen('Started Report Checking for ' + global.message.guild.id)
        }
        on[global.message.guild.id] = true
        v.value = JSON.parse(v.value)
        if (v.value.time === `${new Date().getUTCHours()}:${new Date().getUTCMinutes()}`) {
          global.db.set('reports', {
            main: global.message.guild.id,
            other: JSON.stringify({
              time: `${new Date().getUTCHours()}:${new Date().getUTCMinutes()}}`,
              channel: v.value.channel,
              messages: 0,
              newMembers: 0,
              commandsRan: 0,
              lostMembers: 0,
              bannedMembers: 0
            })
          }).then(() => {
            global.bot.Channels.get(v.value.channel).sendMessage(':chart_with_upwards_trend: Here\'s your daily report for ' + `${new Date().getUTCHours()}:${new Date().getUTCMinutes()}` + '\n\n\n```fix\nTotal Messages: ' + v.value.messages + '\nTotal Commands: ' + v.value.commandsRan + '\nNew Members: ' + v.value.newMembers + '\nLost Members: ' + v.value.lostMembers + '\nBanned Members: ' + v.value.bannedMembers + '```')
          })
        }
      }
    })
  }, 60000)
}