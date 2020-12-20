const Discord = require('discord.js');
const fs = require('fs');
const download = require('download');

module.exports = async (client, botUtils, message, file, isSchem) => {
  newError = botUtils.newError;
  try {
    let base = (await download(file.attachment)).toString("base64");
    let schema = botUtils.mndGetScheme(base);
    if (!isNaN(schema)) {
      if (schema == 1) return message.reply("Isso não é um codigo de esquema");
      if (schema == 2) return message.reply("Esse codigo é muito antigo");
      if (schema >= 3) return message.reply("O codigo esta corrompido, teste no jogo para ver funciona, caso funcione no jogo fale com algum adm (" + schema + ")");
    }
    message.delete();
    botUtils.mndSendMessageEmbed(base, schema, message)

  } catch (err) {
    let IDs = {
      server: message.channel.id,
      user: message.author.id,
      msg: message.id
    };
    console.log(`=> ${newError(err, 'Scheme_utils', IDs)}`);
  }
};
