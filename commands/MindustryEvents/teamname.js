const Discord = require("discord.js");
const botUtils = require("../../utils.js");

module.exports = {
  // Execução do comando
  run: (client, message, args) => {
    newError = botUtils.newError;

    try {
      // Codigo do comando
      const mevent = botUtils.jsonPull('./dataBank/mindustryEvent.json')

      let i = mevent.teams.findIndex(t => t.members.includes(message.author.id))

      if (i == -1) return message.reply('Você não participa de nenhum time');
      if (!args[0]) return message.reply('Preciso de um nome');
      if (args[0].length > 31) return message.reply('Um nome menor, pfv');

      mevent.teams[i].name = args.join(' ')
      botUtils.jsonPush('./dataBank/mindustryEvent.json',mevent)

      let msg = '';

      mevent.teams[i].members.forEach(member => { msg += client.users.cache.get(member).tag + "\n" });

      let embed = new Discord.MessageEmbed()
        .setTitle(mevent.teams[i].name)
        .setColor("RANDOM")
        .setDescription(msg)
        .setFooter("ID: " + mevent.teams[i].id);
      message.channel.send(embed)
      

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
    name: "teamname",
    aliases: ['timenome'],
    description: "Coloca o nome do time",
    usage: "teamname <nome>",
    accessableby: "Membros"
  }
}