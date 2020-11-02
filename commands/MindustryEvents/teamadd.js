const Discord = require("discord.js");

module.exports = {
  // Execução do comando
  run: (client, botUtils, message, args) => {
    newError = botUtils.newError;

    try {
      event = botUtils.jsonPull('./dataBank/mindustryEvent.json');
      time = event.teams.find(team => {return team.members.some(member => {return member == message.author.id})});
      let canCreate;

      //Auxilio ao usuario
      if (!time) return message.reply('Você nem tem time krl');
      if (!message.mentions.members.size) return message.reply('Você precisa adicionar alguem');
      if (message.mentions.members.some(m => {return m.id === message.author.id})) return message.reply('Você não pode se chamar');
      if (event.config.maxTeamSize == 1) return message.reply(`O Evento não permite times`);
      if (message.mentions.members.size+time.members.length > event.config.maxTeamSize) return message.reply(`O Evento não permite times maior que ${event.config.maxTeamSize} pessoas.`);

      //verifica se algum membro da mensagem ja esta em um time
      canCreate = []
      message.mentions.members.each(mentioned => {

        if (event.teams.some(time => {
          return time.members.some(member => { return mentioned.id == member })
        })) canCreate.push(mentioned.user.tag)

      })

      if (canCreate.length) return message.reply(`Os participantes \`${canCreate.join('`,`')}\` ja participam de algum time`);

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

          msg.reactions.removeAll();
          message.reply("acabou o tempo");

        });
      }

      const creatingTeam = () => {

        let index = event.teams.findIndex(t => {t.id == team.id})

        message.mentions.member.each(member=> {event.teams[index].members.push(member.id)})
        botUtils.jsonPush('./dataBank/mindustryEvent.json', event)

        let msg = ''

        team.members.forEach(member => {msg += client.users.cache.get(member).tag + "\n"});

        let embed = new Discord.MessageEmbed()
          .setTitle("Membro adicionado com sucesso")
          .setColor("RANDOM")
          .setDescription(msg)
          .setFooter("ID: "+team.id);
          
        message.channel.send(embed)
      }
      
      let desc = 'Preciso da cofirmação de:\n'
      message.mentions.members.each(m => {desc += m.user.tag + '\n'})
      let embed = new Discord.MessageEmbed()
        .setTitle("Aguardando confirmação")
        .setDescription(desc);
      message.channel.send(embed)
        .then(msg => {
          msg.react('✅')
            .then(() => {
              msg.react('❌');
              confirm(msg)
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
    name: "teamadd",
    aliases: [],
    description: "descrição",
    usage: "teamadd [membro1] [membro2] ...",
    accessableby: "Membros"
  }
}