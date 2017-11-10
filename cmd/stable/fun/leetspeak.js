exports.run = (c, suffix) => {
    /* If we want to use a stable in the future,
     let leet = require('l33tsp34k')
     var string = leet(`${suffix}`)
     */

    if (!suffix) {
        return c.message.channel.sendMessage(":warning: Tell me something to make l33t.")
    }
    suffix = suffix.toLowerCase()
    suffix = suffix.replace(new RegExp('i', 'g'), '1')
    suffix = suffix.replace(new RegExp('e', 'g'), '3')
    suffix = suffix.replace(new RegExp('a', 'g'), '4')
    suffix = suffix.replace(new RegExp('t', 'g'), '7')
    suffix = suffix.replace(new RegExp('o', 'g'), '0')
    /*
     suffix = suffix.replace(new RegExp('I', 'g'), '1')
     suffix = suffix.replace(new RegExp('E', 'g'), '3')
     suffix = suffix.replace(new RegExp('A', 'g'), '4')
     suffix = suffix.replace(new RegExp('T', 'g'), '7')
     suffix = suffix.replace(new RegExp('O', 'g'), '0')
     */
    c.message.channel.sendMessage(suffix)
}
