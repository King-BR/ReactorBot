const Discord = require("discord.js");
const { Users } = require("../../database.js");
const botUtils = require("../../utils.js");

module.exports = {
  // Execução do comando
  run: (client, message, args) => {
    if (!message.member.roles.cache.has('755604380295757824')) return message.reply("Você n é membro da STAFF");
    //if (!botUtils.isDev(message.author.id)) return message.reply("Comando indisponivel por enquanto");

    newError = botUtils.newError;

    try {
      let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

      if(!user && args[0]) {
        user = args[0];
      } else {
        user = user.id;
      }

      Users.findById(user, (err, doc) => {
        if (err) {
          console.log("\n=> " + newError(err, module.exports.config.name, { user: user.id, server: message.guild.id, msg: message.id }));
          return;
        }

        if (!doc)  doc = new Users({ _id: user.id });

        try {
          let embedConfirm = new Discord.MessageEmbed()
            .setTitle(`Tem certeza que quer resetar o dinheiro de ${user.displayName || "`desconhecido`"}?`)
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
                      doc.money = 0;
                      doc.save();

                      let embedReset = new Discord.MessageEmbed()
                        .setDescription(`Dinheiro de ${user.displayName || "`desconhecido`"} foi resetado`);
                      let embedLog = new Discord.MessageEmbed()
                      .setTitle("Dinheiro resetado")
                      .setAuthor(message.author.tag,message.author.displayAvatarURL())
                      .setThumbnail(user.user.displayAvatarURL({format:'png',dynamic:true}) || "")
                      .setDescription(`${user.user.tag || "`desconhecido`"} resetou o seu dinheiro (${doc.money}$)`);

                      msg.edit(embedReset);
                      message.guild.channels.cache.get('767982805908324411').send(embedLog);
                      reactionCollector.stop();
                      break;
                    }
                    case "❌": {
                      let embedCancelado = new Discord.MessageEmbed()
                        .setDescription(`Reset do dinheiro de ${user.displayName || "`desconhecido`"} cancelado`);
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
    name: "moneyreset",
    noalias: "Sem sinonimos",
    aliases: [],
    description: "Retira todo o dinheiro de tal membro",
    usage: "moneyreset [Membro]",
    accessableby: "STAFF"
  }
}