exports.run = (c, suffix) => {
  let v = require('../../../req/main_music_file')
  v.volume(c.message, suffix, global.bot).then(d => {
    c.message.channel.sendMessage(d)
  })
}