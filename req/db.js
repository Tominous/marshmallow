let JsonDB = require('levelup')
let perm = {}

let server = require('../server')

let mem = require('pidusage')

let debugE = global.debug.error
let debug = global.debug.db

let mb
let cpu
let query = 0
let querypersec = 0

let masters = global.config.masters

setInterval(() => {
  mem.stat(process.pid, (e, s) => {
    mb = s ? s.memory : '0'
    cpu = s ? s.cpu : '0'
  })
}, 500)

QPS()

exports.check = (variable, body, c, core) => {
  /**
   * Check if Body.Main exists in Database.(Variable)
   *
   * @param {string} variable - Module Variable Name
   * @param {object} body - Database Identifier (body.main)
   */
  return new Promise((resolve, reject) => {
    query++
    querypersec++
    let json = {}
    if (!perm[variable]) {
      if (core) {
        perm[variable] = new JsonDB('./database/core/' + variable)
      } else {
        perm[variable] = new JsonDB('./database/' + (global.argv.shardid ? global.argv.shardid : 0) + '/' + variable)
      }
    }
    let serverowner
    if (c) {
      serverowner = (c.message.guild.owner.id === c.message.author.id)
    } else {
      serverowner = null
    }
    perm[variable].get(`${variable}: ${body.main}`, function (err, value) {
      if (c) {
        if (masters.indexOf(c.message.author.id) > -1) {
          json = {
            value: value,
            master: true
          }
          server.queue({
            action: 'check',
            value: value,
            id: Math.round(Math.random() * 4852),
            message: 'Master user ran command.',
            queue: 1,
            mb: mb,
            msgs: global.bot.Messages.length,
            cmds: global.totalCommands,
            query: query,
            qps: querypersec
          })
          resolve(json)
        }
      }
      if (serverowner) {
        json = {
          value: value,
          owner: true
        }
        resolve(json)
      } else {
        if (err && !serverowner) {
          if (err.notFound) {
            json = {
              value: value,
              notFound: true
            }
            server.queue({
              action: 'check',
              value: value,
              id: Math.round(Math.random() * 4852),
              message: 'Variable (Or Requirement) Doesn\'t exist, returning ' + JSON.stringify(json),
              queue: 1,
              mb: mb,
              msgs: global.bot.Messages.length,
              cmds: global.totalCommands,
              query: query,
              qps: querypersec
            })
            resolve(json)
          } else {
            debugE(`Ruh Roh! Here's a Database Error for you; ${err}`)
            json = {
              value: value
            }
            server.queue({
              error: err,
              action: 'check',
              id: Math.round(Math.random() * 4852),
              message: 'Database failed to grab ' + variable + '. Returning `' + JSON.stringify(json),
              queue: 1,
              mb: mb,
              msgs: global.bot.Messages.length,
              cmds: global.totalCommands,
              query: query,
              qps: querypersec
            })
            reject(json)
          }
        }
        if (value) {
          server.queue({
            action: 'check',
            value: value,
            id: Math.round(Math.random() * 4852),
            message: 'Database returned `' + value + '` as value, returning it as ' + variable,
            queue: 1,
            mb: mb,
            msgs: global.bot.Messages.length,
            cmds: global.totalCommands,
            query: query,
            qps: querypersec
          })
          json = {
            value: value
          }
          resolve(json)
        }
      }
    })
  })
}

exports.set = (variable, body, core) => {
  /**
   * Set Body.Main as Variable.
   *
   * @param {string} variable - Module Variable Name
   * @param {object} body - {body: 'thingToSet', other: 'thingInner'}
   */
  let debugE = global.debug.error
  return new Promise((resolve, reject) => {
    query++
    querypersec++
    let json = {}
    if (!perm[variable]) {
      if (core) {
        perm[variable] = new JsonDB('./database/core/' + variable)
      } else {
        perm[variable] = new JsonDB('./database/' + (global.argv.shardid ? global.argv.shardid : 0) + '/' + variable)
      }
    }
    if (!body.other) {
      perm[variable].del(variable, function () {
        server.queue({
          action: 'del',
          value: null,
          id: Math.round(Math.random() * 4852),
          message: 'Database deleted `' + body.other,
          queue: 1,
          mb: mb,
          msgs: global.bot.Messages.length,
          cmds: global.totalCommands,
          query: query,
          qps: querypersec
        })
        return resolve({
          deleted: true
        })
      })
    }
    perm[variable].put(`${variable}: ${body.main}`, body.other, function (err) {
      if (err) {
        debugE(`Ruh Roh! Here's a Database Error for you; ${err}`)
        json = {
          value: body.other
        }
        server.queue({
          action: 'set',
          error: err,
          id: Math.round(Math.random() * 4852),
          message: 'Database failed to set `' + body.other + '` as `' + variable + '`, returning ' + JSON.stringify(json),
          queue: 1,
          mb: mb,
          msgs: global.bot.Messages.length,
          cmds: global.totalCommands,
          query: query,
          qps: querypersec
        })
        reject(json)
      } else {
        json = {
          value: body.other
        }
        server.queue({
          action: 'set',
          value: body.other,
          id: Math.round(Math.random() * 4852),
          message: 'Database set `' + body.other + '` as `' + variable + '`, returning ' + JSON.stringify(json),
          queue: 1,
          mb: mb,
          msgs: global.bot.Messages.length,
          cmds: global.totalCommands,
          query: query,
          qps: querypersec
        })
        return resolve(json)
      }
    })
  })
}

let sendNotification = false

function QPS() {
  setTimeout(() => {
    server.usage({
      qps: querypersec,
      mb: mb,
      cpu: cpu
    })
    if (querypersec >= 50) {
      if (!sendNotification) {
        debug('DB Abuse')
        server.notify({
          title: 'Over safe Query Per Second limit.',
          body: 'Something is using the Database incorrectly.',
          id: 1000
        })
        sendNotification = true
      }
    } else {
      if (sendNotification) {
        sendNotification = false
        server.notify({
          remove: true,
          id: 1000
        })
      }
    }
    querypersec = 0
    QPS()
  }, 1000)
}