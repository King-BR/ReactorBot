const Discord = require("discord.js");

module.exports = {
  // Execução do comando
  run: (client, botUtils, message, args) => {
    newError = botUtils.newError;

    try {
      // Codigo do comando 
      if (!args[0])return message.reply('Preciso de escolhas');

      const frases = args.join(' ').split('/')
      let escolha = frases[Math.floor(Math.random()*frases.length )]
      let nome = message.author.tag

      let embed = new Discord.MessageEmbed()
      .setTitle("Escolha")
      .setDescription("Eu escolho... `" + escolha + "`!")
      .setFooter("Solicitado por " + nome)

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
      console.log(`=> ${newError(err, "choose", IDs)}`);
    }
  },

  // Configuração do comando
  config: {
    name: "choose",
    noalias: "c",
    aliases: ['c'],
    description: "pega uma frase aleatoria (separado por /)",
    usage: "choose <frase1>[/frase2][/frase3]...",
    accessableby: "Members"
  }
}
