exports.run = (c) => {
  let memberShort = c.message.guild.members
  let randNumber = Math.floor(Math.random() * memberShort.length - 1)
  c.message.channel.sendMessage(`The random user I've chosen is.. \`${memberShort[randNumber].username}#${memberShort[randNumber].discriminator} (${memberShort[randNumber].id})\``)
}