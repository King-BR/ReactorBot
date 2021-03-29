const Discord = require("discord.js");
const { Users } = require("../../database.js");
const botUtils = require("../../utils.js");

module.exports = {
  // Execução do comando
  run: (client, message, args) => {
    newError = botUtils.newError;

    //if (!botUtils.isDev(message.author.id) && !botUtils.isTester(message.author.id)) return message.channel.send("Comando em manutenção")

    try {
      if (args[0] && args[0].toLowerCase() == "records") {
        let records = Object.entries(botUtils.jsonPull("dataBank/serverState.json").hanoiRecords)
          .sort((a, b) => a[0] - b[0]);
        return botUtils.createPage(message.channel, records.length, (p) => {
          let tempo = records[p - 1][1].time;
          let embed = new Discord.MessageEmbed()
            .setTitle(`${p}/${records.length} Recordes do hanoi`)
            .setColor("#FFFF00")
            .addField("Quantidade", records[p - 1][0])
            .addField("Membro", client.users.cache.get(records[p - 1][1].user) || records[p - 1][1].user)
            .addField("Movimentos", records[p - 1][1].moves)
            .addField("Tempo", (tempo > 60000 ? Math.floor(tempo / 60000) + ":" + Math.floor(tempo % 60000 / 1000).toString().padStart(2, "0") : Math.floor(tempo % 60000 / 1000).toString()) + "." + (tempo % 1000).toString().padStart(3, "0"))
            .addField("Tempo (ms)", tempo);
          return embed;
        });
      }

      if (!args[0]) args[0] = 5;
      if (isNaN(args[0]) || !Number.isInteger(Number(args[0]))) return message.channel.send("numero invalido");
      if (args[0] < 3) return message.channel.send("Quantidade minima: 3");
      if (args[0] > 11) return message.channel.send("Quantidade máxima: 11");

      let recompensa = {
        money: Math.floor((Math.pow(2.1, args[0]) - 1) * 0.6),
        xp: Math.floor((Math.pow(2.1, args[0]) - 1) / 3) * 2 + Math.floor((Math.pow(2.1, args[0]) - 1) / 4)
      }

      //message.channel.send(JSON.stringify(recompensa, null, 2));

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
        "10": "<:blank:780544005229641750>🔟",
        "11": "<:blank:780544005229641750>⏸️"
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
        .setDescription(`Quantidade minima de movimentos: ${minMoves}\n\nMovimentos: 0`)
        .setColor("RANDOM")
        .setTimestamp(new Date().getTime());

      for (i = 0; i < hanoi.length; i++) {
        let str = "";
        for (let j = 0; j < args[0]; j++) {
          str += pieces[hanoi[i][j]] + "\n";
        }
        embed.addField(`Torre ${torre[i]}`, `${str}`, true);
      }

      message.channel.send(embed).then(async msg => {
        msg = new botUtils.fastEditMessage(msg)

        await msg.message.react("🇦");
        await msg.message.react("🇧");
        await msg.message.react("🇨");

        let filter = (r, u) => ((r.emoji.name == "🇦" || r.emoji.name == "🇧" || r.emoji.name == "🇨") && u.id == message.author.id);

        startTime = new Date().getTime();
        var collector = msg.message.createReactionCollector(filter, { idle: 1000 * 60 * 5, dispose: true });
        let moveFrom = null;

        var run = function(r, u) {
          if (moveFrom == null) {
            moveFrom = ["🇦", "🇧", "🇨"].indexOf(r.emoji.name);

            if (hanoi[moveFrom].findIndex(v => v > 0) < 0) return;

            let embed2 = new Discord.MessageEmbed()
              .setTitle("Torres de hanoi")
              .setDescription(`Quantidade minima de movimentos: ${minMoves}\n\nMovimentos: ${quantMoves}`)
              .setColor("RANDOM")
              .setTimestamp(startTime);

            for (i = 0; i < hanoi.length; i++) {
              let str = hanoi[i].map(v => pieces[v]).join("\n");
              embed2.addField(`Torre ${torre[i]}${moveFrom == i ? " <=" : ""}`, `${str}`, true);
            }

            msg.edit(embed2);

          } else {

            let towerChosed = ["🇦", "🇧", "🇨"].indexOf(r.emoji.name);
            if (moveFrom != towerChosed) {

              let pieceChosed = hanoi[moveFrom].filter(e => e != 0)[0];
              let moveTo = hanoi[towerChosed].filter(e => e == 0).length - 1

              if (pieceChosed < (hanoi[towerChosed][moveTo + 1] || Number.POSITIVE_INFINITY)) {
                hanoi[towerChosed][moveTo] = pieceChosed;
                hanoi[moveFrom][hanoi[moveFrom].indexOf(pieceChosed)] = 0;
                quantMoves++;
              }
            }
            moveFrom = null;

            if (!hanoi[2].includes(0)) {
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
        }

        collector.on("collect", run);
        collector.on("remove", run);

        collector.on("end", () => {
          msg.message.reactions.removeAll();

          if (hanoi[2].includes(0)) return;
          let endTime = new Date().getTime() - startTime;

          botUtils.jsonChange("dataBank/serverState.json", (server) => {
            if (!server.hanoiRecords[args[0]] || server.hanoiRecords[args[0]].moves >= quantMoves && server.hanoiRecords[args[0]].time > endTime) {
              if (server.hanoiRecords[args[0]]) {
                message.channel.send(`> !! Um novo record no hanoi ${args[0]} foi alcançado !!\n> movimentos: ${server.hanoiRecords[args[0]].moves} => ${quantMoves}\n> tempo: ${server.hanoiRecords[args[0]].time} => ${endTime})`)
              } else {
                message.channel.send(`> !! A primeira jogada completa no hanoi ${args[0]} foi registrada !!`)
              }

              server.hanoiRecords[args[0]] = {
                user: message.author.id,
                moves: quantMoves,
                time: endTime
              };
              return server;
            }
          }, true)

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

            if (!doc) doc = new Users({ _id: message.author.id });

            if (quantMoves != minMoves) {
              recompensa = {
                money: Math.ceil(recompensa.money * Math.pow(2, (minMoves - quantMoves) / minMoves)),
                xp: Math.ceil(recompensa.xp * Math.pow(2, (minMoves - quantMoves) / minMoves))
              }

              if (recompensa.money < 1) recompensa.money = 0;
              if (recompensa.xp < 1) recompensa.xp = 0;
            }

            doc.money += recompensa.money;
            doc.txp += recompensa.xp;
            doc.save();

            let embed3 = new Discord.MessageEmbed()
              .setTitle("Torres de hanoi")
              .setDescription(`Quantidade minima de movimentos: ${minMoves}\n\nMovimentos: \`${quantMoves}\`\nResolvido em: \`${Math.floor(endTime / 60000)}:${Math.floor(endTime / 1000 % 60).toString().padStart(2, '0')}.${(endTime % 1000).toString().padStart(3,"0")}\`\n\n**Recompensas:**\n$${recompensa.money}\n${recompensa.xp} xp`)
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