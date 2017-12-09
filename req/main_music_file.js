/*
  Copyright TheSharks 2017
  https://github.com/TheSharks

  (Some parts modified)
*/

let list = {}
let status = {}
let requestLink = {}
let splitLink = {}
let temp
let DL = require('ytdl-core')
let YT = require('youtube-dl')
let fs = require('fs')
let debug = global.debug.voice
let debugE = global.debug.error

exports.registerVanity = function (msg) {
	list[msg.guild.id] = {
		vanity: true
	}
}

exports.unregisterVanity = function (msg) {
	list[msg.guild.id] = {
		vanity: false
	}
}

exports.join = function (msg, suffix, bot) {
	if (global.config.language.music.disabled.startsWith('!! ')) return msg.channel.sendMessage(global.config.language.music.disabled.replace('!! ', ''))
	let isReserved = false
	require('./db').check('music', {
		main: msg.guild.id
	}).then(thing => {
		if (thing.value) {
			isReserved = true
		}
	})
	if (bot.VoiceConnections.length > 5 && !isReserved) {
		msg.channel.sendMessage('', false, {
			author: {
				icon_url: bot.User.avatarURL,
				name: `${bot.User.username}#${bot.User.discriminator} (${bot.User.id})`
			},
			title: 'Whoop',
			timestamp: new Date(),
			fields: [],
			description: 'Seems like my slots are full. Try again in a little bit!'
		})
	} else {
		list[msg.guild.id] = {
			vanity: false
		}
		let voiceCheck = bot.VoiceConnections.find((r) => r.voiceConnection.guild.id === msg.guild.id)
		if (!voiceCheck && !suffix) {
			let VC = msg.member.getVoiceChannel()
			if (VC) {
				VC.join().then((vc) => {
					let prefix = global.config.prefix
					require('./db').check('prefix', {
						main: msg.guild.id
					}).then((r) => {
						require('./db').check('music', {
							main: msg.guild.id
						}).then(thing => {
							if (!thing.value) {
								require('./db').set('music', {
									main: msg.guild.id,
									other: true
								})
							} else {
								msg.channel.sendMessage(':warning: You had an instance last time, sorry for the unexpected leave.')
							}
						})
						if (r !== false) prefix = r.value || global.config.prefix
						let joinmsg = []
						joinmsg.push({
							name: 'Hello!',
							value: `I joined ${vc.voiceConnection.channel.name}`
						})
						joinmsg.push({
							name: `${prefix}request`,
							value: `Search or Give a URL and add it to playlist.`,
							inline: true
						})
						joinmsg.push({
							name: `${prefix}music play/pause`,
							value: `Plays or Pauses Playback.`,
							inline: true
						})
						joinmsg.push({
							name: `${prefix}vol 0 - 100`,
							value: `Sets (in percentage) the volume of Playback.`,
							inline: true
						})
						joinmsg.push({
							name: `${prefix}playlist`,
							value: `See what's playing.`,
							inline: true
						})
						joinmsg.push({
							name: `${prefix}shuffle`,
							value: `Randomly move every song in the playlist.`,
							inline: true
						})
						joinmsg.push({
							name: `${prefix}voteskip`,
							value: `Starts a vote to skip the song`,
							inline: true
						})
						joinmsg.push({
							name: `${prefix}skip`,
							value: `Forces to skip the song.`,
							inline: true
						})
						joinmsg.push({
							name: `${prefix}leave`,
							value: `Deletes playlist, stops playback, and leaves.`,
							inline: true
						})

						msg.channel.sendMessage('', false, {
							author: {
								icon_url: bot.User.avatarURL,
								name: `${bot.User.username}#${bot.User.discriminator} (${bot.User.id})`
							},
							title: 'Joined Voice',
							timestamp: new Date(),
							fields: joinmsg,
							description: 'I work best when the server has their region set to `Sydney`!'
						})
						status[msg.guild.id] = true
						waiting(vc, msg, bot)
					})
				}).catch((err) => {
					if (err.message === 'Missing permission') {
						msg.reply(":x: Failed to join that Voice Channel. [`Attack: Missing permission`]")
					}
				})
			} else if (!VC) {
				msg.guild.voiceChannels[0].join().then((vc) => {
					let prefix = global.config.prefix
					require('./db').check('prefix', {
						main: msg.guild.id
					}).then((r) => {
						require('./db').check('music', {
							main: msg.guild.id
						}).then(thing => {
							if (!thing.value) {
								require('./db').set('music', {
									main: msg.guild.id,
									other: true
								})
							} else {
								msg.channel.sendMessage(':warning: You had an instance last time, sorry for the unexpected leave.')
							}
						})
						if (r !== false) prefix = r.value || global.config.prefix
						let joinmsg = []
						joinmsg.push({
							name: 'Hello!',
							value: `I joined ${vc.voiceConnection.channel.name}`
						})
						joinmsg.push({
							name: `${prefix}request`,
							value: `Search or Give a URL and add it to playlist.`,
							inline: true
						})
						joinmsg.push({
							name: `${prefix}music play/pause`,
							value: `Plays or Pauses Playback.`,
							inline: true
						})
						joinmsg.push({
							name: `${prefix}vol 0 - 100`,
							value: `Sets (in percentage) the volume of Playback.`,
							inline: true
						})
						joinmsg.push({
							name: `${prefix}playlist`,
							value: `See what's playing.`,
							inline: true
						})
						joinmsg.push({
							name: `${prefix}shuffle`,
							value: `Randomly move every song in the playlist.`,
							inline: true
						})
						joinmsg.push({
							name: `${prefix}voteskip`,
							value: `Starts a vote to skip the song`,
							inline: true
						})
						joinmsg.push({
							name: `${prefix}skip`,
							value: `Forces to skip the song.`,
							inline: true
						})
						joinmsg.push({
							name: `${prefix}leave`,
							value: `Deletes playlist, stops playback, and leaves.`,
							inline: true
						})

						msg.channel.sendMessage('', false, {
							author: {
								icon_url: bot.User.avatarURL,
								name: `${bot.User.username}#${bot.User.discriminator} (${bot.User.id})`
							},
							title: 'Joined Voice',
							timestamp: new Date(),
							fields: joinmsg,
							description: 'I work best when the server has their region set to `Sydney`!'
						})
						status[msg.guild.id] = true
						waiting(vc, msg, bot)
					})
				}).catch((err) => {
					if (err.message === 'Missing permission') {
						msg.reply(":x: Failed to join that Voice Channel. [`Attack: Missing permission`]")
					}
				})
			}
		} else if (!voiceCheck) {
			let channel = msg.channel.guild.voiceChannels.find((a) => {
				//noinspection JSUnresolvedVariable
				return a.name.toLowerCase().indexOf(suffix.toLowerCase()) >= 0
			})
			if (channel === undefined) {
				msg.reply('That is not a valid voice channel.')
			} else {
				channel.join().then((vc) => {
					let prefix = global.config.prefix
					require('./db').check('prefix', {
						main: msg.guild.id
					}).then((r) => {
						require('./db').check('music', {
							main: msg.guild.id
						}).then(thing => {
							if (!thing.value) {
								require('./db').set('music', {
									main: msg.guild.id,
									other: true
								})
							} else {
								msg.channel.sendMessage(':warning: You had an instance last time, sorry for the unexpected leave.')
							}
						})
						if (r !== false) prefix = r.value || global.config.prefix
						let joinmsg = []
						joinmsg.push({
							name: 'Hello!',
							value: `I joined ${vc.voiceConnection.channel.name}`
						})
						joinmsg.push({
							name: `${prefix}request`,
							value: `Search or Give a URL and add it to playlist.`,
							inline: true
						})
						joinmsg.push({
							name: `${prefix}music play/pause`,
							value: `Plays or Pauses Playback.`,
							inline: true
						})
						joinmsg.push({
							name: `${prefix}vol 0 - 100`,
							value: `Sets (in percentage) the volume of Playback.`,
							inline: true
						})
						joinmsg.push({
							name: `${prefix}playlist`,
							value: `See what's playing.`,
							inline: true
						})
						joinmsg.push({
							name: `${prefix}shuffle`,
							value: `Randomly move every song in the playlist.`,
							inline: true
						})
						joinmsg.push({
							name: `${prefix}voteskip`,
							value: `Starts a vote to skip the song`,
							inline: true
						})
						joinmsg.push({
							name: `${prefix}skip`,
							value: `Forces to skip the song.`,
							inline: true
						})
						joinmsg.push({
							name: `${prefix}leave`,
							value: `Deletes playlist, stops playback, and leaves.`,
							inline: true
						})

						msg.channel.sendMessage('', false, {
							author: {
								icon_url: bot.User.avatarURL,
								name: `${bot.User.username}#${bot.User.discriminator} (${bot.User.id})`
							},
							title: 'Joined Voice',
							timestamp: new Date(),
							fields: joinmsg,
							description: 'I work best when the server has their region set to `Sydney`!'
						})
						status[msg.guild.id] = true
						waiting(vc, msg, bot)
					})
				}).catch((err) => {
					if (err.message === 'Missing permission') {
						msg.reply(":x: Failed to join that Voice Channel. [`Attack: Missing permission`]")
					}
				})
			}
		} else {
			msg.reply(':x: Already streaming [`Shelf: ' + voiceCheck.voiceConnection.channel.name + '`]')
		}
	}
}

function leave(bot, msg) {
	if (status[msg.guild.id] === true) {
		msg.channel.sendMessage(':hourglass: Times up!')
		let voice = bot.VoiceConnections.find((r) => r.voiceConnection.guild.id === msg.guild.id)
		if (voice) {
			voice.voiceConnection.getEncoder().kill()
			voice.voiceConnection.disconnect()
			delete list[msg.guild.id]

			require('./db').set('music', {
				main: msg.guild.id,
				other: null
			})
		}
	}
}

exports.leave = function (msg, suffix, bot) {
	status[msg.guild.id] = false
	let voice = bot.VoiceConnections.find((r) => r.voiceConnection.guild.id === msg.guild.id)
	if (voice) {
		voice.voiceConnection.getEncoder().kill()
		voice.voiceConnection.disconnect()
		delete list[msg.guild.id]

		require('./db').set('music', {
			main: msg.guild.id,
			other: null
		})
		msg.channel.sendMessage(':wave:')
	}
}

function waiting(vc, msg, bot) {
	//require('./db').check('defaultVolume', {
	//    main: msg.guild.id
	//}).then((v) => {
	let music = fs.readdirSync(__dirname + '/list')
	let randMusic = __dirname + '/list/' + music[Math.floor(Math.random() * music.length)]
	let waitMusic = vc.voiceConnection.createExternalEncoder({
		type: 'ffmpeg',
		source: randMusic,
		format: 'pcm'
	})
	waitMusic.play()
	bot.VoiceConnections.find(v => v.voiceConnection.guild.id === msg.guild.id).voiceConnection.getEncoder().setVolume(100)
	waitMusic.once('end', () => {
		if (status[vc.voiceConnection.guildId] === true) {
			leave(bot, msg)
		}
	})
	//})
}

function next(msg, suffix, bot) {
	status[msg.guild.id] = false
	bot.VoiceConnections
		.map((connection) => {
			if (connection.voiceConnection.guild.id === msg.guild.id) {
				if (list[msg.guild.id].link.length === 0) {
					delete list[msg.guild.id]
					msg.channel.sendMessage(':white_check_mark: Playlist Completed.')
					connection.voiceConnection.disconnect()
					return
				}
				if (list[msg.guild.id].link[0] === 'INVALID' || !list[msg.guild.id].link[0]) { // Hopeful fix to cannot read property '0' of undefined
					list[msg.guild.id].link.shift()
					list[msg.guild.id].info.shift()
					list[msg.guild.id].requester.shift()
					list[msg.guild.id].skips.count = 0
					list[msg.guild.id].skips.users = []
				}
				let encoder = connection.voiceConnection.createExternalEncoder({
					type: 'ffmpeg',
					format: 'pcm',
					source: list[msg.guild.id].link[0]
				})
				encoder.play()
				if (list[msg.guild.id].volume !== undefined) {
					connection.voiceConnection.getEncoder().setVolume(list[msg.guild.id].volume)
				} else {
					//require('./db').check('defaultVolume', {
					//    main: msg.guild.id
					//}).then((v) => {
					connection.voiceConnection.getEncoder().setVolume(100)
					//})
				}
				encoder.once('end', () => {
					if (!list[msg.guild.id].info) {
						msg.channel.sendMessage(":x: Something might of happened, and I might be wrong. The playlist has ended/failed to play.")
						connection.voiceConnection.disconnect()

						// We need to force delete list, so we dont have some useless shit in memory.
						delete list[msg.guild.id]
						return
					}
					msg.channel.sendMessage('**' + list[msg.guild.id].info[0] + '** has ended!')
					list[msg.guild.id].link.shift()
					list[msg.guild.id].info.shift()
					list[msg.guild.id].requester.shift()
					list[msg.guild.id].skips.count = 0
					list[msg.guild.id].skips.users = []
					if (list[msg.guild.id].link.length > 0) {
						msg.channel.sendMessage('Next up is **' + list[msg.guild.id].info[0] + '** requested by _' + list[msg.guild.id].requester[0] + '_')
						next(msg, suffix, bot)
					} else {
						msg.channel.sendMessage(':white_check_mark: Playlist Completed.')
						connection.voiceConnection.disconnect()
					}
				})
			}
		})
}

exports.shuffle = function (msg, bot) {
	let connect = bot.VoiceConnections
		.filter(function (connection) {
			return connection.voiceConnection.guild.id === msg.guild.id
		})
	if (connect.length < 1) {
		msg.reply(':x: Not in voice.')
	} else if (list[msg.guild.id].link === undefined) {
		msg.reply(":x: Nothing to shuffle.")
	} else if (list[msg.guild.id].link !== undefined && list[msg.guild.id].link.length <= 4) {
		msg.reply(':x: Not enough songs to shuffle.')
	} else {
		let currentIndex = list[msg.guild.id].link.length
		let temporaryValue
		let randomIndex
		while (currentIndex !== 0) {
			randomIndex = Math.floor(Math.random() * currentIndex)
			currentIndex -= 1
			if (currentIndex !== 0 && randomIndex !== 0) {
				temporaryValue = list[msg.guild.id].link[currentIndex]
				list[msg.guild.id].link[currentIndex] = list[msg.guild.id].link[randomIndex]
				list[msg.guild.id].link[randomIndex] = temporaryValue
				temporaryValue = list[msg.guild.id].info[currentIndex]
				list[msg.guild.id].info[currentIndex] = list[msg.guild.id].info[randomIndex]
				list[msg.guild.id].info[randomIndex] = temporaryValue
				temporaryValue = list[msg.guild.id].requester[currentIndex]
				list[msg.guild.id].requester[currentIndex] = list[msg.guild.id].requester[randomIndex]
				list[msg.guild.id].requester[randomIndex] = temporaryValue
			}
		}
		msg.reply(':white_check_mark: Shuffled.')
	}
}

exports.voteSkip = function (msg, bot) {
	let connect = bot.VoiceConnections
		.filter(function (connection) {
			return connection.voiceConnection.guild.id === msg.guild.id
		})
	if (connect.length < 1) {
		msg.reply(':x: Error: [`No Connection`]')
	} else if (list[msg.guild.id].link === undefined) {
		msg.reply(':x: Empty Playlist')
	} else if (!msg.member.getVoiceChannel() || (msg.member.getVoiceChannel().id !== connect[0].voiceConnection.channel.id)) {
		msg.reply(":x: Not in Voice [`Rack: User`]")
	} else {
		let count = Math.round((connect[0].voiceConnection.channel.members.length - 2) / 2)
		if (list[msg.guild.id].skips.users.indexOf(msg.author.id) > -1) {
			msg.reply(':x: Already Voted.')
		} else {
			list[msg.guild.id].skips.users.push(msg.author.id)
			list[msg.guild.id].skips.count++
				if (list[msg.guild.id].skips.count >= count) {
					msg.channel.sendMessage(':white_check_mark: Brace yourself, the Next Song is about to play!')
					exports.skip(msg, null, bot)
				} else {
					msg.reply(`:white_check_mark: Registered, [\`Needed: ${count - list[msg.guild.id].skips.count}\`]`)
				}
		}
	}
}

exports.volume = function (msg, suffix, bot) {
	return new Promise((resolve, reject) => {
		let connect = bot.VoiceConnections.find(v => v.voiceConnection.guild.id === msg.guild.id)
		if (connect) {
			if (suffix.length === 0) {
				if (list[msg.guild.id].volume === undefined) {
					require('./db').check('defaultVolume', {
						main: msg.guild.id
					}).then((v) => {
						resolve(`:speaker: Default: **${v.value}**.`)
					})
				} else {
					resolve(`:speaker: Current: ${list[msg.guild.id].volume}.`)
				}
			} else if (!isNaN(suffix) && suffix <= 100 && suffix > 0) {
				list[msg.guild.id].volume = suffix
				connect.voiceConnection.getEncoder().setVolume(suffix)
				resolve(`:speaker::white_check_mark: Set to ${suffix}.`)
			} else {
				reject(':x: Invalid Range. [`Attack: Suffix Range Not 0 - 100`]')
			}
		}
	})
}

exports.skip = function (msg, suffix, bot) {
	let connect = bot.VoiceConnections
		.filter(function (connection) {
			return connection.voiceConnection.guild.id === msg.guild.id
		})
	if (connect.length < 1) {
		msg.reply(':x: No Connection')
		return
	} else if (list[msg.guild.id].link === undefined) {
		msg.reply(':x: Empty Playlist')
		return
	}
	list[msg.guild.id].link.shift()
	list[msg.guild.id].info.shift()
	list[msg.guild.id].requester.shift()
	list[msg.guild.id].skips.count = 0
	list[msg.guild.id].skips.users = []
	next(msg, suffix, bot)
}

exports.music = function (msg, suffix, bot) {
	bot.VoiceConnections
		.map((connection) => {
			if (connection.voiceConnection.guild.id === msg.guild.id) {
				if (suffix.toLowerCase() === 'pause') {
					//noinspection JSUnresolvedFunction
					connection.voiceConnection.getEncoderStream().cork()
					msg.channel.sendMessage(":hourglass: The wait is on. Better unpause later, or I'll leave!")
				} else if (suffix.toLowerCase() === 'play') {
					//noinspection JSUnresolvedFunction
					connection.voiceConnection.getEncoderStream().uncork()
					msg.channel.sendMessage(":speaker: Resumed")
				} else {
					msg.channel.sendMessage(':x: Invalid Suffix. [`Attack: Not \'play\' OR \'pause\'`]')
				}
			}
		})
}

exports.fetchList = function (msg) {
	return new Promise(function (resolve, reject) {
		try {
			resolve(list[msg.guild.id])
		} catch (e) {
			reject(e)
		}
	})
}

exports.deleteFromPlaylist = function (msg, what) {
	return new Promise(function (resolve, reject) {
		if (list[msg.guild.id].info === undefined) {
			reject(':x: Empty Playlist')
		} else if (what === 'all') {
			try {
				list[msg.guild.id].info.splice(1)
				list[msg.guild.id].link.splice(1)
				list[msg.guild.id].requester.splice(1)
				list[msg.guild.id].skips.count = 0
				list[msg.guild.id].skips.users = []
				resolve(':white_check_mark: Cleared')
			} catch (e) {
				reject(e)
			}
		} else if (what > 0 && list[msg.guild.id].info[what] !== undefined) {
			resolve(list[msg.guild.id].info[what])
			list[msg.guild.id].info.splice(what, 1)
			list[msg.guild.id].requester.splice(what, 1)
			list[msg.guild.id].link.splice(what, 1)
		} else {
			reject(':x: Invalid ID [`Attack: Unmatched ID`]')
		}
	})
}

exports.request = function (msg, suffix, bot) {
	let connect = bot.VoiceConnections
		.filter(function (connection) {
			return connection.voiceConnection.guild.id === msg.guild.id
		})
	if (connect.length < 1) {
		msg.channel.sendMessage(":x: No Connection")
	} else if (list[msg.guild.id].vanity) {
		msg.reply(`:x: Vanity Disallowance. [\`Attack: Used Vanity.\`]`)
	} else {
		let link = require('url').parse(suffix)
		let query = require('querystring').parse(link.query)
		msg.channel.sendTyping()
		if (suffix.includes('list=') !== suffix.includes('playlist?')) {
			requestLink[msg.guild.id] = suffix
			if (suffix.includes('youtu.be')) { // If the link is shortened with youtu.be
				splitLink[msg.guild.id] = requestLink[msg.guild.id].split('?list=') // Check for this instead of &list
				msg.channel.sendMessage(`Try that again with either a link to the video or the playlist.
**Video:** <${splitLink[msg.guild.id][0]}>
**Playlist:** <https://www.youtube.com/playlist?list=${splitLink[msg.guild.id][1]}>`)
			} else {
				splitLink[msg.guild.id] = requestLink[msg.guild.id].split('&list=')
				msg.channel.sendMessage(`Try that again with either a link to the video or the playlist.
**Video:** <${splitLink[msg.guild.id][0]}>
**Playlist:** <https://www.youtube.com/playlist?list=${splitLink[msg.guild.id][1]}>`)
			}
		} else if (query.list && query.list.length > 8 && link.host.indexOf('youtu') > -1) {
			msg.channel.sendMessage('Playlist fetching might take a while...')
			let api = require('youtube-api')
			/** @namespace api.authenticate */
			/** @namespace api.playlistItems */
			api.authenticate({
				type: 'key',
				key: global.config.google
			})
			api.playlistItems.list({
				part: 'snippet',
				pageToken: [],
				maxResults: 50,
				playlistId: query.list
			}, function (err, data) {
				if (err) {
					msg.channel.sendMessage(':x: Unknown Error. [`Rack: User`]')
					debugE('Playlist failure, ' + err)
				} else if (data) {
					temp = data.items
					safeLoop(msg, suffix, bot)
				}
			})
		} else {
			fetch(suffix, msg).then((r) => {
				msg.channel.sendMessage(`:white_check_mark: Added ${r.title}`)
				if (status[msg.guild.id]) {
					next(msg, suffix, bot)
				}
			}).catch((e) => {
				debugE(e)
				msg.channel.sendMessage(":x: Unknown Error. [`Rack: User`]")
			})
		}
	}
}

exports.leaveRequired = function (bot, guild) {
	let connect = bot.VoiceConnections
		.find(function (connection) {
			//noinspection BadExpressionStatementJS
			connection.voiceConnection.guild.id === guild
		})
	if (connect) {
		if (connect.voiceConnection.channel.members.length <= 1) {
			delete list[guild.id]
			connect.voiceConnection.disconnect()
		}
	}
}

function fetch(v, msg, stats) {
	return new Promise(function (resolve, reject) {
		let x = 0
		let y = 1
		if (stats) {
			x = stats
		}
		let options
		if (v.indexOf('youtu') > -1) {
			options = ['--skip-download', '-f bestaudio/worstvideo', '--add-header', 'Authorization:' + global.config.google]
		} else {
			options = ['--skip-download', '-f bestaudio/worstvideo']
		}
		YT.getInfo(v, options, function (err, i) {
			if (!err && i) {
				y++
				if (!msg.guild) {
					return reject({
						error: ":x: Guild Unavailable. [`Rack: Discord`]"
					})
				}
				if (list[msg.guild.id] === undefined) {
					return reject({
						error: ':x: Not Connection',
						done: true
					})
				} else if (list[msg.guild.id].link === undefined || list[msg.guild.id].link.length < 1) {
					list[msg.guild.id] = {
						link: [i.url],
						vanity: false,
						info: [i.title],
						volume: undefined,
						requester: [msg.author.username],
						skips: {
							count: 0,
							users: []
						}
					}
					if (y > x) {
						return resolve({
							title: i.title,
							autoplay: true,
							done: true
						})
					} else {
						return resolve({
							title: i.title,
							autoplay: true
						})
					}
				} else {
					list[msg.guild.id].link.push(i.url)
					list[msg.guild.id].info.push(i.title)
					list[msg.guild.id].requester.push(msg.author.username)
					if (y > x) {
						return resolve({
							title: i.title,
							autoplay: false,
							done: true
						})
					} else {
						return resolve({
							title: i.title,
							autoplay: false
						})
					}
				}
			} else if (err) {
				y++
				if (y > x) {
					return reject({
						error: err,
						done: true
					})
				} else {
					return reject({
						error: err
					})
				}
			}
		})
	})
}

function safeLoop(msg, suffix, bot) {
	if (temp.length === 0) {
		msg.channel.sendMessage(':white_check_mark: Fetched.')
	} else {
		DLFetch(temp[0], msg, suffix, bot).then((f) => {
			if (f) {
				msg.channel.sendMessage(`:hourglass: Welcome to Voice. Now Playing: ${list[msg.guild.id].info[0]}`)
				next(msg, suffix, bot)
			}
			temp.shift()
			safeLoop(msg, suffix, bot)
		}, () => {
			temp.shift()
			safeLoop(msg, suffix, bot)
		})
	}
}

function DLFetch(video, msg) {
	return new Promise(function (resolve, reject) {
		let first = false
		/**
		 * Video Snippet Info
		 *
		 * @namespace video
		 * @param {object} video.snippet.resourceId - Resource ID Info
		 * @param {string} video.snippet.resourceId.videoId - Video ID.
		 * */
		DL.getInfo('https://youtube.com/watch?v=' + video.snippet.resourceId.videoId, {
			quality: 140,
			filter: 'audio'
		}, (err, i) => {
			if (!err && i) {
				if (list[msg.guild.id] === undefined) {
					temp = null
					return reject(first)
				} else if (list[msg.guild.id].link === undefined || list[msg.guild.id].link.length < 1) {
					list[msg.guild.id] = {
						vanity: false,
						link: [],
						info: [],
						volume: undefined,
						requester: [],
						skips: {
							count: 0,
							users: []
						}
					}
					first = true
				}
				list[msg.guild.id].link.push(i.formats[0].url)
				list[msg.guild.id].info.push(i.title)
				list[msg.guild.id].requester.push(msg.author.username)
				return resolve(first)
			} else {

				debug('Playlist debug, ' + err)
				return reject(first)
			}
		})
	})
}