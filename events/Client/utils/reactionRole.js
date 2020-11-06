const Discord = require('discord.js');

module.exports = async (client, botUtils, guild) => {
  newError = botUtils.newError;
  try {
    let id = "773715489696120882"
    const rrChannel = guild.channels.cache.get("773614504016609320")

    const roles = [
      { name: "Coletor", react: '🏮', role: "773627457462075453" , desc: 'Poder utilizar o bot Mudae, para colecionar personagens de anime'},
      { name: "Tradução", react: '🌐', role: "773763715794862110" , desc: 'Poder pedir/acompanhar/conversar sobre traduções dos mods'}
    ]

    const m = rrChannel.messages.fetch(id)
      .then(message => {

        let embed = new Discord.MessageEmbed()
          .setTitle("Reaction Roles")
          .setColor("RANDOM")

        roles.forEach(async (conf) => {
          message.react(conf.react)
          embed.addField(conf.react+conf.name,conf.desc)
        })
        message.edit(embed)

        const filter = (reaction, user) => {
          return roles.map(r => r.react).includes(reaction.emoji.name) && !user.bot ;
        }

        const collector = message.createReactionCollector(filter,{ dispose: true })

        collector.on('collect', (r,u) => {
          roles.forEach(conf => {
            if(r.emoji.name == conf.react){
              let m = guild.members.cache.get(u.id)
              if(m) m.roles.add(guild.roles.cache.get(conf.role));
            }
          });
        });

        collector.on('remove', (r,u) => {
          roles.forEach(conf => {
            if(r.emoji.name == conf.react){
              let m = guild.members.cache.get(u.id)
              if(m) m.roles.remove(guild.roles.cache.get(conf.role));
            }
          });
        });
      })
      .catch(console.error);

  } catch (err) {
    console.log(`=> ${newError(err, "ClientReady_ReactionRoles")}`);
  }
}