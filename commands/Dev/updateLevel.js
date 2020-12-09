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

      let XPconfig = require('../../dataBank/levelSystem.json');
      docs.forEach(doc => {
        while(doc.levelSystem.xp >= XPconfig[doc.levelSystem.level - 1].XPNextLevel) {
          if (doc.levelSystem.xp >= XPconfig[doc.levelSystem.level - 1].XPNextLevel) {
					  doc.levelSystem.xp -= XPconfig[doc.levelSystem.level - 1].XPNextLevel;
					  doc.levelSystem.level++;
				  } else {
					  doc.levelSystem.xp += XPconfig[doc.levelSystem.level - 1].XPNextLevel;
				  }
        }
        doc.save();
      });
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