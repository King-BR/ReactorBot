const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
  run: (client, botUtils, message, args, helpers) => {

    try {
      // Execução do comando

      // caso seja * retorna tudo
      if (args[0] == '*') return message.channel.send({ files: [helpers.filePath + 'last.txt'] });;

      // args -> [pesquisa, pagina]
      args[1] = parseInt(args[1]) || parseInt(args[0]) || 1
      if (!(args[0] && isNaN(args[0]))) args[0] = '';

      //Definindo valores
      const eng = fs.readFileSync(helpers.filePath + 'english.txt', 'utf8').split('\n')
      let embed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setTimestamp();

      // transformando a lista de objetos text em apenas seus caminhos
      let pathBR = helpers.textBR.map(t => t.replace(/^([^=]*).+$/i, '$1').trim())
      let pathEN = helpers.textEN.map(t => t.replace(/^([^=]*).+$/i, '$1').trim())

      //vendo se a busca possui uma descrição, caso tenha retorna ela
      if (args[0].trim() && pathBR.some((t, i) => {
        if (t == args[0]) {
          embed.addField('linhaBR:', i+1)
          embed.addField('TextoBR:', '`' + helpers.textBR[i].replace(/^.+=(.+)$/i, '$1').trim() + '`')
          pathEN.some((t, i) => {
            if (t == args[0]) {
              embed.addField('linhaEN:', i+1)
              embed.addField('TextoEN:', '`' + helpers.textEN[i].replace(/^.+=(.+)$/i, '$1').trim() + '`')
              return true;
            };
          })
          embed.addField('Childs:',pathBR.some(t => t.startsWith(args[0]+'.')))
          message.channel.send(embed)
          return true;
        };
      })) return;
      //caso tenha filhos ou n exista passe para ca

      //pegando os filhos do caminho q foi pedido
      if (args[0].endsWith('.')) args[0] = args[0].slice(0, -1)
      args[0] = args[0] && args[0].replace(/\./g, '\\.') + '\\.'
      pathBR = pathBR.filter(t => t).map(t => (new RegExp(`^(${args[0]}[^\\.]+).*\$`, 'i')).exec(t)).filter((t) => t).map(t => t[1])
      pathBR = pathBR.filter((t, i) => pathBR.indexOf(t) == i).sort()

      //caso n foi achado
      if (!pathBR.length) return message.reply('Não foi achado nada');

      //reduz a arr somente para o tamanho da pagina
      let page = (args[1] || 1) + '/' + Math.ceil(pathBR.length / 10);
      pathBR = pathBR.filter((t, i) => i < args[1] * 10 && i >= (args[1] - 1) * 10)

      //envia os valores para o usuario
      embed.setTitle(args[0].replace(/\\/g, '').slice(0, -1) + (pathBR.length > 9 ? ' ' + page : ''))
      embed.setDescription(pathBR.join('\n'))
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