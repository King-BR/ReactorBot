const Discord = require("discord.js");
const { Users } = require("../../database.js");

module.exports = {
  // Execução do comando
  run: (client, botUtils, message, args) => {
    Users.find({}, (err, docs) => {
      if(err) {
        console.log("\n=> " + newError(err, "db", {user: user.id, server: message.guild.id, msg: message.id}));
        return;
      }

      docs.forEach(doc => {
        doc.txp = doc.levelSystem.txp;
        //message.channel.send(doc._id + ": " + doc.txp);
        doc.save();
      })
    })
  },

  config: {
    name: "dblvl",
    noalias: "Sem sinonimos",
    aliases: [],
    description: "Sem descrição",
    usage: "dblvl",
    accessableby: "Desenvolvedores"
  }
}