let debugE = global.debug.error
let debug = global.debug.listen

exports.begin = () => {
    global.bot.Dispatcher.on('MESSAGE_CREATE', (c) => {

        global.dogbox.increment('bot.messages')

        global.db.check('globalBan', {
            main: (c.message.guild ? c.message.guild.id : 0)
        }).then(v => {
            if (v.value) return

            let cmd
            let suffix
            let prefix
            global.db.check('prefix', {
                main: (c.message.guild ? c.message.guild.id : 0)
            }).then((r) => {
                prefix = (r.value ? r.value : global.config.prefix)
                if (c.message.content.indexOf(prefix) === 0) {
                    cmd = c.message.content.substr(prefix.length).split(' ')[0].toLowerCase()
                    suffix = c.message.content.substr(prefix.length).split(' ')
                    suffix = suffix.slice(1, suffix.length).join(' ')
                } else if (c.message.content.indexOf(global.bot.User.mention) === 0) {
                    cmd = c.message.content.substr(global.bot.User.mention.length + 1).split(' ')[0].toLowerCase()
                    suffix = c.message.content.substr(global.bot.User.mention.length).split(' ')
                    suffix = suffix.slice(2, suffix.length).join(' ')
                } else if (c.message.content.indexOf(global.bot.User.nickMention) === 0) {
                    cmd = c.message.content.substr(global.bot.User.nickMention.length + 1).split(' ')[0].toLowerCase()
                    suffix = c.message.content.substr(global.bot.User.nickMention.length).split(' ')
                    suffix = suffix.slice(2, suffix.length).join(' ')
                }
                if (c.message.author.bot || c.message.author.id === global.bot.User.id) {
                    return
                }
                if (!c.message.isPrivate) {
                    global.db.check('reports', {
                        main: c.message.guild.id
                    }).then((v) => {
                        if (!v.notFound) {
                            v.value = JSON.parse(v.value)
                            v.value.messages++
                                global.db.set('reports', {
                                    main: c.message.guild.id,
                                    other: JSON.stringify(v.value)
                                })
                        }
                    })
                }
                if (c.message.content.startsWith(prefix)) {
                    let completed = false

                    if (!c.message.isPrivate) {
                        global.db.check('cmd', {
                            main: c.message.guild.id
                        }, c).then(d => {
                            if (d.value) {
                                d.value = JSON.parse(d.value)
                                if (d.value[cmd]) {
                                    for (let i = 0; i < d.value[cmd].acString.length; i++) {
                                        let ac = d.value[cmd].acString[i]

                                        if (ac.startsWith('say:')) {
                                            ac = ac.replace('say:', '')

                                            c.message.channel.sendMessage(ac)
                                        }
                                        completed = true
                                    }
                                }
                            }
                        })
                    }

                    let func = global.saved
                    for (let i = 0; i < func.stable.length; i++) {
                        if (func.stable[i].meta) {
                            for (let event in func.stable[i]) {
                                if (func.stable[i].meta.event.toLowerCase() === 'cmd') {
                                    //noinspection JSUnfilteredForInLoop
                                    if (event.toLowerCase() !== 'meta') {
                                        let cmdchk = func.stable[i]
                                        try {
                                            if (cmdchk[cmd]) {
                                                global.db.check('reports', {
                                                    main: c.message.guild.id
                                                }).then((v) => {
                                                    if (!v.notFound) {
                                                        v.value = JSON.parse(v.value)
                                                        v.value.commandsRan++
                                                            global.db.set('reports', {
                                                                main: c.message.guild.id,
                                                                other: JSON.stringify(v.value)
                                                            })
                                                    }
                                                })
                                                global.db.check('acclvl', {
                                                    main: (c.message.guild.id + c.message.author.id),
                                                    other: c.message.author
                                                }, c).then((r) => {
                                                    runCommand('stable', r, c, cmd, suffix, func.stable[i])
                                                }).catch((e) => {
                                                    debugE(e.stack)
                                                })
                                            }
                                        } catch (e) {
                                            debugE(e)
                                        }
                                        break
                                    }
                                }
                            }
                        }
                    }
                }
            })
        })
    })
}

function runCommand(v, r, c, cmd, suffix, func) {
    return new Promise((resolve, reject) => {
        if (c.message.isPrivate) {
            try {
                if (func.meta.acclvl > 0) {
                    c.message.channel.sendMessage(':x: This command cannot be ran in DMs.')
                    return
                }
                debug('#privateDM | ' + c.message.author.username + ': ' + c.message.content)
                func[cmd].run(c, suffix)

                resolve()
            } catch (e) {
                debugE(e)
                c.message.channel.sendMessage(`:x: Oops, an error occurred and I stopped the command process. Here's what happened: \`\`\`fix\n${e.stack}\`\`\``)
                reject(e)
            }
        } else {
            if (v === 'stable') {
                if (!func[cmd]) reject('INVALID_COMMAND')
                let lvl = r.value
                if (r.owner) lvl = 4
                if (r.master) lvl = 999
                global.ranCommand()
                if (!lvl) lvl = 0

                if (lvl >= func.meta.acclvl) {
                    try {
                        debug('#' + c.message.channel.name + ':' + c.message.guild.name + ' | ' + c.message.author.username + ': ' + c.message.content)
                        func[cmd].run(c, suffix)

                        resolve()
                    } catch (e) {
                        debugE(e)
                        c.message.channel.sendMessage(`:x: Oops, an error occurred and I stopped the command process. Here's what happened: \`\`\`fix\n${e.stack}\`\`\``)

                        reject(e)
                    }
                } else {
                    debug('! Invalid Permissions ! :: #' + c.message.channel.name + ':' + c.message.guild.name + ' | ' + c.message.author.username + ': ' + c.message.content)
                    c.message.channel.sendMessage(`:x: Invalid Access Level. (User has \`${lvl}\`, needed \`${func.meta.acclvl}\`)`)
                }
            }

        }
    })

}
