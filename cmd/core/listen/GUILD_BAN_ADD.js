exports.begin = () => {
    global.bot.Dispatcher.on('GUILD_BAN_ADD', (s) => {
        global.db.check('reports', {
            main: s.guild.id
        }).then((v) => {
            if (!v.notFound) {
                v.value = JSON.parse(v.value)
                v.value.lostMembers++
                global.db.set('reports', {
                    main: s.guild.id,
                    other: JSON.stringify(v.value)
                })
            }
        })
    })
}
