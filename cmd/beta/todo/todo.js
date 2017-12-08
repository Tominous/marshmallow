exports.run = (c, suffix) => {
  let Vibrant = require('node-vibrant')
  let colour = global.convertToHex(25,25,25) // YEAH TAKE MY AUSSIE FUCKING SHIT 'YO FUCK 'COLOR'

console.log('*burp*')
  Vibrant.from(c.message.author.avatarURL.replace('.gif', '.png')).getPalette((e, p) => {
    colour = global.convertToHex(p.Vibrant._rgb[0], p.Vibrant._rgb[1], p.Vibrant._rgb[2])
    console.log('hello...')

      global.db.check('todoList', {
        main: c.message.author.id
      }, null, true).then(v => {
        console.log('db pass')
        if(!suffix) {
          console.log('no suffix')
          if(!v.value || JSON.parse(v.value).length === 0) {
            console.log('cool.')
            c.message.channel.sendMessage('', null, {
              title: 'You completed everything!',
              description: `If you need something to do, Why not give Marshmallow some [New Commands](${global.config.helpDomain})?`,
              color: colour,
              image: {
                url: global.config.language.todo.done,
                width: 217,
                height: 217
              }
            })
          } else {
            v.value = JSON.parse(v.value)

            let field = []
            for(let i = 0; i < v.value.length; i++) {
              let d = new Date(v.value[i].timestamp)
              let n = new Date()
              let dN = Math.floor((new Date() - new Date(n.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24))
              let dT = Math.floor((new Date() - new Date(d.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24))
              let dA = dN - dT
              field.push({
                  name: `${i}: ${(dA < 1 ? 'Today' : `${dA} Days ago.`)}`,
                  value: v.value[i].msg
                })
            }

            c.message.channel.sendMessage('', null, {
              title: `You have ${v.value.length} things to do.`,
              description: 'You should get started on the oldest one.',
              fields: field,
              color: colour,
              image: {
                url: global.config.language.todo.start,
                width: 217,
                height: 217
              }
            })

          }
        } else {
          if(suffix.startsWith('add ')) {
            suffix = suffix.replace('add ', '')

            let guid = global.guid()
            let tmp = []

            if(v.value) {
              tmp = JSON.parse(v.value)
            }

            tmp.push({
              timestamp: new Date(),
              msg: suffix,
              guid: guid
            })

            global.db.set('todoList', {
              main: c.message.author.id,
              other: JSON.stringify(tmp)
            }, true).then(v => {
              c.message.channel.sendMessage('', null, {
                title: 'I\'ve added that :smile:',
                footer: {text: 'Maybe actually complete it.'},
                color: colour,
                image: {
                  url: global.config.language.todo.done.add,
                  width: 217,
                  height: 217
                }
              })
            })
          } else if(suffix.startsWith('del ')) {
            suffix = suffix.replace('del ', '')

            let tmp = []

            if(v.value) {
              tmp = JSON.parse(v.value)
            } else {
              return c.message.channel.sendMessage(':x: You have nothing.')
            }

            for(let i = 0; i < tmp.length; i++) {
              if(`${i}` === suffix) {
                tmp.splice(i, 1)
              }
            }

            global.db.set('todoList', {
              main: c.message.author.id,
              other: JSON.stringify(tmp)
            }, true).then(v => {
              c.message.channel.sendMessage('', null, {
                title: 'Removed!',
                footer: {text: 'Hint: Actually completing it could get you somewhere.'},
                color: colour,
                image: {
                  url: global.config.language.todo.add,
                  width: 217,
                  height: 217
                }
              })
            })
          } else {
            c.message.channel.sendMessage(':x: That isn\'t a valid action.')
          }
        }
      }).catch(e => {
        c.message.channel.sendMessage(`Well, that ended unexpectedly.\n\nPlease report this to https://discord.gg/radwolf.\n\`\`\`js\n${e.stack}\n\`\`\``)
      })
  })
}
