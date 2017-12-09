exports.run = (c) => {
  c.message.channel.sendTyping()
  global.smarts.write(c.message.content).then(m => {
    c.message.channel.sendMessage(m)
  }).catch(e => {
    c.message.channel.sendMessage(`:x: Neural Network is Unavailable. \`[Attack:${e}]\``)
  })
}