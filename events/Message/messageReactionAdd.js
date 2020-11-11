const Discord = require("discord.js");
const isImageUrl = require("is-image-url");

module.exports = ({ client, botUtils }, messageReaction, user) => {
  newError = botUtils.newError;

  try {

    const rolesW = {
      "699823332484317194": 4, //dono
      "700182152481996881": 3, //adm
      "755603968180093089": 2  //mod
    }

    if (messageReaction.emoji.toString() == '⭐' && !messageReaction.me) {

      const guild = messageReaction.message.guild
      let number = 0;
      messageReaction.users.cache.each(user => {
        const memb = guild.members.cache.get(user.id);
        if (memb && !memb.roles.cache.get("756585458263392376")) {
          number += Math.max.apply(null,Object.entries(rolesW).map(v => {
            return memb.roles.cache.get(v[0])?v[1]:1
          }));
        }
      })

      if (number >= 5) {
        const m = messageReaction.message;
        m.react('⭐');
        let embed = new Discord.MessageEmbed()
          .setTitle("Mensagem Foda")
					.setAuthor(m.author.tag,m.author.displayAvatarURL())
					.setColor("RANDOM")
          .setDescription(m.content);

        if(m.attachments.first() && isImageUrl(m.attachments.first().url)) {
          embed.setImage(m.attachments.first().url);
        }

        client.channels.cache.get("738471925004632104").send(embed);
      }
    }

  } catch (err) {
    console.log(`=> ${newError(err, "messageReaction")}`);
  }
}