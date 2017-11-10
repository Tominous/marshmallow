let rqdir = require('./moduleLoader.js')
let chk = require('./chk')

if(typeof global.yep === 'undefined') global.yep = false
if(global.yep) return

exports.getAll = (directory, isCore) => {
    /** @namespace directory
     *  @type {object}
     */
    return new Promise((resolve, reject) => {
        try {
            resolve(rqdir(module, directory, null, isCore))
        } catch (e) {
            reject(e)
        }
    })
}

exports.reload = () => {
    global.reloadcount++
    exports.getAll('../cmd/stable').then((b) => {
        global.saveFunctions('stable', b)
        exports.getAll('../cmd/beta').then((c) => {
            global.saveFunctions('beta', c)
            if(!global.yep) {
                global.fullreloadcount++
                exports.getAll('../cmd/core', true).then((a) => {
                    global.saveFunctions('core', a)
                    chk.startListen()
                    global.yep = true
                })
              }

              setTimeout(() => {
                  exports.reload()
              }, 30000)
          })
      })
}
