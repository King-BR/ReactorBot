const Discord = require("discord.js");
const botUtils = require("../../utils.js");
const { Users, Clans, Bases } = require("../../database.js");

module.exports = {
  run: (client, message, args) => {
    newError = botUtils.newError;

    if(!botUtils.isDev(message.author.id) && !botUtils.isTester(message.author.id)) return message.reply("Comando em manutenção");

    try {
      if(message.mentions.channels.size == 0) return message.reply("marca o canal seu animal");
      
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
    name: "viajar",
    aliases: ["travel"],
    description: "descrição",
    usage: "viajar <#canal>",
    accessableby: "Membros"
  }
}