const Discord = require("discord.js");

module.exports = async ({ client, botUtils }, member) => {
  newError = botUtils.newError;

  try {

    //console.log(member);

  } catch (err) {
    let IDs = {
      server: member.guild.id,
      user: member.user.id
    }
    console.log(`=> ${newError(err, "guildMemberAdd", IDs)}`);
  }
}