const { MessageEmbed } = require("discord.js");
const botUtils = require("../../utils.js");

module.exports = {
  /**
   * @param {import("discord.js").Client} client
   * @param {import("discord.js").Message} message
   * @param {String[]} args
   */
  run: (client, message, args) => {
    newError = botUtils.newError;
      if (!message.member.roles.cache.has('699823332484317194') && !message.member.roles.cache.has('700182152481996881')) return message.reply("Você não tem permissão para executar esse comando");
    try {
      let canalRegra = message.guild.channels.fetch("754046580805337259")
      message.channel.send(new MessageEmbed().setDescription(`As regras serão enviadas no canal ${canalRegra}`))
      if(!args[0]) {
        let r1 = new MessageEmbed()
          .setTitle("📝 Regras do servidor")
          .addDescription(``)
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

  config: {
    name: "regras",
    aliases: ["regra", "r"],
    description: "descrição",
    usage: "regras",
    accessableby: "STAFF"
  }
}