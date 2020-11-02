const Discord = require("discord.js");

module.exports = {
  // Execução do comando
  run: (client, botUtils, message, args) => {
    newError = botUtils.newError;

    try {
      event = botUtils.jsonPull('./dataBank/mindustryEvent.json');
      let canCreate;

      //Auxilio ao usuario
      if (message.mentions.members.get(message.author.id)) return message.reply('Você não pode se chamar ._');
      if (message.mentions.members.size && event.config.maxTeamSize == 1)  message.reply(`O Evento não permite times`);
      if (message.mentions.members.size+1 > event.config.maxTeamSize)  message.reply(`O Evento não permite times maior que ${event.config.maxTeamSize} pessoas.`);

      //verifica se o dono da mensagem ja esta em um time
      canCreate = !event.teams.some(time => {
        return time.members.some(member => { return message.author.id == member })
      });

      if (!canCreate) return message.reply('Você ja participa de um time');

      //verifica se algum membro da mensagem ja esta em um time
      canCreate = []
      message.mentions.members.each(mentioned => {

        if (event.teams.some(time => {
          return time.members.includes(mentioned.id)
        })) canCreate.push(mentioned.user.tag)

      })

      if (canCreate.length) return message.reply(`Os participantes \`${canCreate.join('`,`')}\` ja participam de algum time`);

      //verifica se o autor da mensagem ja esta em outra confirmação de time
      if (event.memberChanging.includes(message.author.id)) return message.reply(`Você tem um pedido de confirmação de time, primeiro cancele ele para começar outro`);

      //verifica se alguem dos membros ja ta em outra confirmação
      canCreate = []
      message.mentions.members.each(mentioned => {
        if (event.memberChanging.includes(mentioned.id)) canCreate.push(mentioned.user.tag)
      })

      if (canCreate.length) return message.reply(`Os participantes \`${canCreate.join('`,`')}\` precisam ja estam no meio de outra confirmação de time, espere eles terminarem para pedir novamente`);

      event.memberChanging.push(message.author.id)
      message.mentions.members.each(member => {event.memberChanging.push(member.id)})

      botUtils.jsonPush('./dataBank/mindustryEvent.json',event)

      //
      let desc = 'Você deseja msm criar um time ';

      if (message.mentions.members.size) {

        desc += 'com `'

        message.mentions.members.each(member => { desc += member.user.tag + '`,`' })

        desc = desc.slice(0, -3) + '`'

      } else {

        desc += 'sozinho?\n(Você pode adicionar membros depois usando `!teamadd`)'

      }


      let embed = new Discord.MessageEmbed()
        .setTitle("Criando time...")
        .setDescription(desc);

      const changeRemove = () => {
        let ms = event.memberChanging
        ms.splice(ms.indexOf(message.author.id),1)
        message.mentions.members.each(m => {ms.splice(ms.indexOf(m.id),1);});
        botUtils.jsonPush('./dataBank/mindustryEvent.json', event)
      }

      const create = (msg) => {

        var filter = (reaction, user) => {
          return (['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id);
        }

        var collector = msg.createReactionCollector(filter, { time: 15000 });

        collector.on("collect", (r, u) => {
          switch (r.emoji.name) {
            case '✅': {
              if (message.mentions.members.first()) {
                let desc = "Preciso da confirmação de:\n"
                message.mentions.members.each(member => { desc += member.user.tag + '\n' })
                let embed = new Discord.MessageEmbed()
                  .setTitle("Aguardando confirmação...")
                  .setDescription(desc.slice(0, -1));

                message.channel.send(embed)
                  .then(msg => {
                    msg.react('✅')
                      .then(() => {
                        msg.react('❌')
                        confirm(msg)
                      })
                  })
              } else { creatingTeam() }
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
          message.reply("acabou o tempo");

        });
      }

      const confirm = (msg) => {

        var filter = (reaction, user) => {
          return (['✅', '❌'].includes(reaction.emoji.name) && message.mentions.members.some(member => { return member.id === user.id }));
        }

        var collector = msg.createReactionCollector(filter, { time: 60000, dispose: true });

        collector.on("collect", (r, u) => {
          //definindo variaveis embed
          let desc = "Preciso da confirmação de:\n"
          let embed = new Discord.MessageEmbed()
            .setTitle("Aguardando confirmação...")

          //verificando valor
          switch (r.emoji.name) {
            case '✅': {
              message.mentions.members.each(member => { desc += (r.users.cache.get(member.id) ? '✅' : '') + member.user.tag + '\n' })

              embed.setDescription(desc.slice(0, -1));

              msg.edit(embed)
              if (message.mentions.members.every(member => { return r.users.cache.get(member.id) })) {

                creatingTeam()
                msg.reactions.removeAll();
                collector.stop();
              }
              break;
            }
            case '❌': {
              message.mentions.members.each(member => {
                desc += ((u.id == member.id && '❌') || (r.users.cache.get(member.id) ? '✅' : '')) + member.user.tag + '\n' })

              message.reply(`cancelado por ${u.tag}`);
              changeRemove()
              msg.reactions.removeAll();
              collector.stop();
              break;
            }
          }
        })

        collector.on("remove", (r, u) => {
          if (r.emoji.name == '✅') {
            let desc = "Preciso da confirmação de:\n"
            message.mentions.members.each(member => { desc += (r.users.cache.get(member.id) ? '✅' : '') + member.user.tag + '\n' })

            let embed = new Discord.MessageEmbed()
              .setTitle("Aguardando confirmação...")
              .setDescription(desc.slice(0, -1));

            msg.edit(embed)
          }
        })

        collector.on("end", collected => {
          if (collected.size > 0) return;

          changeRemove()
          msg.reactions.removeAll();
          message.reply("acabou o tempo");

        });
      }

      const creatingTeam = () => {

        let team = {};
        team.members = [];
        team.name = "unknown";
        team.points = 0;
        team.id = (new Date()).getTime().toString(36).toUpperCase();

        if (message.mentions.members.size) message.mentions.members.each(member => { team.members.push(member.id) })
        team.members.push(message.author.id);

        event.teams.push(team);
        changeRemove();

        let msg = '';

        team.members.forEach(member => {msg += client.users.cache.get(member).tag + "\n"});

        let embed = new Discord.MessageEmbed()
          .setTitle("Time criado com sucesso")
          .setColor("RANDOM")
          .setDescription(msg)
          .setFooter("ID: "+team.id);
          
        message.channel.send(embed)
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
    name: "criartime",
    aliases: ["createteam", "newteam"],
    description: "descrição",
    usage: "criartime [membro1] [membro2] ...",
    accessableby: "Membros"
  }
}