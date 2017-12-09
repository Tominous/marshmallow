// TODO: Change how to load modules (and it's layout)
process.title = 'MarshChild'
require('../ctrl/mod')

let rld = require('./rld') //Reload
let debug = global.debug.check
let debugE = global.debug.error

exports.startListen = () => {
	debug(`Starting Marshmallow:${global.argv.shardid}`)

	let server = require('../server')
	let func = global.saved
	for (let i = 0; i < func.core.length; i++) {
		if (func.core[i].meta) {
			for (let event in func.core[i]) {
				if (func.core[i].meta.event.toLowerCase() === 'listen') {
					if (event.toLowerCase() !== 'meta' && event === 'GATEWAY_READY' && !global.runningEvents[event]) {
						func.core[i].GATEWAY_READY.begin()
						global.runningEvents[event] = new Date()
					}
				}
			}
		}
	}
}

rld.reload()

process.on('uncaughtException', (e) => {
	debugE(e.stack)
})

process.on('unhandledRejection', (reason, p) => {
	global.dogbox.increment('bot.error')
	debug(`Unhandled Rejection at:\nPromise ${p}\nreason: ${reason.stack}`)
})