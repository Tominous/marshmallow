exports.run = (c) => {
    (require('../../../req/rld')).getAll('../../../stable').then(d => {
        (require('../../../ctrl/mod')).saveFunctions(d)
        c.message.channel.sendMessage(':white_check_mark: Reloaded.')
        global.reloadcount++
    })
}
