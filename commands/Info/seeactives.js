const Discord = require("discord.js");

module.exports = {
  // Execução do comando
  run: (client, botUtils, message, args) => {
    newError = botUtils.newError;

    try {
      // Codigo do comando
      str = ''
      const member = client.guilds.cache.get("699823229354639471").roles.cache.get("769938641338236968").members.each( member => {
        str += member.user.tag+'\n';
      })

      message.channel.send(str)

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
    name: "seeactives",
    noalias: "Sem sinonimos",
    aliases: [],
    description: "Ver quem é ativo no servidor",
    usage: "seeactives",
    accessableby: "Membros"
  }
}