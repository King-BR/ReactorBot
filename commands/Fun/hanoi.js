const Discord = require("discord.js");
const { Users } = require("../../database.js");

module.exports = {
  // Execução do comando
  run: (client, botUtils, message, args) => {
    newError = botUtils.newError;

    //if (!botUtils.isDev(message.author.id) && !botUtils.isTester(message.author.id)) return message.channel.send("Comando em manutenção")

    try {
      if (isNaN(args[0]) || !Number.isInteger(Number(args[0]))) return message.channel.send("numero invalido");
      if (!args[0]) args[0] = 5;
      if (args[0] < 3) return message.channel.send("Quantidade minima: 3");
      if (args[0] > 10) return message.channel.send("Quantidade máxima: 10");

      let recompensa = {
        "3": {
          money: 3,
          xp: 10
        },
        "4": {
          money: 5,
          xp: 15
        },
        "5": {
          money: 8,
          xp: 25
        },
        "6": {
          money: 15,
          xp: 50
        },
        "7": {
          money: 20,
          xp: 70
        },
        "8": {
          money: 30,
          xp: 90
        },
        "9": {
          money: 50,
          xp: 120
        },
        "10": {
          money: 80,
          xp: 200
        }
      }

      let pieces = {
        "0": "\u200b",
        "1": "<:blank:780544005229641750>1⃣",
        "2": "<:blank:780544005229641750>2⃣",
        "3": "<:blank:780544005229641750>3⃣",
        "4": "<:blank:780544005229641750>4⃣",
        "5": "<:blank:780544005229641750>5⃣",
        "6": "<:blank:780544005229641750>6⃣",
        "7": "<:blank:780544005229641750>7⃣",
        "8": "<:blank:780544005229641750>8⃣",
        "9": "<:blank:780544005229641750>9⃣",
        "10": "<:blank:780544005229641750>🔟"
      }

      let torre = {
        "0": "A",
        "1": "B",
        "2": "C"
      }

      var hanoi = [[], [], []];

      for (let i = 0; i < args[0]; i++) {
        hanoi[0][i] = i + 1;
        hanoi[1][i] = 0;
        hanoi[2][i] = 0;
      }

      let minMoves = Math.pow(2, args[0]) - 1;
      let quantMoves = 0;
      let startTime = new Date().getTime();

      let embed = new Discord.MessageEmbed()
        .setTitle("Torres de hanoi")
        .setDescription(`Quantidade minima de movimentos: ${minMoves}`)
        .setColor("RANDOM")
        .setTimestamp(startTime);

      for (i = 0; i < hanoi.length; i++) {
        let str = "";
        for (let j = 0; j < args[0]; j++) {
          str += pieces[hanoi[i][j]] + "\n";
        }
        embed.addField(`Torre ${torre[i]}`, `${str}`, true);
      }

      message.channel.send(embed).then(async msg => {
        await msg.react("🇦");
        await msg.react("🇧");
        await msg.react("🇨");

        let filter = (r, u) => ((r.emoji.name == "🇦" || r.emoji.name == "🇧" || r.emoji.name == "🇨") && u.id == message.author.id);

        var collector = msg.createReactionCollector(filter);

        let moveFrom = null;
        collector.on("collect", (r, u) => {
          msg.reactions.cache.find(re => re.emoji.name == r.emoji.name).users.remove(message.author);

          if (moveFrom == null) {
            switch (r.emoji.name) {
              case "🇦": {
                moveFrom = 0;
                break;
              }
              case "🇧": {
                moveFrom = 1;
                break;
              }
              case "🇨": {
                moveFrom = 2;
                break;
              }
            }
          } else {
            let pieceChosed = hanoi[moveFrom].filter(e => e != 0)[0];
            switch (r.emoji.name) {
              case "🇦": {
                if (moveFrom == 0) break;

                let moveTo = hanoi[0].filter(e => e == 0).length - 1

                if (hanoi[moveFrom].indexOf(pieceChosed) != -1) {
                  if (hanoi[0][moveTo + 1] == null || hanoi[moveFrom][hanoi[moveFrom].indexOf(pieceChosed)] < hanoi[0][moveTo + 1]) {
                    hanoi[0][moveTo] = pieceChosed;
                    hanoi[moveFrom][hanoi[moveFrom].indexOf(pieceChosed)] = 0;
                    quantMoves++;
                  }
                }
                break;
              }
              case "🇧": {
                if (moveFrom == 1) break;

                let moveTo = hanoi[1].filter(e => e == 0).length - 1

                if (hanoi[moveFrom].indexOf(pieceChosed) != -1) {
                  if (hanoi[1][moveTo + 1] == null || hanoi[moveFrom][hanoi[moveFrom].indexOf(pieceChosed)] < hanoi[1][moveTo + 1]) {
                    hanoi[1][moveTo] = pieceChosed;
                    hanoi[moveFrom][hanoi[moveFrom].indexOf(pieceChosed)] = 0;
                    quantMoves++;
                  }
                }
                break;
              }
              case "🇨": {
                if (moveFrom == 2) break;

                let moveTo = hanoi[2].filter(e => e == 0).length - 1

                if (hanoi[moveFrom].indexOf(pieceChosed) != -1) {
                  if (hanoi[2][moveTo + 1] == null || hanoi[moveFrom][hanoi[moveFrom].indexOf(pieceChosed)] < hanoi[2][moveTo + 1]) {
                    hanoi[2][moveTo] = pieceChosed;
                    hanoi[moveFrom][hanoi[moveFrom].indexOf(pieceChosed)] = 0;
                    quantMoves++;
                  }
                }
                break;
              }
            }
            moveFrom = null;

            if (hanoi[2].filter(e => e != 0).length == args[0]) {
              collector.stop();

            } else {
              let embed2 = new Discord.MessageEmbed()
                .setTitle("Torres de hanoi")
                .setDescription(`Quantidade minima de movimentos: ${minMoves}\n\nMovimentos: ${quantMoves}`)
                .setColor("RANDOM")
                .setTimestamp(startTime);

              for (i = 0; i < hanoi.length; i++) {
                let str = "";
                for (let j = 0; j < args[0]; j++) {
                  str += pieces[hanoi[i][j]] + "\n";
                }
                embed2.addField(`Torre ${torre[i]}`, `${str}`, true);
              }

              msg.edit(embed2);
            }
          }
        });

        collector.on("end", () => {
          let endTime = new Date().getTime() - startTime;

          Users.findById(message.author.id, (err, doc) => {
            if (err) {
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
              return;
            }

            if(!doc) {
              doc = new Users({
                _id: message.author.id
              });
            }

            doc.money += recompensa[args[0]].money;
            doc.levelSystem.txp += recompensa[args[0]].xp;
            doc.levelSystem.xp += recompensa[args[0]].xp;

            doc.save();

            let embed3 = new Discord.MessageEmbed()
              .setTitle("Torres de hanoi")
              .setDescription(`Quantidade minima de movimentos: ${minMoves}\n\nMovimentos: \`${quantMoves}\`\nResolvido em: \`${Math.floor(endTime / 60000)}:${Math.floor(endTime / 1000 % 60).toString().padStart(2, '0')}\`\n\n**Recompensas:**\n$${recompensa[args[0]].money}\n${recompensa[args[0]].xp} xp`)
              .setColor("RANDOM")
              .setTimestamp();

            for (i = 0; i < hanoi.length; i++) {
              let str = "";
              for (let j = 0; j < args[0]; j++) {
                str += pieces[hanoi[i][j]] + "\n";
              }
              embed3.addField(`Torre ${torre[i]}`, `${str}`, true);
            }

            msg.edit(embed3);
          });
        });
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

  config: {
    name: "hanoi",
    aliases: ["hanoitower"],
    description: "Tente solucionar o puzzle torres de hanoi",
    usage: "hanoi [quantidade de peças]",
    accessableby: "Membros"
  }
}