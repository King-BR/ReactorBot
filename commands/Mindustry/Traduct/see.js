const Discord = require('discord.js');
const fs = require('fs');
const botUtils = require("../../../utils.js");

module.exports = {
  run: (client, message, args, helpers) => {

    try {
      // Execução do comando

      // caso seja * retorna tudo
      if (args[0] == '*') return message.channel.send({ files: [helpers.filePath + 'last.txt'] });;

      // args -> [pesquisa, pagina]
      args[1] = parseInt(args[1]) || parseInt(args[0]) || 1
      if (!(args[0] && isNaN(args[0]))) args[0] = '';

      // transformando a lista de objetos text em apenas seus caminhos
      let pathBR = helpers.textBR.map(t => t.replace(/^([^=]*).+$/i, '$1').trim())
      let pathEN = helpers.textEN.map(t => t.replace(/^([^=]*).+$/i, '$1').trim())
      let embed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setTimestamp();

      //vendo se a busca possui uma descrição, caso tenha retorna ela
      if (args[0].trim() && pathBR.some((t, i) => {
        if (t != args[0]) return; 
        embed.setTitle(args[0])
        embed.addField('linhaBR:', i + 1)
        embed.addField('TextoBR:', '`' + helpers.textBR[i].replace(/^.+=(.+)$/i, '$1').trim() + '`');
        pathEN.some((t, i) => {
          if (t != args[0]) return;
          embed.addField('linhaEN:', i + 1)
          embed.addField('TextoEN:', '`' + helpers.textEN[i].replace(/^.+=(.+)$/i, '$1').trim()+'`')
          return true;
        });
        embed.addField('Childs:', pathBR.some(t => t.startsWith(args[0] + '.')))
        return message.channel.send(embed);
      })) return;
      if(args[0] && !args[0].endsWith('.')) args[0] += '.';

      //pegando os filhos do caminho q foi pedido
      pathBR = pathBR.filter(p => p.startsWith(args[0].toLowerCase())).map(l => l.replace(args[0].toLowerCase(),'').replace(/^([^\.]+).*/i,'$1'))
      pathBR = pathBR.filter((t,i) => i == pathBR.indexOf(t)).sort()

      //caso n foi achado
      if (!pathBR.length) return message.reply('Não foi achado nada');

      //envia os valores para o usuario
      botUtils.createPage(message.channel, Math.ceil(pathBR.length / 10), (page) => {
        let embed = new Discord.MessageEmbed()
          .setColor("RANDOM")
          .setTitle(`${page}/${Math.ceil(pathBR.length / 10)} ${args[0]}`)
          .setDescription(pathBR.slice((page - 1) * 10, page * 10).join('\n'))
          .setTimestamp();
        return embed
      })
      //message.channel.send(embed)

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