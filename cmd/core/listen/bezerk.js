let Config = require('../../../config.json')
let Websocket = require('ws')
let Bezerk

exports.begin = () => {
  let Logger = global.debug.listen

  let bot

  setTimeout(() => {
      if (Config.bezerk.use === true) {
          try {
              Bezerk = new Websocket(Config.bezerk.uri)
          } catch (e) {
              Logger('Whoops, couldn\'t connect to Websocket.')
          }
          let argv = require('minimist')(process.argv.slice(2))
          //noinspection JSUnresolvedFunction
          Bezerk.on('close', () => {
              Logger('Bezerk connection lost.')
              //noinspection JSAnnotator
              delete Bezerk
          })
          //noinspection JSUnresolvedFunction
          Bezerk.on('open', () => {
              argv.shardid = (argv.shardid) ? 1 : argv.shardid
              argv.shardcount = (argv.shardcount) ? 1 : argv.shardcount
              //noinspection JSUnresolvedFunction
              Bezerk.send(JSON.stringify({
                  op: 'IDENTIFY_SHARD',
                  c: [argv.shardid, argv.shardcount]
              }))
          })
          //noinspection JSUnresolvedFunction
          Bezerk.on('message', (m) => {
              let msg
              try {
                  msg = JSON.parse(m)
              } catch (e) {
                  //noinspection JSUnresolvedFunction
                  Bezerk.send(JSON.stringify({
                      op: 'ERROR',
                      c: e
                  }))
                  return
              }
              if (msg.op === 'OK') {
                  Logger('Bezerk connection established.')
                  return
              }
              if (!msg.c) return
              try {
                  eval(msg.c)
                  //noinspection JSUnresolvedFunction
                  Bezerk.send(JSON.stringify({
                      op: 'EVAL_REPLY',
                      c: eval(msg.c)
                  }))
              } catch (e) {
                  //noinspection JSUnresolvedFunction
                  Bezerk.send(JSON.stringify({
                      op: 'ERROR',
                      c: e
                  }))
              }
          })
      }
  }, 10000)
}

exports.emit = function (event, data, client) {
    if (Bezerk === undefined || Bezerk.readyState !== 1) return
    bot = client
    Bezerk.send(JSON.stringify({
        op: event,
        c: data
    }))
}
