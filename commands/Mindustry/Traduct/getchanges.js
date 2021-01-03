const Discord = require('discord.js');
const fs = require('fs');
const botUtils = require("../../../utils.js");

module.exports = {
  run: (client, message, args, helpers) => {

    try {
      // Execução do comando

      const props = botUtils.jsonPull(helpers.filePath + 'creating.json')

      if (args[0] == 'changes') {

        message.channel.send({
          files: [{
            name: 'changes.txt',
            attachment: Buffer.from(Object.entries(props).map(line => {
              const p = line[1].sort((a, b) => b.likes - a.likes)[0]
              return `${line[0]}. ${p.msg}`
            }).join('\n'))
          }]
        })

      } else {
        
        let result = fs.readFileSync(helpers.filePath + 'last.txt','utf8').split('\n')

        Object.entries(props).forEach(line => {
          result[parseInt(line[0]) - 1] = result[parseInt(line[0]) - 1].replace(/(=).+/i, '$1') + ' ' + line[1].sort((a, b) => b.likes - a.likes)[0].msg
        })

        message.channel.send({
          files: [{
            name: 'changes.txt',
            attachment: Buffer.from(result.join('\n'))
          }]
        })
      }
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