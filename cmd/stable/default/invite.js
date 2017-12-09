exports.run = (c) => {
	c.message.channel.sendMessage(`You can add me here!\n<${global.config.oauthURL}>`)
}