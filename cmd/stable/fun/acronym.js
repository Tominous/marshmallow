exports.run = (c, suffix) => {
	let acronym = require('acronym')
	if (!suffix) {
		return c.message.channel.sendMessage("I need an acronym to turn in to words!")
	} else {
		let acronymed = acronym(suffix)
		if (acronymed.length > 100) return c.message.channel.sendMessage("Acronym conversion too long, try a shorter word to convert.")
		c.message.channel.sendMessage(acronymed)
	}
}