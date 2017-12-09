// drew was here lol

exports.run = (c) => {
	let start = new Date(c.message.timestamp)
	c.message.channel.sendMessage('Pong').then((m) => {
		let end = new Date(m.timestamp) - start
		m.edit(`Pong\nDebug: \`${end}ms\` (Command delay, not accurate latency)`)
	})
}

exports.WebController = {
	BaseDistributions: false,
	pages: [{
			path: 'default/views/index',
			name: 'index'
		},
		{
			path: 'default/views/help',
			name: 'help'
		}
	],
	RequestHandlers: (router) => {
		router.get('/api/index', (r, s) => {
			s.json({
				e: 'I\'m too stupid to know what you want to do, sorry.'
			})
		})
	}
}