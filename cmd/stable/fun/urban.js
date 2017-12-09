exports.run = (c, suffix) => {

	if (!suffix) {
		return c.message.channel.sendMessage(":warning: Please specify a word for me to look up.")
	}

	let urban = require('urban')

	//noinspection JSUnresolvedFunction
	urban(suffix).first(json => {
		//noinspection JSUnresolvedVariable
		if (!JSON.stringify(json)) {
			return c.message.channel.sendMessage(':x: That word is so screwed up, Urban Dictionary doesn\'t contain it.')
		}
		//noinspection JSUnresolvedVariable
		c.message.channel.sendMessage(`**${json.word[0].toUpperCase() + json.word.slice(1)}** - *${json.author}*\n\n\`\`\`fix\n${json.definition}\`\`\`\n:thumbsup: ${json.thumbs_up} — :thumbsdown: ${json.thumbs_down}`)
	})
}