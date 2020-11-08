const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
  run: (client, botUtils, message, args, helpers) => {

    try {
      // Execução do comando

      const props = JSON.parse(fs.readFileSync(helpers.filePath + 'creating.json'))
      if (!Object.keys(props)) return message.reply('Não possui nenhuma proposta');

      let embed = new Discord.MessageEmbed()
        .setTitle("Todas as Propostas")
        .setColor("RANDOM")
        .setTimestamp();

      if (isNaN(args[0])) {

        embed.setDescription(Object.keys(props).join('\n'))

      } else {

        let purp = props[args[0]]
        if (!purp) return message.reply('Numero Invalido!');
        purp = purp.sort((a, b) => a.likes - b.likes)
        purp.forEach(prop => {
          let aut = client.users.cache.get(prop.author)
          embed.addField(`(${prop.likes}) ${aut ? aut.tag : 'Original'}`, '```' + prop.msg + '```')
        })

      }
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
      console.log(`=> ${newError(err, 'traduct_' + (/\s+([^\s]+)/i.exec(message.content)[1] || '???'), IDs)}`);
    }
  }
}