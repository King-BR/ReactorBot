const fs = require("fs");
const Discord = require("discord.js");
const botUtils = require("../../utils.js");

module.exports = {
  // Execução do comando
  run: (client, message, args) => {

    if (message.author.id == "318399612060696576") message.channel.send("se crashar tu leva ban");

    newError = botUtils.newError;
    isDir = botUtils.isDir;

    try {

      let t1 = (args[0] || 'cama').split('');
      let t2 = (args[1] || 'caixa').split('');
      let start = new Date().getTime()



      message.channel.send(JSON.stringify(botUtils.arrDiference(t1,t2)))
      message.channel.send((new Date().getTime() - start)/1000 + 's')
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
      console.log(`=> ${newError(err, "poly", IDs)}`);
    }
  },

  config: {
    name: "diff",
    aliases: [],
    description: "Pega a diferença entre 2 arrays",
    usage: "diff <arr1> / <arr2>",
    accessableby: "Membro"
  }

}