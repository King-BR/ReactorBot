const Discord = require("discord.js");
const { Users, Clans } = require("../../database.js");
const botUtils = require("../../utils.js");

module.exports = {
  // Execução do comando
  run: (client, message, args) => {

    try {

      shuffle = (array) => {
        let res = []
        for (let i = array.length - 1; i >= 0; i--) {
          res.push(array.splice(Math.floor(Math.random() * (i + 1)), 1)[0]);
        }
        return res
      }
      artmsg = (ar) => {
        let larr = []
        for (let i = 0; i < 4; i++) {
          larr.push(ar.slice(i * 4, (i + 1) * 4).map(t => t.toString().padStart(2, ' ')).join(' '))
        }
        let c = Math.min(ar.filter((n, i) => n == i + 1).filter((n, i) => n == i + 1).length / ar.length, 1)
        let embed = new Discord.MessageEmbed()
          .setColor('#' + Math.floor(c * 255).toString(16).padStart(2, "0").repeat(3))
          .setDescription(`\`\`\`${larr.join('\n').replace(16, '[]')}\`\`\``);
        return embed
      }
      swap = (arr, x, y) => {
        let b = arr[x];
        arr[x] = arr[y];
        arr[y] = b;
        return arr;
      }

      let arr;
      let trys;

      do {

        arr = shuffle(Array.from({ length: 16 }, (_, i) => i + 1));
        let p = arr.indexOf(arr.length);
        swap(arr, p, arr.length - 1)
        trys = 0;
        let clone = arr.join(' ').split(' ');

        while (!clone.every((n, i) => {
          if (n == i + 1) return true;

          let pos = clone.indexOf(i + 1 + '');
          swap(clone, i, pos);
          trys++;

        })) { }
      } while (trys % 2)

      message.channel.send(artmsg(arr)).then(msg => {
        msg.react('⬅️')
          .then(() => msg.react('⬆️'))
          .then(() => msg.react('⬇️'))
          .then(() => msg.react('➡️'))
          .then(() => {

            stime = new Date().getTime()
            const filter = (reaction, user) => {
              return ['⬅️', '⬆️', '⬇️', '➡️'].includes(reaction.emoji.name) && user.id == message.author.id
            };
            let moves = []
            const run = (r, u) => {
              let pos = arr.indexOf(16)
              switch (r.emoji.toString()) {
                case '⬅️': {
                  if (!(pos % 4)) return;
                  swap(arr, pos - 1, pos)
                  moves.push(0)
                  break
                }
                case '⬆️': {
                  if (pos < 4) return;
                  swap(arr, pos - 4, pos)
                  moves.push(1)
                  break
                }
                case '⬇️': {
                  if (pos >= 12) return;
                  swap(arr, pos + 4, pos)
                  moves.push(2)
                  break
                }
                case '➡️': {
                  if (pos % 4 == 3) return;
                  swap(arr, pos + 1, pos)
                  moves.push(3)
                  break
                }
              }
              msg.edit(artmsg(arr))
              if (arr.every((s, i) => s == i + 1)) {
                let t = new Date().getTime() - stime
                message.reply(`Parabens\nFoi adicionado $10 na sua conta e 50xp\nSuas estatisticas:\nTempo:\`${Math.floor(t / 60000)}:${Math.floor(t / 1000 % 60).toString().padStart(2,'0')}\nMovimentos:\`${moves.length}\``)


                newError = botUtils.newError;

                Users.findById(message.author.id, (errDB, doc) => {
                  // Caso aconteça um erro na database
                  if (errDB) {
                    console.log(`=> ${newError(errDB, "fifteen")}`);
                    return;
                  }

                  // Caso não exista usuario com esse id na database
                  if (!doc)  doc = new Users({ _id: message.author.id });

                  try {

                    // Add 10 de dinheiro para o usuario
                    doc.money += 10;

                    // Add 50 de xp para o usuario
                    doc.txp += 50;

                    doc.save();
                  } catch (err) {
                    // Handler de erros
                    console.log(`=> ${newError(err, "fifteen")}`);
                  }
                });

                return collector.stop();
              };
            }

            let collector = msg.createReactionCollector(filter, { idle: 60000, dispose: true });

            collector.on("collect", (r, u) => {
              run(r, u)
            })

            collector.on("remove", (r, u) => {
              run(r, u)
            })

            collector.on("end", collected => {
              //console.log('cabo');
              msg.reactions.removeAll();
            });
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
      console.log(`=> ${newError(err, "fifteen", IDs)}`);
    }
  },

  config: {
    name: "fifteen",
    noalias: "Sem sinonimos",
    aliases: ['15'],
    description: "Tente solucionar o puzzle fifteen",
    usage: "fifteen",
    accessableby: "Membro"
  }

}