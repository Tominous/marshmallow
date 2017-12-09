exports.run = (c, suffix) => {
  let v = require('../../../req/main_music_file')
  let msg = c.message
  let bot = global.bot
  suffix = suffix.toLowerCase().split(' ')
  let connect = bot.VoiceConnections.find(v => v.voiceConnection.guild.id === msg.guild.id)
  if (connect) {
    if ((suffix[0] === 'delete' || suffix[0] === 'remove') && suffix[1] >= 2) {
      global.db.check('acclvl', {
        main: (c.message.guild.id + c.message.author.id),
        other: msg.author
      }).then(function (r) {
        if (r.value >= 1) {
          v.deleteFromPlaylist(msg, suffix[1] - 1).then(s => {
            msg.channel.sendMessage(`:white_check_mark: **${s}** has been removed from the playlist`)
          }).catch(e => {
            msg.channel.sendMessage(e)
          })
        } else {
          msg.channel.sendMessage(':x: Invalid Access Level.')
        }
      })
      /*for (let i in c.message.guild.members.find(m => m.id == c.message.author.id).roles) {
                global.db.check('acclvl', {
		            main: c.message.guild.members.find(m => m.id == c.message.author.id).roles[i].id,
		            other: msg.author
                }).then(function (r) {
	                if(r.value >= 1) {
		                v.deletefromPlaylist(msg, suffix[1] - 1).then(s => {
			                msg.channel.sendMessage(`:white_check_mark: **${s}** has been removed from the playlist`)
			            }).catch(e => {
			                msg.channel.sendMessage(e)
                        })
                    } else {
			            msg.channel.sendMessage(':x: Invalid Access Level.')
                    }
                })
            }*/
    } else {
      v.fetchList(msg).then((r) => {
        let arr = []
        arr.push(':track_next: Now playing: **' + r.info[0] + '** \n')
        for (let i = 1; i < r.info.length; i++) {
          arr.push((i + 1) + '. **' + r.info[i].replace(new RegExp('@everyone', 'gi'), '[Failed Mention Lol]') + '** Requested by ' + r.requester[i].replace(new RegExp('@everyone', 'gi'), '[Failed Mention Lol]'))
          if (i === 9) {
            if (r.info.length - 10 !== 0) arr.push('And about ' + (r.info.length - 10) + ' more songs.')
            break
          }
        }
        msg.channel.sendMessage(arr.join('\n'))
      }).catch(() => {
        msg.channel.sendMessage(":x: Nothing is here!")
      })
    }
  } else {
    msg.channel.sendMessage(':x: Voice inactive in this server.')
  }
}