exports.run = (c) => {

  global.db.check('octro', {
    main: c.message.guild.id
  }).then(v => {
    // Some reason thing = !thing isnt working?
    let tog = 'true'
    if (v.value === 'true') tog = 'false'

    global.db.set('octro', {
      main: c.message.guild.id,
      other: tog
    })

    c.message.channel.sendMessage(`Toggled to ${tog}`)
  })
}