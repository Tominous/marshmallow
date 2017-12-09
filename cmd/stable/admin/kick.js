exports.run = (c, suffix) => {
  let debugE = global.debug.error
  let bot = global.bot
  let msg = c.message
  let guild = msg.guild
  let user = msg.author
  let botuser = bot.User
  let guildPerms = user.permissionsFor(guild)
  let botPerms = botuser.permissionsFor(guild)
  if (!guildPerms.General.KICK_MEMBERS) {
    msg.channel.sendMessage(':x: You\'re missing `Kick Members` permissions.')
  } else if (!botPerms.General.KICK_MEMBERS) {
    msg.channel.sendMessage(":x: I\'m missing `Kick Members` permissions.")
  } else if (msg.mentions.length === 0) {
    msg.channel.sendMessage(':x: No mentioned users.')
  } else {
    msg.mentions.map(function (user) {
      let member = msg.guild.members.find((m) => m.id === user.id)
      member.kick().then(() => {
        msg.channel.sendMessage(`:white_check_mark: :dash::boot: Kicked ${user.username}`)
      }).catch((error) => {
        msg.channel.sendMessage(`:x: Failed to kick ${user.username}, Try again later. If problem persists, report to RDO Hub: \`${error}\``)
        debugE(error)
      })
    })
  }
}