exports.run = (c) => {
  c.message.channel.sendMessage(`
Hello!

Help can be found at <${global.config.helpDomain}>
You can contribute to this bot's framework at <https://github.com/radwolfdev/marshmallow>
`)
}