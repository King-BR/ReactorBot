const Discord = require('discord.js');
const botUtils = require("../../../utils.js");

module.exports = {
  run: (client, message, args, helpers) => {

    try {
      // Execução do comando

      const search = args.join(' ').toLowerCase();
      const fBR = [];
      const fEN = [];

      helpers.textBR.forEach((t, i) => {
        if (t.toLowerCase().match(args.join(' ').toLowerCase())) fBR.push([i + 1, t])
      })
      helpers.textEN.forEach((t, i) => {
        if (t.toLowerCase().match(args.join(' ').toLowerCase())) fEN.push([i + 1, t])
      })

      botUtils.createPage(message.channel, Math.max(fBR.length, fEN.length), (page) => {
        let embed = new Discord.MessageEmbed()
          .setTitle(`(${page + 0}/${Math.max(fBR.length, fEN.length)}) Achou!!`)
          .setColor("RANDOM")
          .setTimestamp();

        if (fBR.length) {
          if (fBR.length > page) {
            embed.addField('LinhaBR:', fBR[page - 1][0]);
            embed.addField('TextoBR:', `\`${fBR[page - 1][1]}\``);
          } else { embed.addField('BR:', 'Não foi encontrado mais nada') }
        } else { embed.addField('BR:', 'Não foi encontrado') }

        if (fEN.length) {
          if (fEN.length > page) {
            embed.addField('LinhaEN:', fEN[page - 1][0]);
            embed.addField('TextoEN:', `\`${fEN[page - 1][1]}\``);
          } else { embed.addField('EN:', 'Não foi encontrado mais nada') }
        } else { embed.addField('EN:', 'Não foi encontrado') }

        return embed;
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