const Discord = require("discord.js");
const fs = require("fs");

module.exports = {
  // Execução do comando
  run: (client, botUtils, message, args) => {
    newError = botUtils.newError;

    try {
      // Codigo do comando

      //tira dps
      return message.reply('ainda não implementado');

      if(!fs.existsSync("../../dataBank/minigame")) fs.mkdirSync("../../dataBank/minigame");

      if(!fs.existsSync(`../../dataBank/minigame/${user.id}.json`)) fs.writeFileSync(`../../dataBank/minigame/${user.id}.json`, JSON.stringify(botUtils.jsonPull("../../dataBank/minigame/template.json"), null, 2));

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
      console.log(`=> ${newError(err, "perfil", IDs)}`);
    }
  },

  // Configuração do comando
  config: {
    name: "perfil",
    aliases: ["p", "profile"],
    description: "Veja o seu perfil ou o do usuario marcado",
    usage: "perfil [@user]",
    accessableby: "Membros"
  }
}