const fs = require('fs');
const Discord = require('discord.js');
const { Users } = require("../../database.js");

module.exports = {
  run: async (client, botUtils, message, args) => {
    newError = botUtils.newError;

    try {
      return;
      //return message.reply('ainda em progresso...');
      let money = parseInt(args.pop());

      if (isNaN(money) || money < 1) return message.reply('Escolha um numero positivo, que não seja zero para apostar')

      let belters = []
      const win = (winner, belters, quantia) => {
        belters.forEach(u => {
          Users.findById(u.id, (errDB, doc) => {
            if (errDB) {
              console.log(`=> ${newError(errDB, "apostar")}`);
              return;
            }

            try {
              doc.money += quanti * (u == winner ? 1 : -1);

              doc.levelSystem.xp += 5;
              doc.levelSystem.txp += 5;

              doc.save();
            } catch (err) {
              console.log(`=> ${newError(err, "apostar")}`);
            }
          });
        })
      }

      if (args[0] == '*') {

        let embed = new Discord.MessageEmbed()
          .setTitle(`Apostando ${money}`)
          .setDescription('reaja com ✅ para participar');

      } else if (message.mentions.members.size) {

        belters = message.mentions.members.array()
        belters.push(message.member)
        belters = belters.filter((u1, i) => i == belters.findIndex(u2 => u1.id == u2.id))
        belters = belters.map(u => u.id)
        belters = belters.forEach(u => {
          Users.findById(u.id, (errDB, doc) => {
            if (errDB) {
              console.log(`=> ${newError(errDB, "apostar")}`);
              return;
            } try {

              

            } catch (err) {
              console.log(`=> ${newError(err, "apostar")}`);
            }
          });})


        var filter = (reaction, user) => '✅' == reaction.emoji.name && !user.bot;
        var collector = msg.createReactionCollector(filter, { time: 60000 });

        collector.on("collect", (r, u) => {



        })

        collector.on("end", collected => {
          message.reply("acabou o tempo");

        });

      } else {
        return message.reply('Você precisa marcar alguem para apostar, ou escreva `*` para apostar com todos')
      }

      message.channel.send(belters.join('\n'))

    } catch (err) {
      let embed = new Discord.MessageEmbed()
        .setTitle('Erro inesperado')
        .setDescription(
          'Um erro inesperado aconteceu. por favor contate os ADMs\n\nUm log foi criado com mais informações do erro'
        );
      message.channel.send(embed);

      let IDs = {
        server: message.guild.id,
        user: message.author.id,
        msg: message.id
      };
      console.log(`=> ${newError(err, module.exports.config.name, IDs)}`);
    }
  },

  config: {
    name: 'apostar',
    aliases: [],
    description: 'Aposta uma quantia com alguem ou msm com varias pessoas',
    usage: 'apostar <valor> <membro1/all> [membro2] [membro3] ...',
    accessableby: 'Membros'
  }
};
