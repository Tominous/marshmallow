exports.run = (c) => {
	let catFacts = require('cat-facts')
	let randomFact = catFacts.random()
	let request = require('request')
	request('http://random.cat/meow', (error, response, body) => {
		if (!error && response.statusCode === 200) {
			let catimage = JSON.parse(body)
			let catURL = catimage.file
			c.message.channel.sendMessage(`:cat: ${randomFact}.\n${catURL}`)
		} else {
			c.message.channel.sendMessage(':warning: I failed to find info on cats, if this problem persists please report it to my support server.')
		}
	})
}