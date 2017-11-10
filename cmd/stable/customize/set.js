exports.run = (c, suffix1) => {
    let suffix = []
    let advanced = false
    let cmdlogs = []
    let cmdmainerror = null
    let isUsingDeveloperMode = false
    suffix = suffix1.split('|')
    cmdlogs.push(`Try servercustomize.set.run(): Suffix: ${suffix}`)
        if (!suffix[0] || !suffix[1]) {
            cmdlogs.push(`Incorrect Suffix Layout`)
            c.message.channel.sendMessage(':x: Incorrect layout. `variable | requirements` (EXAMPLE: `lvl | @Curtis#0708 | 3`, Double spaces will be replaced.)')
        } else {
            cmdlogs.push(`Layout check pass, Try ${suffix[0]}  |  ${suffix}`)
            if (suffix[0].indexOf('lvl') > -1) {
                cmdlogs.push(`Begin lvl`)
                if (!suffix[2]) {
                    cmdlogs.push(`Incorrect Suffix Layout`)
                    c.message.channel.sendMessage(':x: Incorrect layout. `variable | requirements` (EXAMPLE: `lvl | @Curtis#0708 | 3`, Double spaces will be replaced.)')
                    return
                }
                if (c.message.mentions[0]) {
                    cmdlogs.push(`User Mention Found`)
                    if (suffix[2] >= 0 && suffix[2] < 4 && !isNaN(suffix[2])) {
                        cmdlogs.push(`Correct suffix`)

                        suffix[2] = suffix[2].replace('  ', ' ')
                        global.db.set('acclvl', {
                            main: (c.message.guild.id + c.message.mentions[0].id),
                            other: suffix[2]
                        }).then(() => {
                            cmdlogs.push(`Complete`)
                            c.message.channel.sendMessage(`:white_check_mark: Set ${c.message.mentions[0].username}'s Access Level to ${suffix[2]}`)
                        }).catch(() => {
                            c.message.channel.sendMessage(`:x: Something happened, ${c.message.mentions[0].username}'s Access Level was not changed.`)
                            cmdmainerror = "Database Failure"
                        })
                    } else {
                        c.message.channel.sendMessage(`:x: Invalid level. Try a level 0 through 3.`)
                    }
                } else {
                    if (c.message.mention_roles[0]) {
                        cmdlogs.push(`Role Mention Found`)
                        if (suffix[2] >= 0 && suffix[2] < 4 && !isNaN(suffix[2])) {
                            cmdlogs.push(`Correct suffix`)

                            suffix[2] = suffix[2].replace('  ', ' ')
                            global.db.set('acclvl', {
                                main: (c.message.guild.id + c.message.mention_roles[0].id),
                                other: suffix[2]
                            }).then(() => {
                                cmdlogs.push(`Complete`)
                                c.message.channel.sendMessage(`:white_check_mark: Set ${c.message.mention_roles[0].name}'s Access Level to ${suffix[2]}`)
                            }).catch(() => {
                                c.message.channel.sendMessage(`:x: Something happened, ${c.message.mentions_roles[0].name}'s Access Level was not changed.`)
                                cmdmainerror = "Database Failure"
                            })
                        } else {
                            c.message.channel.sendMessage(`:x: Invalid level. Try a level 0 through 3.`)
                        }
                    }
                }
            }
            if (suffix[0].indexOf('announceMemberActions') > -1) {
                cmdlogs.push(`Begin AMJ`)
                cmdlogs.push(`Correct suffix`)

                suffix[1] = suffix[1].split(' ')

                let ac = {}
                let isExist = false

                for(let b = 0; b < c.message.guild.channels.length; b++) {
                  if(c.message.guild.channels[b].name === 'basecamp') {
                    isExist = c.message.guild.channels[b].id
                  }
                }

                for (let i = 0; i < suffix[1].length; ++i) {
                  let tmp = {
                    channel: suffix[2].replace('<#', '').replace('>', '').replace(' ', '') || (isExist ? isExist : false) || c.message.guild.generalChannel.id,
                    message: suffix[3]
                  }

                  ac[suffix[1][i]] = tmp
                }

                global.db.set('announceMemberActions', {
                    main: c.message.guild.id,
                    other: JSON.stringify(ac)
                }, c).then(() => {
                    cmdlogs.push(`Complete`)
                    c.message.channel.sendMessage(`:white_check_mark: Set Announcing to ${JSON.stringify(ac)}`)
                }).catch((e) => {
                    c.message.channel.sendMessage(`:x: Something happened. ${e}`)
                    cmdmainerror = "Database Failure"
                })
            }
            if (suffix[0].indexOf('prefix') > -1) {
                cmdlogs.push(`Begin Prefix`)
                cmdlogs.push(`Correct suffix`)

                suffix[1] = suffix[1].substr(1)

                global.db.set('prefix', {
                    main: c.message.guild.id,
                    other: suffix[1]
                }, c).then(() => {
                    cmdlogs.push(`Complete`)
                    c.message.channel.sendMessage(`:white_check_mark: Set Prefix to ${suffix[1]}`)
                }).catch((e) => {
                    c.message.channel.sendMessage(`:x: Something happened. ${e}`)
                    cmdmainerror = "Database Failure"
                })
            }
        }
    if (cmdmainerror || isUsingDeveloperMode) {
        c.message.channel.sendMessage(
            `${cmdmainerror ? cmdmainerror : ''}\n\n`
            + `\`\`\`fix`
            + `\n${cmdlogs.join('\n')}\`\`\``
        )
    }
}
