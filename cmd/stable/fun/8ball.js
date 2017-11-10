exports.run = (c, suffix) => {
    if (!suffix) {
        c.message.channel.sendMessage(':8ball: *I couldn\'t hear you.*')
        return
    }
    let answers = [
        'Signs point to yes.',
        'Yes.',
        'Reply hazy, try again.',
        'Without a doubt.',
        'My sources say no.',
        'As I see it, yes.',
        'You may rely on it.',
        'Concentrate and ask again.',
        'Outlook not so good.',
        'It is decidedly so.',
        'Better not tell you now.',
        'Very doubtful.',
        'Yes - definitely.',
        'It is certain.',
        'Cannot predict now.',
        'Most likely.',
        'Ask again later.',
        'My reply is no.',
        'Outlook good.',
        'Don\'t count on it.',
        'Who cares?',
        'Never, ever, ever.',
        'Possibly.',
        'There is a small chance.'
    ]
    let answer = answers[Math.floor(Math.random() * answers.length)]
    c.message.channel.sendMessage(':8ball: *' + answer + '*')
}
