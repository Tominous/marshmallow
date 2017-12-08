let servers = {}

exports.begin = () => {
    let debug = global.debug.listen
    let debugE = global.debug.error
    let func = global.saved

    global.bot.Dispatcher.on('GATEWAY_READY', () => {
        setTimeout(() => {
            global.server.emit('shardReady', {
                guilds: global.bot.Guilds.length,
                shard: global.argv.shardid
            })
            global.bot.User.setGame(global.config.language.playingStatus)
            for (let i = 0; i < func.core.length; i++) {
                if (func.core[i].meta) {
                    for (let event in func.core[i]) {
                        if (func.core[i].meta.event.toLowerCase() === 'listen') {
                            if (event.toLowerCase() !== 'meta' && event !== 'GATEWAY_READY' && !global.runningEvents[event]) {
                                try {
                                    func.core[i][event].begin()
                                } catch (e) {
                                    debug(e)
                                    global.dogbox.increment('bot.error')
                                }
                                global.runningEvents[event] = new Date()
                            }
                        }
                    }
                }
            }

            for (let i of global.bot.Guilds) {
                global.db.check('music', {
                    main: i.id
                }).then(thing => {
                    if (thing.value) {
                        if (servers[i.id]) return debug('Duplicate Server Found')
                        servers[i.id] = true
                        debug(i.id + ' Has a reserved slot.')
                        global.db.set('music', {
                            main: i.id,
                            other: true
                        }).then(() => {
                            setTimeout(() => {
                                if (!i) {
                                    return debug("Bot removed from guild before slot expired.")
                                }
                                // i.generalChannel.sendMessage(':warning: Slot is expiring now.') No generalChannel property of i anymore
                                global.db.set('music', {
                                    main: i.id,
                                    other: null
                                })
                            }, 1800000)
                        }).catch((e) => {
                            debugE(e.stack)
                        })
                    }
                })
            }
        }, 2000)
    })
}
