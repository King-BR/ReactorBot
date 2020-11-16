const Discord = require("discord.js");

module.exports = ({ client, botUtils }, member) => {
  newError = botUtils.newError;

  try {
    let emoji = client.emojis.cache.get("777879077309775872");

    let welcome = new Discord.MessageEmbed()
      .setTitle(`Até Logo!`)
      .setDescription(`${member} (${member.user.tag}), saiu do nosso servidor!`)
      .setColor("RANDOM")
      .setTimestamp()
      .setThumbnail(member.user.displayAvatarURL({ format: "png", dynamic: true, size: 512 }))
      //.setImage("https://thumbs.gfycat.com/BrownFavoriteCock-small.gif");
    client.channels.cache.get("699823229354639474").send(welcome);

  } catch (err) {
    console.log(`=> ${newError(err, "nome do evento")}`);
  }
}