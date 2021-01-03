const Discord = require('discord.js');
const botUtils = require("../../../utils.js");

module.exports = {
  run: (client, message, args, helpers) => {

    try {
      // Execução do comando
      const arrbr = helpers.textBR.map(t => t.replace(helpers.regSep, '$1').trim()).filter(t => t);
      const arren = helpers.textEN.map(t => t.replace(helpers.regSep, '$1').trim()).filter(t => t);

      const inbr = arrbr.filter(br => !arren.some(en => br == en)).filter(t => !t.startsWith('#'))
      const inen = arren.filter(en => !arrbr.some(br => en == br)).filter(t => !t.startsWith('#'))

      message.channel.send({
        files: [{
          name: "diferenças.json",
          attachment: Buffer.from(JSON.stringify({ onlyBR: inbr, onlyEN: inen }, null, 2))
        }]
      })

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