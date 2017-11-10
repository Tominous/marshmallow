exports.run = (c, suffix) => {
    c.message.channel.sendMessage(`\`${c.message.author.username}\`: ${suffix.replace(/@everyone/, '@\u200Beveryone').replace(/@here/, '@\u200Bhere')}`)
}
