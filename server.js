global.server = new(require('socket.io-client'))('http://localhost:8888/')

exports.queue = (body) => {
  global.server.emit('dbqueue', body)
}
exports.usage = (body) => {
  global.server.emit('dbusage', body)
}
exports.notify = (body) => {
  global.server.emit('dbnotif', body)
}
exports.emit = (b) => {
  global.server.emit(b.emit, b.body)
}