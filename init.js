'use strict'

// Best not to touch this, i'm being serious.

process.env.DEBUG = /**/ "check,nn,listen,error,command,dbg,init"
//**/DEBUG="*"

process.env.PM2_DEBUG = true
process.env.DEBUG_COLORS = true

let cp = require('child_process')
let exec = cp.exec
let request = require('request')
let Debug = require('debug')
let Logger = (d) => {
  let log = require('debug')('bezerk');
  log(`[CORE:BEZERK] ${d}`)
}
let info = (d) => {
  let log = require('debug')('init');
  log(`[CORE:INFO] ${d}`)
}
let Config = require('./config.json')
let path = require('path')
let argv = {
  max: Config.sharding.max,
  maxLoop: Config.sharding.maxLoop // Cuz sometimes the loop hates you.
}

info('Hello.')

let server = {
  basecamp: {
    app: require('express'),
    http: require('http'),
    ws: require('ws'),
    io: require('socket.io'),
    Strategy: require('passport-discord').Strategy,
    session: require('express-session'),
    passport: require('passport'),
    bodyParser: require('body-parser'),
    shards: []
  }
}

server.AuthorityCheck = {
  Hawk: (r, s, n) => {
    if (r.user) return n()
    s.json({
      c: 401,
      m: 'Unauthorized'
    })
  },
  ValidateShardSessionWebsocket: new server.basecamp.ws.Server({
    port: Config.bezerk.port
  })
}

server.app = server.basecamp.app()
server.http = server.basecamp.http.createServer(server.app)
server.io = server.basecamp.io.listen(server.http)

server.app.set('view engine', 'ejs')

server.app.customRender = (root, name, fn) => {

  var engines = app.engines
  var cache = app.cache

  view = cache[root + '-' + name]

  if (!view) {
    view = new(app.get('view'))(name, {
      defaultEngine: app.get('view engine'),
      root: root,
      engines: engines
    })

    if (!view.path) {
      var err = new Error('Failed to lookup view "' + name + '" in views directory "' + root + '"')
      err.view = view
      return fn(err)
    }

    cache[root + '-' + name] = view
  }

  try {
    view.render(opts, fn)
  } catch (err) {
    fn(err)
  }
}

process.title = 'MarshCore'

let shards = []
let receivers = []
let servers = []
let Webpages = {}
let mud = []

/*
 * MESSY CODE PLS IGNORE
 */

setInterval(() => {
  try {
    if (Config.carbonkey) {
      request({
        method: 'POST',
        url: 'https://www.carbonitex.net/discord/data/botdata.php?debug=true',
        body: JSON.stringify({
          key: Config.carbonkey,
          servercount: `${servers['total']}`
        })
      })
    }
  } catch (e) {
    console.log(e.stack)
  }
  try {
    if (Config.discordpwkey) {
      request({
        method: 'POST',
        url: `https://bots.discord.pw/api/bots/${Config.clientID}/stats`,
        headers: {
          Authorization: Config.discordpwkey
        },
        body: JSON.stringify({
          server_count: servers['total']
        })
      })
    }
  } catch (e) {
    console.log(e.stack)
  }
}, 60000)

server.basecamp.passport.serializeUser((user, done) => {
  done(null, user)
})

server.basecamp.passport.deserializeUser((obj, done) => {
  done(null, obj)
})

let scopes = ['identify', 'guilds', 'bot']

server.basecamp.passport.use(new server.basecamp.Strategy({
  clientID: Config.clientID,
  clientSecret: Config.clientSecret,
  callbackURL: Config.domain + Config.callbackURL,
  scope: scopes
}, function (accessToken, refreshToken, profile, done) {
  return done(null, profile)
}))

// noinspection JSUnresolvedFunction
server.app.use(server.basecamp.session({
  secret: 'lolMemes',
  resave: false,
  saveUninitialized: false
}))

server.app.use(server.basecamp.passport.initialize())
server.app.use(server.basecamp.passport.session())
server.app.use(server.basecamp.bodyParser.json())
server.app.use(server.basecamp.bodyParser.urlencoded({
  extended: true
}))
server.app.get('/auth/discord/', server.basecamp.passport.authenticate('discord', {
  scope: scopes
}))
server.app.get('/auth/discord/callback', server.basecamp.passport.authenticate('discord', {
  failureRedirect: '/auth/discord/fail'
}), (r, s) => {
  if (r.query.guild_id && r.query.permissions) {
    s.send('yay.')
  } else {
    s.json({
      c: 200,
      m: 'Discord Authenticated',
      s: r.query
    })
  }
})
server.app.delete('/auth/discord', (r, s) => {
  r.logout().then(() => {
    s.json({
      c: 200,
      m: 'Discord Authentication deleted for User'
    })
  })
})
server.app.get('/auth/discord/user', server.AuthorityCheck.Hawk, (r, s) => {
  s.json(r.user)
})
server.app.get('/auth/discord/fail', (r, s) => {
  s.json({
    c: 400,
    m: 'Discord Authentication Failed'
  })
})

server.app.get('/carbonitex', (r, s) => {
  s.sendFile(__dirname + '/site/carbonitex.html')
})

server.app.use('/m/req/img', server.basecamp.app.static('./req/img'))

server.app.use(function (r, s) {
  s.status(404)

  if (r.accepts('html')) {
    return s.send('<title>RDO: X.X</title> <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"> <style> body { text-align: center; padding: 150px; } h1 { font-size: 50px; } body { font: 20px Helvetica, sans-serif; color: #333; } article { display: block; text-align: left; width: 650px; margin: 0 auto; } a { color: #dc8100; text-decoration: none; } a:hover { color: #333; text-decoration: none; } </style> <article> <i class="material-icons">error_outline</i> <div> <p>Marshmallow is ending their run.</p> <p>Thank you, from the RDO Team.</p> </div> </article>')
  }

  if (r.accepts('json')) {
    return s.send({
      e: 'Not found'
    })
  }

  s.send('Not found')
})

server.io.on('connection', (socket) => {
  socket.on('shardReady', (d) => {
    if (!servers[d.shard]) servers[d.shard] = {}
    if (!servers['total']) servers['total'] = 0

    servers[d.shard].guilds = d.guilds
    servers['total'] = servers['total'] + servers[d.shard].guilds

    setTimeout(() => {
      info('Shard Started: ' + d.shard + ' With ' + servers[d.shard].guilds + ' Guilds. (Now ' + servers['total'] + ' Total)')
    }, 5000)
  })
  socket.on('getServerInfo', () => {
    socket.emit('serverInfo', servers)
  })
  socket.on('addServer', (d) => {
    servers['total']++
  })
  socket.on('queue', (b) => {
    server.io.emit('dbqueue', b)
  })
  socket.on('usage', (b) => {
    server.io.emit('dbqueue', b)
  })
  socket.on('notif', (b) => {
    server.io.emit('dbnotif', b)
  })
  socket.on('emit', (b) => {
    server.io.emit(b.emit, b.body)
  })
})

server.AuthorityCheck.ValidateShardSessionWebsocket.on('connection', (socket) => {
  Logger('New WebSocket.')
  socket.send(JSON.stringify({
    op: 'HELLO'
  }))
  socket.on('message', (msg) => processMSG(socket, msg))
})

// setInterval(() => {
//     Webpages = {}
//     reload()
// }, 20000)
//
// function reload() {
//     let mL = require('./req/rld_core')
//     mL.getAll('../cmd/stable', true).then((b) => {
//       mud = []
//         for (let key in b) {
//             if (b.hasOwnProperty(key)) {
//                 mud.push(b[key])
//             }
//         }
//         for (let i = 0; i < mud.length; i++) {
//             if (mud[i].meta) {
//                 for (let event in mud[i]) {
//                     if (mud[i].meta.event.toLowerCase() === 'cmd') {
//                         if (event.toLowerCase() !== 'meta') {
//                             if (mud[i][event].WebController) {
//                                 if (!mud[i][event].WebController.pages && !mud[i][event].WebController.RequestHandlers) {
//                                     return info(`Module ${mud[i].meta.name} (${mud[i].meta.version}) failed to start WebController due to no Pages or RequestHandlers present.`)
//                                 }
//                                 if (typeof mud[i][event].WebController.RequestHandlers !== 'function') {
//                                     return info(`Module ${mud[i].meta.name} (${mud[i].meta.version}) failed to start WebController due to RequestHandlers not being a function.`)
//                                 }
//                                 if (typeof mud[i][event].WebController.pages !== 'object') {
//                                     return info(`Module ${mud[i].meta.name} (${mud[i].meta.version}) failed to start WebController due to Pages not being an array.`)
//                                 }
//
//                                 if (mud[i][event].WebController.pages) {
//                                     let page = mud[i][event].WebController.pages
//                                     for (let i in page) {
//                                         if (!page[i].path && !mud[i][event].WebController.RequestHandlers) {
//                                             return info(`Module ${mud[i].meta.name} (${mud[i].meta.version}) failed to start WebController due to Page ${i} missing EJS path.`)
//                                         }
//
//                                         if (!Webpages[event]) Webpages[event] = {}
//                                         if (!Webpages[event].pages) Webpages[event].pages = []
//                                         Webpages[event].pages.push(
//                                             server.app.get(`/m/${mud[i].meta.name}/${page[i].name}`, (r, s) => {
//                                                 s.customRender(`${__dirname}/cmd/stable/${page[i].path}`)
//                                             })
//                                         )
//                                     }
//                                 }
//                             }
//                         }
//                     }
//                 }
//             }
//         }
//     })
// }

function processMSG(socket, message) {
  Logger('Attempting to process a message.')
  Logger(message)
  let msg
  try {
    msg = JSON.parse(message)
  } catch (e) {
    socket.close()
    Logger('Closing socket, invalid data received.')
  }
  if (!msg.op) {
    socket.close()
    Logger('Closing socket, no OP code received.')
    return
  }
  if (msg.op === 'IDENTIFY_SHARD') {
    Logger('A socket is trying to connect as a shard.')
    if (!msg.c) {
      socket.close()
      Logger('Closing socket, no sharding info received.')
    } else {
      if (!Array.isArray(msg.c)) {
        socket.close()
        Logger('Closing connection, invalid sharding info')
        return
      }
      Logger('Accepted shard.')
      socket.shardInfo = msg.c
      socket.type = 'shard'
      server.basecamp.shards.push(socket)
      socket.send(JSON.stringify({
        op: 'OK'
      }))
    }
  } else if (msg.op === 'IDENTIFY_LISTENER') {
    Logger('A socket is trying to connect as a listener')
    if (!msg.c) {
      socket.close()
      Logger('Closing socket, no subscriptions.')
      return
    }
    if (!Array.isArray(msg.c)) {
      socket.close()
      Logger('Closing socket, invalid subscriptions.')
    } else {
      Logger('Accepted listener')
      socket.subscriptions = msg.c
      socket.type = 'listener'
      receivers.push(socket)
      socket.send(JSON.stringify({
        op: 'OK'
      }))
    }
  } else {
    // This is where it's going to get fun.
    if (receivers.indexOf(socket) === -1 && server.basecamp.shards.indexOf(socket) === -1) {
      socket.close()
      Logger('Socket tried sending events without being identified first.')
      return
    }
    if (socket.type === 'listener' || msg.op === 'EVAL') {
      if (msg.shard) {
        Logger('Listener event defined a shard, trying to find it and send the message.')
        for (let shard of server.basecamp.shards) {
          if (shard.shardInfo[0] === msg.shard) {
            Logger('Shard found, sending payload.')
            shard.send(JSON.stringify(msg))
          }
        }
      } else {
        Logger('Listener event did not define a shard, falling back to sending to all shards.')
        for (let shard of server.basecamp.shards) {
          shard.send(JSON.stringify(msg))
        }
      }
    } else {
      if (!msg.op) {
        socket.close()
        Logger('Closing shard connection, no event passed.')
        return
      }
      if (!msg.c) {
        socket.close()
        Logger('Closing shard connection, no data.')
      } else {
        Logger('Request accepted, attempting to send data to subscribed listeners.')
        for (let listener of receivers) {
          if (listener.subscriptions.indexOf(msg.op) > -1 && listener.readyState === 1) {
            Logger('Sending data.')
            listener.send(JSON.stringify(msg))
          }
        }
      }
    }
  }
}

let restarts = 0
setTimeout(() => {
  start()
}, 10000)

function start() {
  restarts++

  for (let b = 0; b < argv.maxLoop; b++) {
    exec('pkill MarshChild')
  }

  if (restarts > 5) {
    info('Restarted too many times.')
    return process.exit()
  }

  for (let i = 0; i < argv.maxLoop; i++) {
    shards[i] = cp.fork(`${__dirname}/req/chk.js`, ["--shardid=" + i, "--max=" + argv.max, "--expose-gc"])
    shards[i].on('disconnect', () => {
      start()
    })
  }
}

server.http.listen('8888', (e) => {
  if (e) {
    throw new Error('Server failed to start. A port is possibly in use.\n\n' + e)
  }
})

process.on('uncaughtException', (e) => {
  info('Something happened to Core, ' + e.stack)
})
process.on('unhandledRejection', (reason, p) => {
  info(`Unhandled Rejection at:\nPromise ${p}\nreason: ${reason.stack}`)
})