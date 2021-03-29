const Discord = require('discord.js');
const fs = require('fs');
const download = require('download');
const botUtils = require("../../../utils.js");

module.exports = async (client, message, base) => {
  newError = botUtils.newError;
  try {
    let schema;
    try {
      schema = new botUtils.Schematic(Buffer.from(base, "base64"));
    } catch { return true; }
    message.delete()
    botUtils.mndSendMessageEmbed(base, message, schema)

  } catch (err) {
    let IDs = {
      server: message.channel.id,
      user: message.author.id,
      msg: message.id
    };
    console.log(`=> ${newError(err, 'Scheme_utils', IDs)}`);
  }
};
