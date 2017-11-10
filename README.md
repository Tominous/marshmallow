# Marshmallow Core

## Installing Node
You'll need to install [NodeJS 9.1.0](https://nodejs.org/en/) before anything.
You can continue without worry with 8.1.0+, however some things (like AI) might fail.

After that, verify installation:
```
$ node -v
9.1.0

$ npm -v
5.5.1
```
## Installing Marshmallow Core
Install `git` via [git-scm](https://git-scm.com/).
If you're on MacOS, install via [homebrew](https://brew.sh/) or X Code.

After that, pull Marshmallow from git.
```
$ git clone https://github.com/radwolfdev/marshmallow.git
...
...
...

$ cd ./marshmallow
.../marshmallow $
```

Clone the file `config.example.json` with the name `config.json`.
Start configuring it accordingly.

## Create Database
Create a folder named `database` at the root path of where Marshmallow is located.
Then, create the following:

`core`
`0`

If you are planning to shard, create database directories accordingly.

Now you can run the basics of Marshmallow.
```
$ npm i
/ ...

$ node init.js
  init [CORE:INFO] Hello. +0ms
  check [SHARD 0:CHECK] mod.js Loaded +0ms
  check [SHARD 0:CHECK] Starting Marshmallow:0 +1s
  init [CORE:INFO] Shard Started: 0 With 0 Guilds. (Now 0 Total) +26s
```

If sharding is required, edit `init.js`.

# Marshmallow.AI
This is required if you want to use `:talk`, or use for any other project with attribution.

You'll have to train **your own model**. This requires a powerful CUDA compatible GPU, as well as a unix-based OS (i.e MacOS).

If you don't have a CUDA compatible GPU, or no MacOS, feel free to contact [Radwolf](https://discord.gg/radwolf) on Discord.

## Install Requirements
- Install [Tensorflow GPU](https://www.tensorflow.org/).
- Install [Python 2.7.10](https://www.python.org/downloads/). **No higher, no lower.**
- Install [Reddit's Publicly Avaliable Comment Research](https://www.reddit.com/r/datasets/comments/3bxlg7/i_have_every_publicly_available_reddit_comment/).

## Setup Training
For training to work best, it's recommended to install the **Entire Archive**. However one month's worth of comments should work well too.
`magnet:?xt=urn:btih:7690f71ea949b868080401c749e878f98de34d3d&dn=reddit%5Fdata&tr=http%3A%2F%2Ftracker.pushshift.io%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80`

**DO NOT EXTRACT ANY BZ2/BZIP2 FILES**

Place all raw files into `ctrl/nerual/reddit-parse/reddit_data`.

Begin Conversion
```
(cd: ctrl/neural)

$ python reddit-parse.py
```

It's recommended that you play with `parser_config_standard.json` to attempt to come up with an interesting data set. If you've found a unique one, feel free to contact [Radwolf](https://discord.gg/radwolf) and we'll be more than happy to list it here.

Verify that conversion completed with no errors by checking `data` for a directory named `xhavier`.

## Begin Training
Make sure everything is in place before training.

**We are not responsible for possible damage to your system. What you do with training is up to you, and your fault.**

```
$ python train.py -h
usage: train.py [-h] [--data_dir DATA_DIR] [--save_dir SAVE_DIR]
                [--rnn_size RNN_SIZE] [--num_layers NUM_LAYERS]
                [--model MODEL] [--batch_size BATCH_SIZE]
                [--seq_length SEQ_LENGTH] [--num_epochs NUM_EPOCHS]
                [--save_every SAVE_EVERY] [--grad_clip GRAD_CLIP]
                [--learning_rate LEARNING_RATE] [--decay_rate DECAY_RATE]
                [--decay_steps DECAY_STEPS]

optional arguments:
  -h, --help            show this help message and exit
  --data_dir DATA_DIR   data directory containing input.txt
  --save_dir SAVE_DIR   directory for checkpointed models (load from here if
                        one is already present)
  --rnn_size RNN_SIZE   size of RNN hidden state
  --num_layers NUM_LAYERS
                        number of layers in the RNN
  --model MODEL         rnn, gru, lstm or nas
  --batch_size BATCH_SIZE
                        minibatch size
  --seq_length SEQ_LENGTH
                        RNN sequence length
  --num_epochs NUM_EPOCHS
                        number of epochs
  --save_every SAVE_EVERY
                        save frequency
  --grad_clip GRAD_CLIP
                        clip gradients at this value
  --learning_rate LEARNING_RATE
                        learning rate
  --decay_rate DECAY_RATE
                        how much to decay the learning rate
  --decay_steps DECAY_STEPS
                        how often to decay the learning rate
```

We're hoping that you have basic knowledge of Neural Networks **and** Machine Learning before training.

Everything should be setup well enough for a GTX Titan **and** a 2017 Macbook Pro. No configuration is needed and you can just run `python train.py`.

## Begin Training (old system)
If your system is old and may not hold a lot of GPU Memory, adjust the hyperparameters accordingly. More or less, adjust the `batch_size`.

# Thanks
Andrej Karpathy [char-rnn](https://github.com/karpathy/char-rnn).
Sherjil Ozair [Tensorflow Port](https://github.com/sherjilozair/char-rnn-tensorflow).
