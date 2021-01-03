const Discord = require('discord.js');
const botUtils = require("../../../utils.js");

module.exports = {
  run: (client, message, args, helpers) => {

    try {
      // Execução do comando

      let embed = new Discord.MessageEmbed()
        .setTitle("Achou!!")
        .setColor("RANDOM")
        .setTimestamp();

      if (!helpers.textBR.map(t => t.toLowerCase()).some((t, i) => {
        if (t.match(args.join(' ').toLowerCase())) {
          embed.addField('LinhaBR:', i+1);
          embed.addField('TextoBR:', `\`${t}\``);
          return true;
        }
      })) embed.addField('BR:', 'não foi encontrado');

      if (!helpers.textEN.map(t => t.toLowerCase()).some((t, i) => {
        if (t.match(args.join(' ').toLowerCase())) {
          embed.addField('LinhaEN:', i+1);
          embed.addField('TextoEN:', `\`${t}\``);
          return true;
        }
      })) embed.addField('EN:', 'não foi encontrado');

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
      console.log(`=> ${newError(err, 'traduct_' + (/\s+([^\s]+)/i.exec(message.content)[1] || '???'), IDs)}`);
    }
  }
}