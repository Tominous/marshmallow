let a = {
  purge30: {
    desc: 'Triggers a 30 day purge on members. Cannot be lower than 1d.',
    js: (c) => {
      c.channel.sendMessage('cron!')
    }
  }
}
let t = {}

module.exports = {
  create: (n, c, g, s, i) => {
    t.name = n
    t.cron = c
    t.channel = g
    t.guid = i

    t.channel.sendMessage('', false, {
      title: `Initialising Cronjob ${t.name}`,
      image: {
        url: 'https://rdofm.net/m/req/img/cron/pipe.png?t=1'
      }
    }).then(m => {t.message=m})

    global.db.check('cronjob', {
      main: s.message.guild.id
    }).then(v => {
      if(v.value) v.value = JSON.parse(v.value)

      if(v.value[t.name]) {
        return t.message.edit('', {
         author: {
           icon_url: 'https://cdn.discordapp.com/emojis/313956276893646850.png',
           name: 'Failed to create Cronjob; Name already exists.'
         }
       })
      }

      if(!a[t.name]) {
        return t.message.edit('', {
         author: {
           icon_url: 'https://cdn.discordapp.com/emojis/313956276893646850.png',
           name: 'Failed to create Cronjob; Invalid Name.'
         }
       })
      }

      if(!/^([\ \*\d\/]*)$/.test(t.cron)) {
        return t.message.edit('', {
         author: {
           icon_url: 'https://cdn.discordapp.com/emojis/313956276893646850.png',
           name: 'Failed to create Cronjob; Invalid Cron.'
         }
       })
      }

      t.message.edit('', {
        title: `Testing Cronjob ${t.name}`,
        image: {
          url: 'https://rdofm.net/m/req/img/cron/pipe.png?t=1'
        }
      })

      try {
        a[t.name].js()
      } catch (e) {
        return t.message.edit('', {
          title: `Cronjob ${t.name} Killed.`,
          description: 'Please report this to [RDO](https://discord.gg/radwolf)',
          image: {
            url: 'https://rdofm.net/m/req/img/cron/pipe_fail.png?t=1'
          }
        })
      }

      t.message.edit('', {
        title: `Cronjob ${t.guid} Passed.`,
        image: {
          url: 'https://rdofm.net/m/req/img/cron/pipe_none.png?t=1'
        }
      })

      v.value[t.name] = {
        cron: t.cron,
        guid: t.guid
      }
      v.value['logbook'] = t.channel

      // A cheat to list servers whom has cronjobs.
      global.db.check('cronjob_list', {
        main: 'a'
      }).then(b=>{
        b = JSON.parse(b.value)
        if(!b[s.message.guild.id]) b[s.message.guild.id]=s.message.guild.id
        global.db.set('cronjob_list', {main: 'a',other: JSON.stringify(b)})
      })

      global.db.set('cronjob', {
        main: s.message.guild.id,
        other: JSON.stringify(v.value)
      }).then(() => {
        s.message.channel.sendMessage('Cronjob Created.')
      }).catch(() => {
        t.message.edit('', {
          title: `Cronjob ${t.name} Killed.`,
          description: `An error will appear in <#${s.message.channel.id}>`,
          image: {
            url: 'https://rdofm.net/m/req/img/cron/pipe_fail.png?t=1'
          }
        })

        s.message.channel.sendMessage(':x: DB Failure. Try again **later**.')
      })
    })
  },
  live: () => {
    let cron = require('cronfile')

    global.db.check('cronjob_list', {
      main: 'a'
    }).then(v => {
      v = JSON.parse(v.value)

      for(let i in v) {
        global.db.check('cronjob', {
          main: i
        }).then(b => {
          if(b.value) b = JSON.parse(b.value)
          if(b['purge30']) {
            cron.on(b['purge30'].cron, () => {
              b['logbook'].channel.sendMessage('', false, {
                title: `Running Cronjob purge30`,
                desc: a['purge30'].desc,
                image: {
                  url: 'https://rdofm.net/m/req/img/cron/pipe.png?t=1'
                }
              }).then(m => {
                a['purge30'].js(b['logbook'])
              })
            })
          }
        })
      }
    })
  }
}
