const Discord = require("discord.js");

module.exports = (client, botUtils, message) => {
  newError = botUtils.newError;
  try {
    // detecta se esta no #mudae-comércio
    if (message.channel.id == "756587320140103690") {
      if ((message.content.match(/\n/g) || []).length < 3) {
        let emb = new Discord.MessageEmbed()
          .setColor('RANDOM')
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setTitle('Mensagem no #mudae-comércio!')
          .setDescription(message)
          .setThumbnail(message.author.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }))
          .setTimestamp();
        message.delete({ reason: "Mensagem no canal errado" });
        client.channels.cache.get("767982805908324411").send(emb);
      }
      return;
    }
  } catch (err) {
    let IDs = {
      server: message.guild.id,
      user: message.author.id,
      msg: message.id
    }
    console.log(`=> ${newError(err, "ClientMessage_Mudae", IDs)}`);
  }
}