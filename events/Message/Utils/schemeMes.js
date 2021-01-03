const Discord = require('discord.js');
const fs = require('fs');
const download = require('download');
const botUtils = require("../../../utils.js");

module.exports = async (client, message, base) => {
  newError = botUtils.newError;
  try {
    let schema = botUtils.mndGetScheme(base);
    if (!isNaN(schema)) return true;
    message.delete()
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
