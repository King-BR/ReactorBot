const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
  run: (client, botUtils, message, args, helpers) => {

    try {
      // Execução do comando
      let iLine = parseInt(args[0]);
      if (isNaN(iLine)) return message.reply('Preciso saber a linha');
      line = JSON.parse(fs.readFileSync(helpers.filePath + 'creating.json'))[iLine];
      if (!line) return message.reply('Não foi encontrado nada nessa linha');
      if (!args[1]) return message.reply('Envie a tag de membro que tenha uma proposta nessa linha');

      iProp = line.findIndex(prop => {
        let pAuthor = client.users.cache.get(prop.author)
        pAuthor = pAuthor ? pAuthor.tag.toLowerCase() : "original"
        return pAuthor.startsWith(args[1].toLowerCase()) || prop.author == args[1] || message.mentions.users.size && prop.author == message.mentions.users.first().id
      });
      prop = line[iProp]

      if (!prop) return message.reply(`O membro ${args[1]} não foi encontrado`);
      if (prop.author == message.author.id) return message.reply(`Você não pode votar na sua propia proposta`);
      let pAuthor = client.users.cache.get(prop.author)
      pAuthor = pAuthor ? pAuthor.tag : "Original"


      let embed = new Discord.MessageEmbed()
        .setTitle(pAuthor)
        .setDescription("adfafasdf");
      message.channel.send(embed).then(m1 => {
        m1.react('👍').then(m2 => {
          console.log(m2)
          m2.react('👎')
            .then(msg => {
            msg.react('❌')

            const filter = (reaction, user) => {
              return ['👍', '👎', '❌'].includes(reaction.emoji.name) && user.id === message.author.id
            };

            let collector = msg.createReactionCollector(filter, { time: 10000 });

            collector.on("collect", (r, u) => {
              switch (r.emoji.name) {
                case '👍': {

                  botUtils.jsonChange(helpers.filePath + 'creating.json', original => {
                    if (prop.mUp.includes(message.author.id)) {
                      message.reply("Voto concluido com sucesso... Apesar que, tu ja tinha votado nisso então não conto")
                    } else if (prop.mDown.includes(message.author.id)) {
                      message.reply("Voto movido com sucesso")
                      original[iLine][iProp].likes++;
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
                    if (prop.mUp.includes(message.author.id)) {
                      message.reply("Voto movido com sucesso")
                      original[iLine][iProp].likes--;
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
                  changeRemove()
                  collector.stop();
                  break;
                }
              }
            })

            collector.on("end", collected => {
              if (collected.size > 0) return;
              changeRemove()
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