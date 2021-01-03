const fs = require('fs');
const Discord = require('discord.js');
const { Users } = require("../../database.js");
const botUtils = require("../../utils.js");

module.exports = {
  // Execução do comando
  run: (client, message, args) => {
    newError = botUtils.newError;

    try {
      //return message.reply('ainda em progresso...');
      let money = parseInt(args.pop());

      if (isNaN(money) || money < 1) return message.reply('Escolha um numero positivo, que não seja zero para apostar')

      let belters = []
      const win = (channel, winner, belters, quantia) => {

        channel.send({ embed: { title: "O Vencedor foi...", description: "---[3]---" } }).then(msg => {
          const wait = (step) => {
            botUtils.sleep(2000).then(() => {
              if (step > 0) {
                step--;
                msg.edit({ embed: { title: "O Vencedor foi...", description: `${'-'.repeat(step)}${'='.repeat(3 - step)}[${step}]${'='.repeat(3 - step)}${'-'.repeat(step)}` } })
                wait(step)
              } else {
                let changes = []

                belters.forEach(u => {
                  Users.findById(u, (errDB, doc) => {
                    if (errDB) {
                      console.log(`=> ${newError(errDB, "apostar")}`);
                      return;
                    }

                    try {

                      let oriMoney = doc.money;
                      doc.money += quantia * (u == winner ? belters.length - 1 : -1);
                      changes.push(`${client.users.cache.get(u).tag} (${oriMoney}$ => ${doc.money}$)`);

                      doc.levelSystem.xp += 5;
                      doc.levelSystem.txp += 5;
                      doc.save();

                      if (changes.length == belters.length)
                        msg.edit({ embed: { title: "O Vencedor foi...", description: `Já foi transferido ${quantia}$ de todos os apostadores para ${client.users.cache.get(winner).tag}\n\n${changes.join('\n')}` } })
                    } catch (err) {
                      console.log(`=> ${newError(err, "apostar")}`);
                    }
                  });
                })
              }
            })
          }
          wait(3)
        })
      }

      if (args[0] == '*asdfasdfxca342343er3245 vfeafae') {

        let embed = new Discord.MessageEmbed()
          .setTitle(`Apostando ${money}`)
          .setDescription('reaja com ✅ para participar');

      } else {

        let outmoney = []

        belters = message.mentions.members.filter(u => !u.user.bot).array()
        belters.push(message.member)
        belters = belters.filter((u1, i) => i == belters.findIndex(u2 => u1.id == u2.id))
        belters = belters.map(u => u.id)

        let moneyVerify = []

        belters.forEach(u => {
          Users.findById(u, (errDB, doc) => {
            if (errDB) {
              console.log(`=> ${newError(errDB, "apostar")}`);
              return;
            } try {

              if (!doc || doc.money < money) outmoney.push(u)
              moneyVerify.push(u)

              if (moneyVerify.length == belters.length) {

                if (outmoney.length) {
                  
                  message.reply('Os seguintes participantes não possuem dinheiro suficiente:\n' + outmoney.map(id => client.users.cache.get(id).tag).join('\n'))
                
                } else if (belters.length == 1) {
                  
                  message.reply('Você precisa marcar alguem para apostar, ou escreva `*` para apostar com todos')
                
                } else {

                  let embed = new Discord.MessageEmbed()
                    .setTitle(`Apostando ${money}$`)
                    .setDescription('preciso que os participantes marquem ✅ para participar.\n' + belters.map(id => client.users.cache.get(id).tag).join('\n'));
                  message.channel.send(embed).then(msg => {
                    msg.react('✅')

                    let accepted = []
                    var filter = (reaction, user) => '✅' == reaction.emoji.name && belters.indexOf(user.id) >= 0 && !user.bot;
                    var collector = msg.createReactionCollector(filter, { time: 60000 });

                    collector.on("collect", (r, u) => {
                      if (!accepted.includes(u.id)) {
                        accepted.push(u.id)

                        msg.edit({ embed: { title: `Apostando ${money}$`, description: 'preciso que os participantes marquem ✅ para participar.\n' + belters.map(id => (accepted.includes(id) ? '✅' : '') + client.users.cache.get(id).tag).join('\n') } })

                        if (accepted.length == belters.length) {
                          collector.stop()
                        }
                      }
                    })

                    collector.on("end", collected => {
                      msg.reactions.removeAll()
                      if (belters.some(u => !accepted.includes(u))) {
                        msg.edit({ embed: { title: `Aposta de ${money}$ Terminada`, description: "Faltou a participação dos membros:\n" + belters.filter(b => !accepted.includes(b)).map(id => client.users.cache.get(id).tag).join('\n') } })
                      } else {
                        
                        let numb = Math.random() * belters.length
                        //console.log('['+belters.join(',')+']:'+numb)
                        let winId = belters[Math.floor(numb)]
                        win(msg.channel, winId, belters, money)

                      }
                    });
                  });

                }
              }

            } catch (err) {
              console.log(`=> ${newError(err, "apostar")}`);
            }
          })
        })

      }

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
