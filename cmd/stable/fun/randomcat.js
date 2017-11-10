let request = require('request')
let fs = require('fs')
let config = require('../../../config.json')

exports.run = (c, suffix) => {
    let tags = suffix.replace(' ', '+')
    request('https://api.tumblr.com/v2/tagged?tag=cat' + (suffix ? '+' + tags : '') + `&api_key=${config.tumblrAPI}`, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            try {
                JSON.parse(body)
            } catch (e) {
                return c.message.channel.sendMessage(':x: API Returned an unconventional response.')
            }
            let r = JSON.parse(body)
            let randomCat = r.response[Math.floor(r.response.length * Math.random())]
            if (!randomCat.photos) {
                return c.message.channel.sendMessage(':x: API Returned an unconventional response.')
            }

            //noinspection JSUnresolvedVariable
            c.message.channel.uploadFile(request(randomCat.photos[0].original_size.url), null, `:cat: This is ${(randomCat.blog_name.endsWith('s') || randomCat.blog_name.endsWith('x') ? `${randomCat.blog_name}'` : `${randomCat.blog_name}'s`)} cat.\nPosted on ${randomCat.date}${(randomCat.summary ? `, ${randomCat.summary}` : '.')}\n\n${(randomCat.can_like ? '*You can :heart: this*' : '*You cannot :heart: this*')} -- ${(randomCat.can_reblog ? '*You can repost this*' : '*You cannot repost this*')} -- ${(randomCat.can_reply ? '*You can reply to this*' : '*You cannot reply to this*')}`)
        } else {
            c.message.channel.sendMessage(':x: Seems like an API is down. Try again later (Don\'t report this! We can\'t do anything)')
        }
    })
}
