exports.run = (c, suffix) => {
  let colour = global.convertToHex(25, 25, 25)
  let Vibrant = require('node-vibrant')

  Vibrant.from(c.message.author.avatarURL.replace('.gif', '.png')).getPalette((e, p) => {
    let guid = global.guid()
    colour = global.convertToHex(p.Vibrant._rgb[0], p.Vibrant._rgb[1], p.Vibrant._rgb[2])

    global.db.check('cronjob', {
      main: c.message.guild.id
    }).then(v => {
      if (!suffix) {
        if (!v.value) {
          c.message.channel.sendMessage('', null, {
            title: 'Guild Pipeline Empty.',
            description: `Learn how to create one over [here](${global.config.helpDomain})`,
            color: colour,
            image: {
              url: global.config.language.cron.none
            }
          })
        }
      } else {
        if (suffix.startsWith('create')) {
          suffix = suffix.substr(7)

          let name = suffix.split('"')[1]
          let cron = suffix.substr(name.length + 3)
          let channel = c.message.guild.channels.forEach((s) => {
            if (s.name === 'marshmallow-hk') return s
          })

          c.message.channel.sendMessage('', false, {
            author: {
              icon_url: 'https://i.imgur.com/DCYQ2L1.gif',
              name: 'Creating Cronjob...'
            }
          }).then((m) => {
            if (!channel) {
              c.message.guild.createChannel(0, 'marshmallow-hk').then(ch => {
                channel = ch
              }).catch(e => {
                return m.edit('', {
                  color: colour,
                  author: {
                    icon_url: 'https://cdn.discordapp.com/emojis/313956276893646850.png',
                    name: 'Failed to create Cronjob; Couldn\'t create channel.'
                  }
                })
              })
            }

            global.hk.create(name, cron, channel, c, guid)
          })
        }
      }
    })
  })
}