let speakWorker = require('./espeak')

exports.speak = (text, args) => {

   text = text.replace(new RegExp('fuck', 'gi'), 'bork').replace(new RegExp('shit', 'gi'), 'bark').replace(new RegExp('bitch', 'gi'), 'female dog')

    return new Promise((resolve, reject) => {

        if (text.length > 1000) {
            handleWav(speakWorker.generateSpeech("Error: Text Too Long.", args))
        } else {
            handleWav(speakWorker.generateSpeech(text, args))
        }

        function parseWav(wav) {
            function readInt(i, bytes) {
                let ret = 0
                let shft = 0
                while (bytes) {
                    ret += wav[i] << shft
                    shft += 8
                    i++
                    bytes--
                }
                return ret
            }

            if (readInt(20, 2) !== 1) reject('Invalid compression code, not PCM')
            if (readInt(22, 2) !== 1) reject('Invalid number of channels, not 1')
            return {
                sampleRate: readInt(24, 4),
                bitsPerSample: readInt(34, 2),
                samples: wav.subarray(44)
            }
        }

        function parseAudio(wav) {
            function encode64(data) {
                let BASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
                let PAD = '='
                let ret = ''
                let leftchar = 0
                let leftbits = 0
                for (let i = 0; i < data.length; i++) {
                    leftchar = (leftchar << 8) | data[i]
                    leftbits += 8
                    while (leftbits >= 6) {
                        let curr = (leftchar >> (leftbits - 6)) & 0x3f
                        leftbits -= 6
                        ret += BASE[curr]
                    }
                }
                if (leftbits === 2) {
                    ret += BASE[(leftchar & 3) << 4]
                    ret += PAD + PAD
                } else if (leftbits === 4) {
                    ret += BASE[(leftchar & 0xf) << 2]
                    ret += PAD
                }
                return ret
            }

            resolve(encode64(wav))
        }

        function handleWav(wav) {
            //noinspection JSUnusedLocalSymbols
            let data = parseWav(wav) //check
            parseAudio(wav)
        }
    })
}
