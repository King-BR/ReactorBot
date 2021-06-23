const fs = require("fs");
const Discord = require("discord.js");
const {MessageButton, MessageActionRow} = require("discord-buttons");
const botUtils = require("../../utils.js");

module.exports = {
  // Execução do comando
  run: (client, message, args) => {
    newError = botUtils.newError;

    try {
      //tira dps
			let btn = new MessageButton()
				.setLabel("Bom dia1")
				.setStyle("green")
				.setID("Bom Dia");

			let btn2 = new MessageButton()
				.setLabel("Bom dia2")
				.setStyle("green")
				.setID("Bom Dia");

			let row = new MessageActionRow()
				.addComponent(btn)
				.addComponent(btn2);
				
      message.channel.send("Bom dia?",{components:[row]})

    } catch (err) {
      let embed = new Discord.MessageEmbed()
        .setTitle("Erro inesperado")
        .setDescription("Um erro inesperado aconteceu. por favor contate os ADMs\n\nUm log foi criado com mais informações do erro");
      message.channel.send(embed);

      let IDs = {
        server: message.guild.id,
        user: message.author.id,
        msg: message.id
      }
      console.log(`=> ${newError(err, module.exports.config.name, IDs)}`);
    }
  },

  config: {
    name: "fish",
    noalias: "sem apelidos",
    aliases: [],
    description: "Pesca um peixe para vender depois",
    usage: "fish",
    accessableby: "Membros"
  }
}