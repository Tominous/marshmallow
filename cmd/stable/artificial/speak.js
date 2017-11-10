exports.run = (c, suffix) => {
    let old_ai = require('../../core/old_ai/speech')

    old_ai.speak(suffix, {
        pitch: 0.5,
        speed: 150
    }).then(wav => {
        let base64Data = wav.replace(/^data:audio\/x-wav;base64,/, "")

        require("fs").writeFile("out.wav", base64Data, 'base64', function (err) {
            global.debug.error(err)
        })

        let current = c.message.member.getVoiceChannel()

        if (current) {
            current.join().then(vc => {
                let enc = vc.voiceConnection.createExternalEncoder({
                    type: 'ffmpeg',
                    source: 'out.wav',
                    format: 'pcm'
                })

                let i = 0
                let int = setInterval(() => {
                    i++
                }, 1)

                enc.play()
                enc.once('end', () => {
                    clearInterval(int)
                    if (i < 500) {
                        old_ai.speak("Error: Couldn't Generate WAV File. Try Again.", {
                            pitch: 0.5,
                            speed: 150
                        }).then(wav => {
                            let base64Data = wav.replace(/^data:audio\/x-wav;base64,/, "")

                            require("fs").writeFile("out.wav", base64Data, 'base64', function (err) {
                                global.debug.error(err)
                            })

                            let error = vc.voiceConnection.createExternalEncoder({
                                type: 'ffmpeg',
                                source: 'out.wav',
                                format: 'pcm'
                            })

                            error.play()
                            error.once('end', () => {
                                global.debug.cmd('Encoder Failed to Generate WAV.')
                                vc.voiceConnection.disconnect()
                            })
                        })
                    }
                    vc.voiceConnection.disconnect()
                    global.debug.cmd('Encoder Finished.')
                })
            })
        }
    })
}
