const Discord = require("discord.js");
const botUtils = require("../../utils.js");

module.exports = {
  // Execução do comando

  /**
   * @param {Discord.Client} client
   * @param {Discord.Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    newError = botUtils.newError;

    try {

      let embed = new Discord.MessageEmbed()
        .setTitle("Testando Lag")
        .setDescription(`i: 0`)
        .setColor("RANDOM")

      let msg = await message.channel.send(embed);
      msg = new botUtils.fastEditMessage(msg);
      for (let i = 0; ++i <= 10;) {
        let embed = new Discord.MessageEmbed()
          .setTitle("Testando Lag")
          .setDescription(`i: ${i}`)
          .setColor("RANDOM")
        msg.edit(embed);
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
      console.log(`=> ${newError(err, module.exports.config.name, IDs)}`);
    }
  },

  // Configuração do comando
  config: {
    name: "lagtest",
    aliases: [],
    description: "descrição",
    usage: "uso",
    accessableby: "acessibilidade"
  }
}