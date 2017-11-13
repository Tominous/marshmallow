exports.begin = () => {
    global.server.on('globalSendMessage', (d) => {
        if (d.id && d.msg) {
            let v
            if (global.bot.Channels.get(d.id)) v = global.bot.Channels.get(d.id)

            v.sendMessage(d.msg)
        }
    })
}
