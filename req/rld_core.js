let rqdir = require('./moduleLoader.js')

if (typeof global.yep === 'undefined') global.yep = false
if (global.yep) return

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