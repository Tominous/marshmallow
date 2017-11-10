exports.run = (c) => {
    let randomNumber = Math.floor(Math.random() * 10 + 1)
    let wordRule = "a"
    if(randomNumber == 8) wordRule = "an"
    if(c.message.mentions[0]) {
        c.message.channel.sendMessage(`I rate ${c.message.mentions[0].username}'s name ${wordRule} **${randomNumber}** out of 10.`)
    } else {
        c.message.channel.sendMessage(`I rate your name "${c.message.author.username}" ${wordRule} **${randomNumber}** out of 10.`)
    }
}
