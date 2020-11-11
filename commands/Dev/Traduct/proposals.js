const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
  run: (client, botUtils, message, args, helpers) => {

    try {
      // Execução do comando

      const allLines = JSON.parse(fs.readFileSync(helpers.filePath + 'creating.json'))
      if (!Object.keys(allLines)) return message.reply('Não possui nenhuma proposta');

      const iLine = parseInt(args[0]);

      let embed = new Discord.MessageEmbed()
        .setTitle("Todas as Propostas")
        .setColor("RANDOM")
        .setTimestamp();


      //Caso não tenha o numero da linha
      if (args[0] == '*') {

        const lines = Object.keys(allLines);
        console.lo
        botUtils.createPage(message.channel, lines.length, (page) => {
          

          let lembed = new Discord.MessageEmbed()
            .setTitle("Proposta da linha "+lines[page-1])
            .setColor("RANDOM")
            .setTimestamp();

          allLines[lines[page-1]].sort((a, b) => b.likes - a.likes).forEach(prop => {
            let aut = client.users.cache.get(prop.author)
            lembed.addField(`(${prop.likes}) ${aut ? aut.tag : 'Original'}`, '```' + prop.msg + '```')
          })

          return lembed;
        })

        return;
      }

      //Caso não tenha o numero da linha
      if (isNaN(iLine)) {

        embed.setDescription(Object.keys(allLines).map(lin => `**${allLines[lin].length - 1} propostas na linha:** \`${lin}\``).join('\n'))

        return message.channel.send(embed);
      }

      //pegando os nomes
      const line = allLines[iLine];
      if (!line) return message.reply('Numero Invalido!');

      //Caso não tenha o nome
      if (!args[1]) {

        line.sort((a, b) => b.likes - a.likes).forEach(prop => {
          let aut = client.users.cache.get(prop.author)
          embed.addField(`(${prop.likes}) ${aut ? aut.tag : 'Original'}`, '```' + prop.msg + '```')
        })

        return message.channel.send(embed);
      }

      iProp = line.findIndex(prop => {
        let pAuthor = client.users.cache.get(prop.author)
        pAuthor = pAuthor ? pAuthor.tag.toLowerCase() : "original"
        return pAuthor.startsWith(args[1].toLowerCase()) || prop.author == args[1] || message.mentions.users.size && prop.author == message.mentions.users.first().id
      });
      const prop = line[iProp]

      //Caso tenha os nomes
      message.channel.send(embed).then(msg => {
        msg.react('👍').then(() => {
          msg.react('👎').then(() => {
            msg.react('❌')

            const filter = (reaction, user) => {
              return ['👍', '👎', '❌'].includes(reaction.emoji.name) && user.id === message.author.id
            };

            let collector = msg.createReactionCollector(filter, { time: 10000 });

            collector.on("collect", (r, u) => {
              switch (r.emoji.name) {
                case '👍': {

                  botUtils.jsonChange(helpers.filePath + 'creating.json', original => {
                    if (original[iLine][iProp].mUp.includes(message.author.id)) {
                      message.reply("Voto concluido com sucesso... Apesar que, tu ja tinha votado nisso então não conto")
                    } else if (prop.mDown.includes(message.author.id)) {
                      message.reply("Voto movido com sucesso")
                      original[iLine][iProp].likes += 2;
                      original[iLine][iProp].mUp.push(message.author.id);
                      original[iLine][iProp].mDown = original[iLine][iProp].mDown.filter(id => id != message.author.id);
                    } else {
                      message.reply("Votado com sucesso")
                      original[iLine][iProp].likes++;
                      original[iLine][iProp].mUp.push(message.author.id);
                    }
                    return original
                  }, true)

                  msg.reactions.removeAll();
                  collector.stop();
                  break;
                }
                case '👎': {

                  botUtils.jsonChange(helpers.filePath + 'creating.json', original => {
                    if (original[iLine][iProp].mUp.includes(message.author.id)) {
                      message.reply("Voto movido com sucesso")
                      original[iLine][iProp].likes -= 2;
                      original[iLine][iProp].mDown.push(message.author.id);
                      original[iLine][iProp].mUp = original[iLine][iProp].mDown.filter(id => id != message.author.id);
                    } else if (prop.mDown.includes(message.author.id)) {
                      message.reply("Voto concluido com sucesso... Apesar que, tu ja tinha votado nisso então não conto")
                    } else {
                      message.reply("Votado com sucesso")
                      original[iLine][iProp].likes--;
                      original[iLine][iProp].mDown.push(message.author.id);
                    }
                    return original
                  }, true)

                  msg.reactions.removeAll();
                  collector.stop();
                  break;
                }
                case '❌': {

                  message.reply("cancelado");
                  msg.reactions.removeAll();
                  collector.stop();
                  break;
                }
              }
            })

            collector.on("end", collected => {
              if (collected.size > 0) return;
              msg.reactions.removeAll();
            });

          })
        })
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