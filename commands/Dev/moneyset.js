const fs = require("fs");
const Discord = require("discord.js");

module.exports = {
  run: async (client, botUtils, message, args) => {
    if (!botUtils.isDev(message.author.id)) return message.channel.send("Voce não tem permissão para executar esse comando")

    newError = botUtils.newError;

    try {

      if (isNaN(parseInt(args[1] || args[0]))) return message.reply('Não foi possivel indentificar a quantia de dinheiro a se informar');

      let money = isNaN(parseInt(args[1] || args[0]));
      let user = message.mentions.users[0] || message.author;

      Users.findById(user.id, (err, doc) => {
        if (err) {
          console.log("\n=> " + newError(err, module.exports.config.name, { user: user.id, server: message.guild.id, msg: message.id }));
          return;
        }

        if (!doc) {
          let newUser = new Users({ _id: user.id });
          newUser.save();

          message.channel.send("tente novamente");
          return;
        }

        try {
          let embedConfirm = new Discord.MessageEmbed()
            .setTitle(`Tem certeza que quer setar o dinheiro de ${user.tag || "`desconhecido`"}?`)
            .setDescription("Reaja com ✅ para confirmar\nReaja com ❌ para cancelar")
          message.channel.send(embedConfirm).then(msg => {
            msg.react("✅").then(() => {
              msg.react("❌");

              let filter = (reaction, user) => { return (reaction.emoji.name == '✅' || reaction.emoji.name == '❌') && user.id === message.author.id };
              var reactionCollector = msg.createReactionCollector(filter, { time: 30000 });

              reactionCollector.on('collect', (r, u) => {
                try {
                  msg.reactions.removeAll();
                  switch (r.emoji.name) {
                    case "✅": {
                      doc.money = money;
                      doc.save();

                      let embedReset = new Discord.MessageEmbed()
                        .setDescription(`Dinheiro de ${user.tag || "`desconhecido`"} foi setado`);
                      msg.edit(embedReset);
                      reactionCollector.stop();
                      break;
                    }
                    case "❌": {
                      let embedCancelado = new Discord.MessageEmbed()
                        .setDescription(`Set do dinheiro de ${user.tag || "`desconhecido`"} cancelado`);
                      msg.edit(embedCancelado);
                      reactionCollector.stop();
                      break;
                    }
                  }

                } catch (err3) {
                  let embed = new Discord.MessageEmbed()
                    .setTitle("Erro inesperado")
                    .setDescription("Um erro inesperado aconteceu. por favor contate os ADMs\n\nUm log foi criado com mais informações do erro");
                  message.channel.send(embed);

                  let IDs = {
                    server: message.guild.id,
                    user: message.author.id,
                    msg: message.id
                  }
                  console.log(`=> ${newError(err3, module.exports.config.name, IDs)}`);
                }
              });
            });
          });
        } catch (err2) {
          let embed = new Discord.MessageEmbed()
            .setTitle("Erro inesperado")
            .setDescription("Um erro inesperado aconteceu. por favor contate os ADMs\n\nUm log foi criado com mais informações do erro");
          message.channel.send(embed);

          let IDs = {
            server: message.guild.id,
            user: message.author.id,
            msg: message.id
          }
          console.log(`=> ${newError(err2, module.exports.config.name, IDs)}`);
        }
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
    name: "moneyset",
    noalias: "Sem sinonimos",
    aliases: [],
    description: "Define a quantidade dinheiro que tal membro possui",
    usage: "moneyset [Membro] <Quantia>",
    accessableby: "Desenvolvedores"
  }
}