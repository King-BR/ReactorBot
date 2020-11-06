const Discord = require("discord.js");

module.exports = async (client, botUtils, message) => {
  newError = botUtils.newError;
  try {

    await message.react('❌')
    message.react('✅')

  } catch (err) {
    let IDs = {
      server: message.guild.id,
      user: message.author.id,
      msg: message.id
    }
    console.log(`=> ${newError(err, "ClientMessage_Mudae", IDs)}`);
  }
}