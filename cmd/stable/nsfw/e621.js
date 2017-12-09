exports.run = (c, suffix) => {
  let msg = c.message
  let unirest = require('unirest')
  if (!c.message.channel.nsfw) {
    return c.message.channel.sendMessage(':x: This channel is not marked as NSFW. Change it in the channel settings.')
  }
  if (msg.isPrivate) {
    return msg.channel.sendMessage(":x: You cannot use this command in DMs.")
  }
  unirest.post(`https://e621.net/post/index.json?limit=30&tags=${suffix}`)
    .headers({
      'Accept': 'application/json',
      'User-Agent': 'Unirest Node.js'
    })
    .end(function (result) {
      c.message.channel.sendMessage(':hourglass: Hold up...').then((m) => {
        if (result.body.length < 1) {
          msg.channel.sendMessage(':x: Nothing was found.')
        } else {
          let count = Math.floor((Math.random() * result.body.length))
          let FurryArray = []
          if (suffix) {
            FurryArray.push(`${msg.author.mention}, you've searched for \`${suffix}\``)
          } else {
            FurryArray.push(`${msg.author.mention}, you've searched for \`random\``)
          }
          FurryArray.push(result.body[count].file_url)
          FurryArray.push('Rating: **' + result.body[count].score + "**")
          m.edit(FurryArray.join('\n'))
        }
      })
    })
}