const Discord = require("discord.js");
const botUtils = require("../../utils.js");

module.exports = {
  // Execução do comando
  run: (client, message, args) => {
    newError = botUtils.newError;

    try {
      // Codigo do comando
      return message.reply('Comando n funfa');
      if (isNaN(args[0]) && parseInt(args[0])>=0 && parseInt(args[0]) == args[0]) message.reply('Precisa ser um numero inteiro positivo');
      if (!(args[0] && args[0].length == 4)) message.reply('Precisa ser 4 digitos');

      let msg = []

      client.users.cache.filter(u => u.tag.includes('#'+args[0])).each(u => {msg.push(u.tag)})
      
      message.channel.send(client.users.cache.size)

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
    name: "gettags",
    aliases: [],
    description: "descrição",
    usage: "uso",
    accessableby: "acessibilidade"
  }
}