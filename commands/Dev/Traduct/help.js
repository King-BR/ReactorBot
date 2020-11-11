const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
  run: (client, botUtils, message, args, helpers) => {

    try {
      // Execução do comandosfa
      const details = {
        help: ""
      }
      
      let embed = new Discord.MessageEmbed()
        .setTitle("Ajuda")
        .setColor("RANDOM");
      let folder = fs.readdirSync(`./commands/Dev/Traduct`).filter(t => t.endsWith('.js'));
      folder.forEach(t => {
        embed.addField('traduct '+t.slice(0,-3),details[t.slice(0,-3)] || "Não especificado")
      })
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
      console.log(`=> ${newError(err, 'traduct_' + (/\s+([^\s]+)/i.exec(message.content)[1] || 'help'), IDs)}`);
    }
  }
}