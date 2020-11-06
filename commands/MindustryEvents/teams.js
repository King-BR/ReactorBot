const Discord = require("discord.js");

module.exports = {
  // Execução do comando
  run: (client, botUtils, message, args) => {
    newError = botUtils.newError;

    try {
      // Codigo do comando
      teams = botUtils.jsonPull('./dataBank/mindustryEvent.json').teams
      
      let embed = new Discord.MessageEmbed()
        .setTitle("Equipes")
        .setColor("RANDOM");

      teams.forEach(team => {
        embed.addField(team.id,team.members.join('\n'),true)
      });
      message.channel.send(embed);

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
    name: "teams",
    aliases: ['times'],
    description: "vê os times",
    usage: "times",
    accessableby: "Membros"
  }
}