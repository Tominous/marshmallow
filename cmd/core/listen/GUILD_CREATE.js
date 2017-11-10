exports.begin = () => {
    let Config = require('../../../config.json')
    global.bot.Dispatcher.on('GUILD_CREATE', (s) => {
        if (!global.bot.connected) return
        if (!s.becameAvailable) {
            // global.bot.Guilds.get(s.guild.id).channels.get(s.guild.id).sendMessage('__**Woohoo!**__\n\nUnlike some, you actually invited me correctly! Now, here\'s some basics;\n\n**I do learn**\n**I don\'t like memes**\n**I do make memes**\n**I do play music**\n**You can learn a thing or two from me**\n\nNeed help? just do `:help`. OK? We sorted? Awesome.')
            global.server.emit('addServer', s.guild)
            // S doesn't have a defaultChannel defined inside it.
            /*guild:
                IGuild {
                    id: '347147169855176704',
                    name: 'Test',
                    owner_id: '161014852368859137',
                    icon: null,
                    splash: null,
                    features: Set {},
                    emojis: [],
                    default_message_notifications: 0,
                    roles: [ [Object] ],
                    afk_channel_id: null,
                    afk_timeout: 300,
                    verification_level: 0,
                    explicit_content_filter: 0,
                    region: 'us-south',
                    member_count: 2,
                    large: false,
                    mfa_level: 0,
                    joined_at: '2017-08-15T23:18:10.610491+00:00' },
                becameAvailable: false }
            */
        }
    })
}
