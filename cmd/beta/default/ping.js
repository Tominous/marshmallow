// drew was here lol

exports.run = (c) => {
    let start = new Date(c.message.timestamp)
    c.message.channel.sendMessage('Pong').then((m) => {
        let end = new Date(m.timestamp) - start
        m.edit(`Hello Beta Person.\nDebug: \`${end}ms\` (Command delay, not accurate latency)`)
    })
}
