const Discord = require('discord.js');
const fs = require('fs');
const botUtils = require("../../../utils.js");

module.exports = {
  run: (client, message, args, helpers) => {

    try {
      // Execução do comando

      const line = parseInt(args[0])
      if (isNaN(args[0])) return message.reply('Preciso de um numero');

      const resBR = helpers.textBR[line-1]
      const resEN = resBR && helpers.textEN.find(t => t.replace(helpers.regSep, '$1').trim() == resBR.replace(helpers.regSep, '$1').trim())

      let embed = new Discord.MessageEmbed()
        .setTitle("Resultados.")
        .setColor("RANDOM")
        .addField('bundle_BR', resBR ? '```' + resBR + '```' : 'Não foi encontrado')
        .addField('bundle_EN', resEN ? '```' + resEN + '```' : 'Não foi encontrado')
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