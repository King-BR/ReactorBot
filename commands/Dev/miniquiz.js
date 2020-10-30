const Discord = require("discord.js");

module.exports = {
  // Execução do comando
  run: (client, botUtils, message, args) => {
    newError = botUtils.newError;

    try {
      // Codigo do comando
      if (message.channel.id != "729230699416125440") return message.reply("não estrague minha surpresa :P");

      const funcs = [
        function(){
          const resp = client.emojis.cache.random()

          let str = `Mande o emoji: ${resp}`
          return [str,resp]
        }
      ]

      const quest = funcs[0]()

      message.channel.send('> '+quest[0])
      message.channel.send("||"+quest[1]+"||")

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
    name: "miniquiz",
    noalias: "Sem sinonimos",
    aliases: [],
    description: "descrição",
    usage: "miniquiz",
    accessableby: "Dev"
  }
}