const Discord = require('discord.js');

module.exports = {
  run: (client, botUtils, message, args, helpers) => {

    try {
      // Execução do comando

      const line = parseInt(args.shift())

      if (isNaN(line)) return message.reply('preciso saber a linha.');
      if (!args[0]) return message.reply('Eu preciso saber o que voce deseja por no lugar');
      if (line > 0 && line - helpers.textBR.length - 1 > 0) return message.reply('numero invalido, precisa ser entre 1 e ' + helpers.textBR.length - 1)

      const trad = helpers.textBR[line-1]
      const prop = args.join(' ')
      const eng = helpers.textEN.find(t => t.replace(helpers.regSep, '$1').trim() == trad.replace(helpers.regSep, '$1').trim())


      botUtils.jsonChange(helpers.filePath + 'creating.json', lines => {

        if (!lines[line]) {
          lines[line] = [{
            msg: trad.replace(helpers.regSep, '$2').trim(),
            author: 'defalt',
            likes: 0,
            mUp: [],
            mDown: []
          }]
        } else if (lines[line].some(obj => obj.author == message.author.id)  ) {
          lines[line].splice(lines[line].findIndex(obj => obj.author == message.author.id),1)
        }

        lines[line].push({
          msg: prop,
          author: message.author.id,
          likes: 0,
          mUp: [],
          mDown: []
        })
        return lines
      }, true)

      let embed = new Discord.MessageEmbed()
        .setTitle("Enviada com sucesso")
        .setColor("RANDOM")
        .addField('Atual:', '```' + trad + '```')
        .addField('Original:', eng ? '```' + eng + '```' : '_Não foi achado_')
        .addField('Sua proposta:', '```' + (trad ? trad.replace(helpers.regSep, '$1').trim() + ' = ' : '') + (prop || 'Oh no') + '```')
        .setTimestamp();
      message.channel.send(embed);

      let nembed = new Discord.MessageEmbed()
        .setTitle(`Linha: \`${line}\`, Nova proposta`)
				.setAuthor(message.author.tag,message.author.displayAvatarURL())
        .setColor("RANDOM")
        .addField('Atual:', '```' + trad + '```')
        .addField('Original:', eng ? '```' + eng + '```' : '_Não foi achado_')
        .addField('Proposta:', '```' + (trad ? trad.replace(helpers.regSep, '$1').trim() + ' = ' : '') + (prop || 'Oh no') + '```')
        .setTimestamp();
      client.channels.cache.get("775957550038384670").send(nembed);


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