// What is this?
let I_SEE = 'nothing'

exports.run = (c, suffix) => {
  delete require.cache['/marshmallow/req/image_guess.js']
  let guess = require('../../../req/image_guess')

  new guess(suffix, (r) => {
    I_SEE = r
    c.message.channel.sendMessage(`:eyes: I see ${I_SEE}.`)
  })
}
