let Vibrant = require('node-vibrant')

exports.run = (c, suffix) => {
  suffix = suffix.split(' ')
  if (!suffix[0]) {
    let bot = global.bot
    let msg = c.message
    let owner = `Curtis#0708 & ✨ Drew The Fox ✨#0394`
    let vibrantColour
    let field = [{
        name: 'Servers Connected',
        value: '```\n' + bot.Guilds.length + '```',
        inline: true
      },
      {
        name: 'Available Users',
        value: '```\n' + bot.Users.length + '```',
        inline: true
      },
      {
        name: 'Available Channels',
        value: '```\n' + bot.Channels.length + '```',
        inline: true
      },
      {
        name: 'Available Private Channels',
        value: '```\n' + bot.DirectMessageChannels.length + '```',
        inline: true
      },
      {
        name: 'Messages Received',
        value: '```\n' + bot.Messages.length + '```',
        inline: true
      },
      {
        name: 'Owner',
        value: '```\n' + owner + '```',
        inline: true
      },
      {
        name: 'Shard',
        value: '```\n' + `${global.argv.shardid ? 'Yes' : 'No'}` + '```',
        inline: true
      }
    ]
    if (global.argv.shardid) {
      field.push({
        name: 'This Shard ID',
        value: '```\n' + global.argv.shardid + '```',
        inline: true
      })
      field.push({
        name: 'Total Shard Count',
        value: '```\n' + global.argv.max + '```',
        inline: true
      })
    }
    //noinspection JSUnresolvedVariable
    Vibrant.from(bot.User.avatarURL.replace('.gif', '.png')).getPalette((e, p) => {
      if (e || !p.Vibrant) {
        global.debug.error('Palette Error: ' + e)
        vibrantColour = '5577355'
      } else {
        console.log(p.Vibrant)
        vibrantColour = global.convertToHex(p.Vibrant._rgb[0], p.Vibrant._rgb[1], p.Vibrant._rgb[2])
      }
      msg.channel.sendMessage('', false, {
        color: vibrantColour,
        author: {
          icon_url: bot.User.avatarURL,
          name: `${bot.User.username}#${bot.User.discriminator} (${bot.User.id})`
        },
        title: `Marshmallow ${require('../../../package.json').version}`,
        timestamp: new Date(),
        fields: field,
        description: 'I\'m a bot, what do you expect this to say?',
        url: 'https://github.com/radwolfdev/marshmallow',
        footer: {
          text: `Checking Health...`,
          icon_url: 'http://i.imgur.com/DCYQ2L1.gif'
        }
      }).then(m => {
        let request = require('request')
        request.get('https://git.rdofm.net/health_check.json?token=tBFxA3x3Zzb-dLULdd6-', (e, r, b) => {
          if (r.statusCode == 502 || e || !JSON.parse(b).healthy) {
            m.edit(' ', {
              color: vibrantColour,
              author: {
                icon_url: bot.User.avatarURL,
                name: `${bot.User.username}#${bot.User.discriminator} (${bot.User.id})`
              },
              title: `Marshmallow ${require('../../../package.json').version}`,
              timestamp: new Date(),
              fields: field,
              description: 'I\'m a bot, what do you expect this to say?',
              url: 'https://github.com/radwolfdev/marshmallow',
              footer: {
                text: `Bad`,
                icon_url: 'https://cdn.discordapp.com/emojis/313956276893646850.png'
              }
            })
          } else {
            m.edit(' ', {
              color: vibrantColour,
              author: {
                icon_url: bot.User.avatarURL,
                name: `${bot.User.username}#${bot.User.discriminator} (${bot.User.id})`
              },
              title: `Marshmallow ${require('../../../package.json').version}`,
              timestamp: new Date(),
              fields: field,
              description: 'I\'m a bot, what do you expect this to say?',
              url: 'https://github.com/radwolfdev/marshmallow',
              footer: {
                text: `Healthy`,
                icon_url: 'https://cdn.discordapp.com/emojis/313956277808005120.png'
              }
            })
          }
        })
      })
    })
  } else if (suffix[0] === 'user') {
    let bot = global.bot
    let msg = c.message
    if (msg.isPrivate) {
      msg.channel.sendMessage("Sorry you can't use this in DMs")
      return
    }
    let vibrantColour
    //noinspection JSUnresolvedVariable
    if (msg.mentions.length === 0) {
      global.db.check('acclvl', {
        main: (msg.author.id + msg.guild.id)
      }, c).then((level) => {
        if (level.owner) level.value = 4
        if (level.master) level.value = 999
        if (!level.value) level.value = 0
        let tempRoles = msg.member.roles.sort(function (a, b) {
          return a.position - b.position
        }).reverse()
        let roles = []
        for (let i in tempRoles) {
          //noinspection JSUnfilteredForInLoop
          roles.push(tempRoles[i].name)
        }
        roles = roles.splice(0, roles.length).join(', ').slice(0, roles.length - 2)
        let field = [{
            name: 'Status',
            value: '```\n' + msg.author.status + '```',
            inline: true
          },
          {
            name: 'Account Creation',
            value: '```\n' + msg.author.createdAt + '```'
          },
          {
            name: 'Access Level',
            value: '```\n' + (level.value !== 0 ? level.value : 0) + '```'
          },
          {
            name: 'Roles',
            value: '```\n' + `${tempRoles.length > 0 ? roles : 'None'}` + '```'
          }
        ]
        if (msg.author.gameName) {
          field.splice(1, 0, {
            name: 'Playing',
            value: '```\n' + msg.author.gameName + '```',
            inline: true
          })
        }
        let embed = {
          author: {
            name: `${msg.author.username}#${msg.author.discriminator} (${msg.author.id})`
          },
          timestamp: new Date(),
          fields: field,
          footer: {
            text: `Online for ${getUptime()}`,
            icon_url: bot.User.avatarURL
          }
        }
        if (msg.author.avatarURL) {
          embed.author.icon_url = msg.author.avatarURL
          embed.thumbnail = {
            url: msg.author.avatarURL
          }
          embed.url = msg.author.avatarURL
        }
        Vibrant.from(msg.author.avatarURL.replace('.gif', '.png')).getPalette((e, p) => {
          if (e || !p.Vibrant) {
            global.debug.error('Palette Error: ' + e)
            vibrantColour = '5577355'
          } else {
            console.log(p.Vibrant)
            vibrantColour = global.convertToHex(p.Vibrant._rgb[0], p.Vibrant._rgb[1], p.Vibrant._rgb[2])
          }
          embed.color = vibrantColour
          msg.channel.sendMessage('', false, embed)
        })
      }).catch((error) => {
        msg.channel.sendMessage(':x: Something happened, try again.')
        global.debug.error(error)
      })
      return
    }
    msg.mentions.map(function (user) {
      global.db.check('acclvl', {
        main: (user.id + msg.guild.id)
      }, {
        message: {
          author: user,
          guild: c.message.guild
        }
      }).then(function (level) {
        if (level.owner) level.value = 4
        if (level.master) level.value = 999
        if (!level.value) level.value = 0
        let guild = msg.guild
        let member = guild.members.find((m) => m.id === user.id)
        let tempRoles = member.roles.sort(function (a, b) {
          return a.position - b.position
        }).reverse()
        let roles = []
        for (let i in tempRoles) {
          //noinspection JSUnfilteredForInLoop
          roles.push(tempRoles[i].name)
        }
        roles = roles.splice(0, roles.length).join(', ').slice(0, roles.length - 2)
        let field = [{
            name: 'Status',
            value: '```\n' + user.status + '```',
            inline: true
          },
          {
            name: 'Account Creation',
            value: '```\n' + user.createdAt + '```'
          },
          {
            name: 'Access Level',
            value: '```\n' + (level.value !== 0 ? level.value : 0) + '```'
          },
          {
            name: 'Roles',
            value: '```\n' + `${tempRoles.length > 0 ? roles : 'None'}` + '```'
          }
        ]
        if (user.gameName) {
          field.splice(1, 0, {
            name: 'Playing',
            value: '```\n' + user.gameName + '```',
            inline: true
          })
        }
        let embed = {
          author: {
            name: `${user.username}#${user.discriminator} (${user.id})`
          },
          timestamp: new Date(),
          fields: field,
          footer: {
            text: `Online for ${getUptime()}`,
            icon_url: bot.User.avatarURL
          }
        }
        if (user.avatarURL) {
          embed.author.icon_url = user.avatarURL
          embed.thumbnail = {
            url: user.avatarURL
          }
          embed.url = user.avatarURL
        }
        Vibrant.from(user.avatarURL.replace('.gif', '.png')).getPalette((e, p) => {
          if (e || !p.Vibrant) {
            global.debug.error('Palette Error: ' + e)
            vibrantColour = '5577355'
          } else {
            console.log(p.Vibrant)
            vibrantColour = global.convertToHex(p.Vibrant._rgb[0], p.Vibrant._rgb[1], p.Vibrant._rgb[2])
          }
          embed.color = vibrantColour
          msg.channel.sendMessage('', false, embed)
        })
      }).catch(function (err) {
        global.debug.error(err)
        msg.channel.sendMessage(':x: Something happened, try again.')
      })
    })
  } else if (suffix[0] === "server") {
    let bot = global.bot
    let msg = c.message
    let guild = msg.guild
    let vibrantColour
    if (msg.isPrivate) {
      msg.channel.sendMessage("Sorry you can't use this in DMs")
      return
    }
    let field = [{
        name: 'Name',
        value: '```\n' + guild.name + '```',
        inline: true
      },
      {
        name: 'Members',
        value: '```\n' + guild.member_count + '```',
        inline: true
      },
      {
        name: 'Role Count',
        value: '```\n' + guild.roles.length + '```',
        inline: true
      },
      {
        name: 'Owner',
        value: '```\n' + guild.owner.username + '#' + guild.owner.discriminator + '```',
        inline: true
      },
      {
        name: 'Creation Date',
        value: '```\n' + guild.createdAt + '```'
      }
    ]
    let embed = {
      author: {
        name: `${guild.name} (${guild.id})`
      },
      timestamp: new Date(),
      fields: field,
      footer: {
        text: `Online for ${getUptime()}`,
        icon_url: bot.User.avatarURL
      }
    }
    if (guild.iconURL) {
      embed.thumbnail = {
        url: guild.iconURL
      }
      embed.url = guild.iconURL
    }
    Vibrant.from(guild.iconURL).getPalette((e, p) => { // ?? I dunno what is erroring but I'll try this
      if (e || !p.Vibrant) {
        global.debug.error('Palette Error: ' + e)
        vibrantColour = '5577355'
      } else {
        console.log(p.Vibrant)
        vibrantColour = global.convertToHex(p.Vibrant._rgb[0], p.Vibrant._rgb[1], p.Vibrant._rgb[2])
      }
      embed.color = vibrantColour
      msg.channel.sendMessage('', false, embed)
    })
  }
}

function getUptime() {
  let d = Math.floor(process.uptime() / 86400)
  let hrs = Math.floor((process.uptime() % 86400) / 3600)
  let min = Math.floor(((process.uptime() % 86400) % 3600) / 60)
  let sec = Math.floor(((process.uptime() % 86400) % 3600) % 60)

  if (d === 0 && hrs !== 0) {
    return `${hrs} hrs, ${min} mins, ${sec} seconds`
  } else if (d === 0 && hrs === 0 && min !== 0) {
    return `${min} mins, ${sec} seconds`
  } else if (d === 0 && hrs === 0 && min === 0) {
    return `${sec} seconds`
  } else {
    return `${d} days, ${hrs} hrs, ${min} mins, ${sec} seconds`
  }
}