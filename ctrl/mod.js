let fs = require('fs')

let PY = require('python-shell')
let nnBot = new PY(`neural/chatbot.py`, {
    args: ['--save_dir', 'neural/models/xhavier'],
    mode: 'text'
})

nnBot.on('message', (d) => {
    global.debug.check('boom')
})

// M-HK
global.hk = require('./hk')

global.Discordie = require('discordie')
global.argv = require('minimist')(process.argv.slice(2))
if (global.argv.max === 1) {
    global.bot = new global.Discordie({
        autoReconnect: true
    })
} else {
    global.bot = new global.Discordie({
        autoReconnect: true,
        shardId: global.argv.shardid,
        shardCount: global.argv.max
    })
}

global.dbg = require('debug')
global.elog = require('../req/errorlog')
global.config = require('../config.json')
global.dogbox = new(require('node-dogstatsd').StatsD)()
global.saved = {}
global.runningEvents = {}
global.reloadcount = 0
global.fullreloadcount = 0
global.restarts = 0
global.totalCommands = 0

global.debug = {
    check: (d) => {
        let log = require('debug')('check')
        log(`[SHARD ${global.argv.shardid}:CHECK] ${d}`)
        global.dogbox.increment('bot.activity')
    },
    listen: (d) => {
        let log = require('debug')('listen')
        log(`[SHARD ${global.argv.shardid}:LISTEN] ${d}`)
        global.dogbox.increment('bot.activity')
    },
    error: (d) => global.elog(d),
    cmd: (d) => {
        let log = require('debug')('cmd')
        log(`[SHARD ${global.argv.shardid}:CMD] ${d}`)
        global.dogbox.increment('bot.activity')
    },
    db: (d) => {
        let log = require('debug')('db')
        log(`[SHARD ${global.argv.shardid}:DB] ${d}`)
        global.dogbox.increment('bot.activity')
    },
    dbg: global.dbg,
    voice: (d) => {
        let log = require('debug')('voice')
        log(`[SHARD ${global.argv.shardid}:VOICE] ${d}`)
        global.dogbox.increment('bot.activity')
    },
    nn: (d) => {
        let log = require('debug')('nn')
        log(`[SHARD ${global.argv.shardid}:NEURAL_NETWORK] ${d}`)
        global.dogbox.increment('bot.activity')
    }
}

global.componentToHex = (c) => {
    let hex = c.toString(16)
    return hex.length === 1 ? "0" + hex : hex
}

global.convertToHex = (r, g, b) => {
    let c = global.componentToHex(r) + global.componentToHex(g) + global.componentToHex(b)
    c = c.toString(16)
    return parseInt(c, 16)
}

global.s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1)
}

global.guid = () => {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4()
}

global.saveFunctions = (version, inner) => {
    /**
     * Function Object
     *
     * @class inner
     * @type {object}
     * @example {ping:{run:function}}
     */
    global.saved[version] = []
    for (let key in inner) {
        if (inner.hasOwnProperty(key)) {
            global.saved[version].push(inner[key])
        }
    }
}

setTimeout(() => {
    global.restarts++
        global.bot.connect({
            token: global.config.token
        })
}, 5000)

global.ranCommand = () => {
    global.dogbox.increment('bot.commands')
    global.totalCommands++
}

global.db = require('../req/db')
global.debug.check('mod.js Loaded')

nnBot.send('\n')

global.smarts = {
    write: (m) => {
        return new Promise(function(s) {
            let msg

            global.debug.check('[ACCESS] Neural Network')
            nnBot.send(m)
            let tmpListen = nnBot.on('message', (d) => {
                global.debug.check(d)
                if (d.startsWith('>  ')) {
                    msg = d.replace('>  ', '')
                }
            })

            setTimeout(() => {
                tmpListen = null
                s(msg)
            }, 2000)
        })
    }
}
