const Discord = require("discord.js");

module.exports = {
  // Execução do comando
  run: (client, botUtils, message, args) => {
    newError = botUtils.newError;

    try {
      event = botUtils.jsonPull('./dataBank/mindustryEvent.json');
      let canCreate;

      //verifica se o dono da mensagem ja esta em um time
      canCreate = !event.teams.some(time => {
        return time.members.some(member => { return message.author.id == member })
      });

      if (!canCreate) return message.reply('Você ja participa de um time');

      //verifica se algum membro da mensagem ja esta em um time
      canCreate = []
      message.mentions.members.each(mentioned => {

        if (event.teams.some(time => {
          return time.members.some(member => { return mentioned.id == member })
        })) canCreate.push(mentioned.user.tag)

      })

      

      if (canCreate.length) return message.reply(`Os participantes \`${canCreate.join('`,`')}\` ja participam de algum time`);

      let desc = 'Você deseja msm criar um time ';

      if (message.mentions.members.size) {

        desc += 'com `'

        message.mentions.members.each(member => {desc += member.tag + '`,`' })

        desc = desc.slice(0,-4) + '`'

      } else {

        desc += 'sozinho?\n(Você pode depois adicionar )'

      }


      let embed = new Discord.MessageEmbed()
        .setTitle("Criando time...")
        .setDescription(msg);

      const create = (msg) => {

        var filter = (reaction, user) => {
          return (['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id);
        }

        var collector = msg.createReactionCollector(filter, { time: 15000 });

        collector.on("collect", (r, u) => {
          switch (r.emoji.name) {
            case '✅': {
              if (message.mentions.members.first()) {
                let embed = new Discord.MessageEmbed()
                  .setTitle("Aguardando confirmação...")
                  .setDescription(`Preciso da confirmação de\n${canCreate.join('\n')}`);
                message.reply(embed)
                  .then(msg => {
                    msg.react('✅')
                      .then(() => {
                        msg.react('❌')
                        confirm(msg)
                      })
                  })
              }
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
      }

      const confirm = (msg) => {

        var filter = (reaction, user) => {
          return (['✅', '❌'].includes(reaction.emoji.name) && message.mentions.members.some(member => { return member.id === user.id }));
        }

        var collector = msg.createReactionCollector(filter, { time: 60000 });

        collector.on("collect", (r, u) => {
          switch (r.emoji.name) {
            case '✅': {
              if (message.mentions.members.every(member => {
                return msg.reactions.cache.some(react => { return react.emoji.name == '✅' && react.users.cache.get(member.id) })
              })) {
                message.reply("Seu time foi criado")
                collector.stop();
              }
              break;
            }
            case '❌': {
              message.reply(`cancelado por ${u.tag}`);
              msg.reactions.removeAll();
              collector.stop();
              break;
            }
          }
        })

        collector.on("end", collected => {
          if (collected.length > 0) return;

          msg.reactions.removeAll();
          message.reply("acabou o tempo");

        });
      }

      message.channel.send(embed)
        .then(msg => {
          msg.react('✅')
            .then(() => {
              msg.react('❌');
              create(msg)
            })
        });

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
      console.log(`=> ${newError(err, module.exports.config.name, IDs)}`);
    }
  },

  // Configuração do comando
  config: {
    name: "createteam",
    aliases: ["criartime", "newteam"],
    description: "descrição",
    usage: "uso",
    accessableby: "acessibilidade"
  }
}