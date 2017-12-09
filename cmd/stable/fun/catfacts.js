exports.run = (c) => {
  c.message.channel.sendMessage(`${(require('cat-facts')).random()}.`)
}