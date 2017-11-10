exports.run = (c, suffix) => {
     let msg = c.message
     let unirest = require('unirest')
    if (!c.message.channel.nsfw) {
         return msg.channel.sendMessage(':x: This channel is not marked as NSFW. Change it in the channel settings.')
     }
    if (msg.isPrivate) {
        return msg.channel.sendMessage(":x: You cannot use this command in DMs.")
    }
    unirest.post('http://rule34.xxx/index.php?page=dapi&s=post&q=index&tags=' + (suffix ? suffix : 'random'))
         .end(function (result) {
             msg.channel.sendMessage(':hourglass: Hold up...').then((m) => {
                 let xml2js = require('xml2js')
                 if (result.body.length < 75) {
                     msg.channel.sendMessage(':x: Nothing was found.')
                 } else {
                     xml2js.parseString(result.body, (err, reply) => {
                         if (err) {
                             msg.channel.sendMessage(':x: Bad API Response.')
                         } else {
                             let count = Math.floor((Math.random() * reply.posts.post.length))
                             let FurryArray = []
                             FurryArray.push(`${msg.author.mention} ${(suffix ? `searched for \`${suffix}\`` : 'Used rule34')}`)
                             FurryArray.push(reply.posts.post[count].$.file_url)
                             FurryArray.push('Rating: **' + reply.posts.post[count].$.score + '**')
                             m.edit(FurryArray.join('\n'))
                         }
                 })
             }
         })
     })
}
