exports.run = (c) => {
  var catMe = require('cat-me')
  c.message.channel.sendMessage(`\`\`\`${catMe()}\n(Mobile users may not see this correctly.)\`\`\``)
}
// The cat selection is quite.. Eh? Like the same cat appears several times sometimes.