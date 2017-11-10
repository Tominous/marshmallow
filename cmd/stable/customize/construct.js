let t = {}

let CMD = {
    create: function (a, s, c) {
        t.action = a
        t.c = c
        t.suffix = s
    },
    construct: () => {
        let list

        global.db.check('cmd', {
            main: t.c.message.guild.id
        }, t.c).then(r => {
            if (typeof r.value === 'undefined') {
                if (t.action !== 'create') {
                    t.c.message.channel.sendMessage(':x: Construct failed:\n\n' +
                        'No Custom Commands found. Please **Create One** instead.')
                    return
                } else {
                    list = {}
                }
            } else {
                list = JSON.parse(r.value)
            }
            if (t.action === 'create') {

                t.suffix = t.suffix.substr(t.action.length + 1)

                t.suffix = t.suffix.split('`')

                let cmd = t.suffix[0].slice(0, -1)
                let genGUID = global.guid()

                t.c.message.channel.sendMessage(':hourglass: Creating Command `' + cmd + '` (`' + genGUID + '`)')

                if (!cmd) return t.c.message.channel.sendMessage(':x: Missing Command Name.')

                cmd.replace(' ', '-')
                if (cmd.indexOf(' ') > -1) t.c.message.channel.sendMessage(':warning: A space was found within the Command Name. It will be replaced with `-` instead. (It\'s now `' + cmd + '`)')

                if (list) if (list.length === 99) return t.c.message.channel.sendMessage(':x: 99/99 Commands used. **Delete One** if you want to create this command.')


                if (list[cmd]) {
                    let string = []
                    for (let i in list) {
                        if (list.hasOwnProperty(i)) {
                            string.push(list[i].name)
                        }
                    }
                    t.c.message.channel.sendMessage(':x: This command already exists. Here\'s a list if you\'ve forgotten;\n\n' + string.join('\n'))
                    return
                }

                if (cmd.length > 10) {
                    t.c.message.channel.sendMessage(':x: Command name too long.')
                    return
                } else if (cmd.length < 3) {
                    t.c.message.channel.sendMessage(':x: Command name too short.')
                    return
                }

                let tmp = {
                    name: null,
                    id: genGUID,
                    acString: null
                }
                tmp.name = cmd
                t.suffix = t.suffix.splice(1, 1)
                // ['say:This !! do:That']

                if (!t.suffix[0]) return t.c.message.channel.sendMessage(':x: Missing Construct String.')

                tmp.acString = t.suffix[0].split(' !! ')

                for (let i = 0; i < tmp.acString.length; i++) {
                    if (tmp.acString[i].startsWith('getFromAPI:')) {
                        t.c.message.channel.sendMessage(':x: Get From API is only for Partnered and Pro servers.\n' +
                            'If you want to use this, contact Curits#0708 (in https://discord.gg/radwolf), or become a Patreon at <https://patreon.com/rekkisomo>\n\n' +
                            'The Construction Process has stopped.')
                        return
                    }
                    if (tmp.acString[i].startsWith('say:')) {
                        t.c.message.channel.sendMessage(':warning: Say will bypass the `username: content` shield on the regular `say` command.')
                    }
                }

                if (list) {
                    list[cmd] = tmp
                }
                global.db.set('cmd', {
                    main: t.c.message.guild.id,
                    other: JSON.stringify(list)
                }).then(() => {
                    let string = []
                    for (let i in list) {
                        if (list.hasOwnProperty(i)) {
                            string.push(list[i].name)
                        }
                    }
                    t.c.message.channel.sendMessage(':white_check_mark: Created `' + cmd + '`!\n\n' + string.join('\n'))
                }).catch(e => {
                    t.c.message.channel.sendMessage(':x: Whoops, ' + e)
                })
            }
            if (t.action === 'delete') {
                t.c.message.channel.sendMessage(':hourglass: Deleting `' + t.suffix + '`...')
                if (typeof r.value !== 'undefined') {
                    r.value = JSON.parse(r.value)
                    t.suffix = t.suffix.substr(t.action.length + 1)
                    if (r.value[t.suffix]) {
                        delete r.value[t.suffix]

                        global.db.set('cmd', {
                            main: t.c.message.guild.id,
                            other: JSON.stringify(r.value)
                        }).then(() => {
                            let string = []
                            for (let i in r.value) {
                                if (r.value.hasOwnProperty(i)) {
                                    string.push(r.value[i].name)
                                }
                            }
                            t.c.message.channel.sendMessage(':white_check_mark: Deleted `' + t.suffix + '`!\n\n' + string.join('\n'))
                        }).catch(e => {
                            t.c.message.channel.sendMessage(':x: Whoops, ' + e)
                        })
                    } else {
                        t.c.message.channel.sendMessage(':x: Command doesn\'t exist.')
                    }
                }
            }
        })
    }
}

module.exports = CMD
