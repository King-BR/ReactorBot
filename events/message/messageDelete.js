const Discord = require("discord.js");

module.exports = async ({ client, botUtils }, message) => {
  newError = botUtils.newError;

  try {
    const cLogs = client.channels.cache.get('767982805908324411');

    if (message.channel.id == cLogs.id) {
      if (message.embeds[0]) cLogs.send(message.embeds[0]);
      cLogs.send('Alguem tentou apagar uma mensagem');
    }

  } catch (err) {
    let IDs = {
      server: message.guild.id,
      user: message.author.id,
      msg: message.id
    }
    console.log(`=> ${newError(err, "ClientMessageDelete", IDs)}`);
  }
}