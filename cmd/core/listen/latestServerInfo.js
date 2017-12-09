exports.begin = () => {
  global.server.on('setupServer', (d) => {
    global.debug.listen(d)
    if (!global.bot.Guilds.get(d.m)) return
    let srv = global.bot.Guilds.get(d.m)
    srv.generalChannel.sendMessage(':white_check_mark: Setup completed! If you have questions, feel free to ask in https://discord.gg/radwolf')
  })
}