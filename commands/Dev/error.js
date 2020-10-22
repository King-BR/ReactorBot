const fs = require("fs");
const Discord = require("discord.js");

module.exports = {
  run: async (client, botUtils, message, args) => {
    if (!botUtils.isDev(message.author.id)) return message.channel.send("Voce não tem permissão para executar esse comando")

    newError = botUtils.newError;
    isDir = botUtils.isDir;

    try {
      if(!args[0]) {
        let embed = new Discord.MessageEmbed()
          .setColor("RANDOM")
          .setTimestamp()
          .setDescription(`${client.config.prefix}error [opção]`)
          .addField("clear", "Limpa todos os erros")
          .addField("delete", "Apaga um erro especifico")
          .addField("list", "Lista todos os erros")
          .addField("search <ID>", "Procura um erro contendo o id fornecido")
        message.channel.send(embed);
        return;
      }

      switch(args[0]) {
        case "clear": {
          botUtils.clearAllErrors();
          message.reply(" todos os erros foram limpos");
          break;
        }
        case "delete": {
          botUtils
          break;
        }
      }
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
      console.log(`=> ${newError(err, "error", IDs)}`);
    }
  },

  config: {
    name: "error",
    noalias: "Sem sinonimos",
    aliases: [],
    description: "Cheque os erros salvos pelo handler de erros",
    usage: "error",
    accessableby: "Desenvolvedores"
  }
}