const Discord = require("discord.js");

module.exports = async ({ client, botUtils }, member) => {
  newError = botUtils.newError;
// testa agr
  if(member.guild.id != "699823229354639471") return;

  try {
    let emoji = client.emojis.cache.find(e => e.name == "PaimonPat" && e.animated);

    let welcome = new Discord.MessageEmbed()
      .setTitle(`${emoji} Bem vindo!`)
      .setDescription(`${member} (${member.user.tag}), obrigado por entrar em nosso servidor!`)
      .setColor("RANDOM")
      .setTimestamp()
      .setThumbnail(member.user.displayAvatarURL({ format: "png", dynamic: true, size: 512 }))
    client.channels.cache.get("699823229354639474").send(welcome);
  } catch (err) {
    let IDs = {
      server: member.guild.id,
      user: member.user.id
    }
    console.log(`=> ${newError(err, "guildMemberAdd", IDs)}`);
  }
}