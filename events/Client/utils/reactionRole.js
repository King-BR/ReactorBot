const Discord = require('discord.js');
const botUtils = require("../../../utils.js");

module.exports = async (client, guild) => {
  newError = botUtils.newError;
  try {
    let id = "773715489696120882"
    const rrChannel = guild.channels.cache.get("773614504016609320")

    const roles = [
      { name: "Colecionador", react: '🏮', role: "773627457462075453" , desc: 'Poder utilizar o bot Mudae, para colecionar personagens de anime'},
      { name: "Tradução", react: '🌐', role: "773763715794862110" , desc: 'Poder pedir/acompanhar/conversar sobre traduções dos mods'},
      { name: "Modding", react: '⚙️', role: "825127723914625085" , desc: 'Acesso aos canais de modding de mindustry'},
      { name: "Anarquia", react: '<:boom:751501838473232444>', role: "822946964588724234" , desc: 'Acesso aos chats anarquicos'}
    ]

    const bannedChannels = [
      '738471925004632104', //frases do dia
      '700126364304670881', //anuncios
    ]

    const m = rrChannel.messages.fetch(id)
      .then(message => {

        let embed = new Discord.MessageEmbed()
          .setTitle("Reaction Roles")
          .setColor("RANDOM")

        roles.forEach(async (conf) => {
          let react = conf.react;
          if(conf.react.includes(':')) react = conf.react.split(':')[2].replace('>', '')
          message.react(react);
          embed.addField(conf.react+conf.name,conf.desc);
        })
        message.edit(embed)

        const filter = (reaction, user) => {
          return (roles.map(r => r.react).includes(reaction.emoji.name) || roles.map(r => { if(r.react.includes(':')) return r.react.split(':')[2].replace('>', '') }).includes(reaction.emoji.id)) && !user.bot ;
        }

        const collector = message.createReactionCollector(filter,{ dispose: true })

        collector.on('collect', (r,u) => {
          roles.forEach(conf => {
            if(r.emoji.name == conf.react || (conf.react.includes(':') && r.emoji.id == conf.react.split(':')[2].replace('>', ''))){
              let m = guild.members.cache.get(u.id)
              if(m) m.roles.add(guild.roles.cache.get(conf.role));
            }
          });
        });

        collector.on('remove', (r,u) => {
          roles.forEach(conf => {
            if(r.emoji.name == conf.react || (conf.react.includes(':') && r.emoji.id == conf.react.split(':')[2].replace('>', ''))){
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