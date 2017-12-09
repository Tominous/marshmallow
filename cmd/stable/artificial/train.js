// HOPE YOU GOT A FAST AS FUCK COMPUTER FOR THIS.

let letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g',
  'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
  'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
]
let oneletter = ["a", "i", "k", "u", "y"]
let twoletters = ["ai", "am", "an", "as", "at",
  "be", "by", "dj", "do", "eh", "eq",
  "ew", "gj", "go", "ha", "he", "hi", "if", "in", "is", "it", "jk",
  "me", "my", "no", "of", "oh", "ok", "on", "or", "so",
  "to", "ty", "up", "us", "we", "ya"
]
let threeletters = [
  "aah", "act", "add", "age", "all", "and", "any", "are", "ask",
  "bad", "big", "bit", "biz", "box", "but", "buy",
  "can", "cdj", "cry", "cut",
  "day", "dev", "dry",
  "eat", "end", "eye",
  "faq", "fat", "few", "fit", "fix", "fly", "for",
  "gap", "get", "god",
  "her", "him", "his", "how",
  "ifs", "its",
  "job", "joy",
  "key", "kit",
  "law", "lie", "lol",
  "man", "map", "max", "mix", "may",
  "net", "new", "nil", "not", "now",
  "off", "one", "out", "own",
  "pad", "pen", "pin",
  "qua",
  "rig",
  "say", "see", "she", "sky",
  "the", "tie", "too", "top", "try", "two",
  "ups", "use",
  "vet", "vox",
  "was", "way", "web", "who", "why", "win",
  "xtc", "xxx",
  "yes", "yet", "you",
  "zen"
]
let fourletters = [
  "away",
  "base", "back", "bare", "best", "bite", "both", "burn",
  "call", "care", "case", "coin", "cool", "cost",
  "down", "draw", "drop", "dust",
  "each", "earn", "else", "even", "ever", "exec",
  "face", "fail", "fear", "feel", "fill", "first",
  "fold", "form", "from", "fund",
  "game", "gift", "give", "good", "grow",
  "hand", "hate", "have", "help", "hold", "hope", "hurt",
  "idle",
  "join", "jump", "just",
  "keep", "kill", "know",
  "land", "last", "lead", "like", "list",
  "lock", "lose", "love",
  "make", "many", "mark", "mean", "meet", "mind",
  "miss", "more", "most", "move",
  "name", "near", "need",
  "only", "open", "over",
  "pair", "part", "pass", "pull", "push",
  "quit",
  "read", "rest", "ride", "rule", "rush",
  "said", "save", "shop", "show", "slow",
  "some", "stay", "step", "stop", "such",
  "take", "talk", "tell", "test", "than",
  "that", "then", "they", "this",
  "tool", "true", "turn", "type",
  "undo",
  "very", "view",
  "wait", "walk", "want", "were", "what", "when", "will", "with", "wire",
  "word", "work",
  "xing",
  "yall",
  "zero"
]
let fiveletters = [
  "about", "above", "after", "again", "along", "angle",
  "block", "board", "break", "build",
  "carry", "catch", "chase", "class", "clean", "clear", "climb", "close",
  "count", "cover", "crash", "cross",
  "dance", "dirty", "dream", "drive",
  "empty", "equal", "exact",
  "fault", "fever", "fight", "floor", "force", "front",
  "group",
  "hurry",
  "issue",
  "judge",
  "known",
  "leave", "light", "lower",
  "model",
  "never",
  "offer", "order", "other",
  "paper", "party", "people", "piece", "place", "plane", "plant", "point", "power",
  "press", "price", "prize",
  "quiet", "quota",
  "reach", "reply", "right", "round",
  "serve", "shade", "shake", "shape", "share", "shine", "short",
  "shout", "small", "sound", "space",
  "spend", "stand", "start", "still", "study",
  "taste", "their", "there", "think", "title", "total", "touch",
  "trust",
  "voice", "visit",
  "waste", "watch", "water", "where", "which", "woman", "worry",
  "would", "write", "wrong"
]

let weights = [26][26]
let outputtext = ""
let wordlist = fiveletters.concat(fourletters.concat(threeletters.concat(twoletters.concat(oneletter))))
let nn

let pullcount = 7
let pulldepth = 4

exports.run = (c, suffix) => {
  c.message.channel.sendMessage(`:hourglass: Training Response for ${suffix}\n(The bot will hang until this completes, It's recommended that you use talk instead.)`).then(() => {
    outputtext = ""
    global.db.check('NeuralNetwork', {
      main: 1
    }, null, true).then(v => {
      global.debug.nn('Begin Neural Network Test Train')
      if (v.notFound) {
        nn = JSON.stringify([
          //A    B    C    D    E    F    G    H    I    J    K    L    M    N    O    P    Q    R    S    T    U    V    W    X    Y    Z
          [4.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 1.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 2.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5], //A
          [0.5, 4.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 2.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 1.0], //B
          [0.5, 0.5, 4.0, 2.0, 0.5, 0.5, 0.5, 0.5, 0.5, 1.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5], //C
          [0.5, 0.5, 0.5, 4.0, 2.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 1.0, 0.5, 0.5, 0.5, 0.5], //D
          [0.5, 0.5, 0.5, 0.5, 5.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 2.0, 0.5], //E
          [2.0, 0.5, 0.5, 0.5, 0.5, 4.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 1.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5], //F
          [2.0, 0.5, 0.5, 0.5, 0.5, 0.5, 4.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 1.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5], //G
          [0.5, 0.5, 0.5, 0.5, 2.0, 0.5, 0.5, 4.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 1.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5], //H
          [0.5, 0.5, 0.5, 0.5, 0.5, 2.0, 0.5, 0.5, 4.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 1.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5], //I
          [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 4.0, 0.5, 0.5, 0.5, 0.5, 2.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 1.0, 0.5], //J
          [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 2.0, 0.5, 4.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 1.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5], //K
          [2.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 4.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 1.0, 0.5, 0.5, 0.5], //L
          [2.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 4.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 1.0, 0.5, 0.5], //M
          [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 2.0, 0.5, 0.5, 1.0, 0.5, 4.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5], //N
          [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 1.0, 4.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 2.0, 0.5, 0.5, 0.5], //O
          [2.0, 0.5, 0.5, 1.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 4.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5], //P
          [1.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 4.0, 0.5, 0.5, 0.5, 2.0, 0.5, 0.5, 0.5, 0.5, 0.5], //Q
          [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 1.0, 0.5, 2.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 4.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5], //R
          [0.5, 0.5, 0.5, 0.5, 1.0, 0.5, 0.5, 2.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 4.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5], //S
          [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 1.0, 0.5, 0.5, 0.5, 2.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 4.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5], //T
          [0.5, 0.5, 0.5, 0.5, 1.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 2.0, 0.5, 4.0, 0.5, 0.5, 0.5, 0.5, 0.5], //U
          [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 2.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 4.0, 0.5, 1.0, 0.5, 0.5], //V
          [0.5, 1.0, 0.5, 0.5, 2.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 4.0, 0.5, 0.5, 0.5], //W
          [0.5, 0.5, 1.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 2.0, 0.5, 0.5, 0.5, 4.0, 0.5, 0.5], //X
          [0.5, 0.5, 0.5, 0.5, 2.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 1.0, 0.5, 0.5, 0.5, 0.5, 4.0, 0.5], //Y
          [0.5, 0.5, 0.5, 0.5, 2.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 1.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 4.0] //Z
        ])

        /// NOTE: You shouldn't care if this fails or not, really.
        global.db.set('NeuralNetwork', {
          main: 1,
          other: nn
        }, true).catch(e => {
          global.debug.nn(e)
        })
      } else {
        nn = v.value
        global.debug.nn('Existing Weights Found')
      }
      weights = JSON.parse(nn)
      for (let i = 0; i < suffix.length; i++) {
        switch (c[i]) {
        case " ":
          cycle(-1)
          break //SPACEBAR
        case "a":
          cycle(0)
          break
        case "b":
          cycle(1)
          break
        case "c":
          cycle(2)
          break
        case "d":
          cycle(3)
          break
        case "e":
          cycle(4)
          break
        case "f":
          cycle(5)
          break
        case "g":
          cycle(6)
          break
        case "h":
          cycle(7)
          break
        case "i":
          cycle(8)
          break
        case "j":
          cycle(9)
          break
        case "k":
          cycle(10)
          break
        case "l":
          cycle(11)
          break
        case "m":
          cycle(12)
          break
        case "n":
          cycle(13)
          break
        case "o":
          cycle(14)
          break
        case "p":
          cycle(15)
          break
        case "q":
          cycle(16)
          break
        case "r":
          cycle(17)
          break
        case "s":
          cycle(18)
          break
        case "t":
          cycle(19)
          break
        case "u":
          cycle(20)
          break
        case "v":
          cycle(21)
          break
        case "w":
          cycle(22)
          break
        case "x":
          cycle(23)
          break
        case "y":
          cycle(24)
          break
        case "z":
          cycle(25)
          break
        default:
          break
        }

        if (i === suffix.length - 1) {
          pullresponse(suffix)
          setItem(JSON.stringify(weights))

          // http://en.wikipedia.org/wiki/Latent_Dirichlet_allocation
          let LDA = require('../../../req/LDA')

          let doc = suffix.match(/[^.!?]+[.!?]+/g)

          if (LDA(doc, 1, 5)[0]) {
            global.debug.nn('I can now say "' + outputtext + '"')
          }

          c.message.channel.sendMessage('' + outputtext)
        }
      }
    })
  })
}

function cycle(input) {
  let selected = 18
  let count = 675 //26 squared minus one
  while (count > 0) { //AFTER DIMENSIONAL SUBSTITUTION IS EXHAUSTED, RECOLLECTION IS HERS.
    let next = 0 //SHE SELECTS THE HEAVIEST RETURN PATH.
    for (let check = 0; check < 26; check++) { //SHE CHECKS EACH EXIT:
      if (weights[check][selected] / 2 > weights[selected][check]) { //WHEN RETURN IS HEAVIER THAN EXIT,
        if (weights[check][selected] * 2 !== weights[check][selected] * 4) //WHEN LOADING IS NONDESTRUCTIVE,
          weights[selected][check] *= 2
      } //LOAD EXITS TO HEAVY RETURNS.
      else if (weights[selected][check] / 2) weights[selected][check] /= 2 //NONDESTRUCTIVELY UNLOAD LIGHT RETURNS.
      if (weights[check][selected] > weights[next][selected]) next = check //NEXT PATH IS HEAVIEST RETURN.
    } //AFTER ALL PATHS ARE CHECKED,
    if (input >= 0) weights[selected][input] += 1 //SHE STORES OBSERVATION AS PROXIMITY.
    else if (weights[selected][input] >= 1) weights[selected][input] -= 1 //SHE STORES TIME AS SPACE.
    selected = next //SHE FOLLOWS THE PATH WITH THE HEAVIEST RETURN.
    count-- //SHE EXPERIENCES RECOLLECTION AFTER EXHAUSTING SUBSTITUTED DIMENSIONS.
  }
  let output = 0
  for (selected = 0; selected < 26; selected++)
    if (weights[selected][7] > weights[output][7]) output = selected
  if (weights[output][output] > weights[output][7]) {
    outputtext += letters[output]
  } else {
    outputtext += "_"
  }
}

function getwords(source) {
  let wordsource = outputtext
  let wordstack = []
  let index
  for (index in source)
    if (wordsource.includes(source[index])) {
      wordstack.push(source[index])
    }
  return wordstack
}

function cycletext(text) {
  for (let index in text) {
    //noinspection JSUnfilteredForInLoop
    switch (text[index]) {
    case '_':
      cycle(-1)
      break
    case 'a':
      cycle(0)
      break
    case 'b':
      cycle(1)
      break
    case 'c':
      cycle(2)
      break
    case 'd':
      cycle(3)
      break
    case 'e':
      cycle(4)
      break
    case 'f':
      cycle(5)
      break
    case 'g':
      cycle(6)
      break
    case 'h':
      cycle(7)
      break
    case 'i':
      cycle(8)
      break
    case 'j':
      cycle(9)
      break
    case 'k':
      cycle(10)
      break
    case 'l':
      cycle(11)
      break
    case 'm':
      cycle(12)
      break
    case 'n':
      cycle(13)
      break
    case 'o':
      cycle(14)
      break
    case 'p':
      cycle(15)
      break
    case 'q':
      cycle(16)
      break
    case 'r':
      cycle(17)
      break
    case 's':
      cycle(18)
      break
    case 't':
      cycle(19)
      break
    case 'u':
      cycle(20)
      break
    case 'v':
      cycle(21)
      break
    case 'w':
      cycle(22)
      break
    case 'x':
      cycle(23)
      break
    case 'y':
      cycle(24)
      break
    case 'z':
      cycle(25)
      break
    }
  }
}

function cyclewords() {
  let index
  global.debug.nn('Cycle 1')
  for (index in oneletter) cycletext(oneletter[index] + "_")
  global.debug.nn('Cycle 2')
  for (index in twoletters) cycletext(twoletters[index] + "_")
  global.debug.nn('Cycle 3')
  for (index in threeletters) cycletext(threeletters[index] + "_")
  global.debug.nn('Cycle 4')
  for (index in fourletters) cycletext(fourletters[index] + "_")
  global.debug.nn('Cycle 5')
  for (index in fiveletters) cycletext(fiveletters[index] + "_")
  global.debug.nn('Cycle Complete')
}

function cyclestack(stack) {
  global.debug.nn('Cycle Stack Begin')
  for (let index in stack) cycletext(stack[index] + "_")
  global.debug.nn('Cycle Stack End')
}

function getcount(outputstack, word) {
  let count = 0
  for (let index in outputstack) {
    for (let wordindex in outputstack[index]) {
      if (word === outputstack[index][wordindex]) count++
    }
  }
  return count
}

function stripspaces() {
  outputtext = outputtext.split('_').join('')
}

function pullresponse(c) {
  cyclewords()
  stripspaces()
  let tempstack = getwords(wordlist)
  cyclestack(tempstack)
  stripspaces()
  tempstack = getwords(tempstack)
  let outputstack = []
  let index
  for (index = 0; index < pullcount; index++) {
    outputtext = ""
    cyclestack(tempstack)
    stripspaces()
    outputstack.push(getwords(tempstack))
  }
  let wordcounts = []
  let word
  for (word in tempstack) {
    wordcounts[word] = getcount(outputstack, tempstack[word])
  }
  let wordstack = []
  for (let count = pullcount; count > pullcount - pulldepth; count--)
    for (word in tempstack)
      if (wordcounts[word] === count) wordstack.push(tempstack[word])
  outputtext = ""
  for (word in wordstack) {
    outputtext += wordstack[word] + " "
  }
  outputtext = outputtext.trim()

  global.debug.nn('Response Gathered')
}

function setItem(b) {
  global.db.set('NeuralNetwork', {
    main: 1,
    other: b
  }, true).then(() => {
    global.debug.nn('Weights Saved.')
  })
}