module.exports = ({ client, botUtils }, messageReaction, user) => {
  newError = botUtils.newError;

  try {

    if (messageReaction.emoji.toString() == '⭐' && !messageReaction.me) {

      const guild = messageReaction.message.guild
      let number = 0;
      messageReaction.users.cache.each(user => {
        const memb = guild.members.cache.get(user.id);
        if (memb && !memb.roles.cache.get("756585458263392376")) number++;
      })

      if (number >= 5) {
        const m = messageReaction.message;
        m.react('⭐');
        client.channels.cache.get("771914110979407906").send(`"${m.content}"\n\n-${m.member}`);
      }
    }

  } catch (err) {
    console.log(`=> ${newError(err, "messageReaction")}`);
  }
}