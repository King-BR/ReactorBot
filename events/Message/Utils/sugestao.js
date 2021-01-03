const Discord = require("discord.js");
const botUtils = require("../../../utils.js");

module.exports = async (client, message) => {
  newError = botUtils.newError;
  try {

    await message.react('❌')
    await message.react('✅')

  } catch (err) {
    let IDs = {
      server: message.guild.id,
      user: message.author.id,
      msg: message.id
    }
    console.log(`=> ${newError(err, "ClientMessage_Mudae", IDs)}`);
  }
}