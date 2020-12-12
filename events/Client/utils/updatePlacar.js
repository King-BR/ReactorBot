const Discord = require('discord.js');
const { Users } = require("../../../database.js");

module.exports = async (client, botUtils, serverState, guild) => {
  newError = botUtils.newError;
  try {

    let id = "784889361174233118"
    let channel = client.channels.cache.get("784877776498327563");
    let embed = new Discord.MessageEmbed()
      .setTitle("Placar");

    const m = channel.messages.fetch(id)
      .then(message => {

        let msg = '';
        Users.find({}).sort({"levelSystem.txp": -1}).limit(10).exec( (err, users) => {
          users.forEach((u,i) => {
            let member = message.guild.members.cache.get(u._id);
            embed.addField(
              `**${i+1}. ${member ? member.displayName : "Desconhecido"}:**`,
              `lvl${u.levelSystem.level}. ${u.money}$`);
          });
          message.edit(embed)
        });

      }).catch(err => {console.log(`=> ${newError(err, "ClientReady_updatePlacar")}`)});

  } catch (err) {
    console.log(`=> ${newError(err, "ClientReady_updatePlacar")}`);
  }
}