exports.run = (c, suffix) => {
    let CMD = require('./construct')
    let actions = ['create', 'delete', 'modify']

    if (!suffix) {
        return c.message.channel.sendMessage(':x: lol no suffix.')
    }

    actions.map(a => {
        if (suffix.toLowerCase().startsWith(a)) {
            CMD.create(a, suffix, c)
            CMD.construct()
        }
    })
}
