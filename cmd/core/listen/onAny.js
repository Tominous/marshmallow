let Bezerk = require('./bezerk')

exports.begin = () => {
  global.bot.Dispatcher.onAny((type, data) => {
    if (data.type === 'READY' || type === 'VOICE_CHANNEL_JOIN' || type === 'VOICE_CHANNEL_LEAVE' || type.indexOf('VOICE_USER') === 0 || type === 'PRESENCE_UPDATE' || type === 'TYPING_START' || type === 'GATEWAY_DISPATCH') return
    Bezerk.emit(type, data, global.bot)
  })
}