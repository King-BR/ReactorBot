const Discord = require("discord.js");
const { Users } = require("../../database.js");

module.exports = {
  run: async (client, botUtils, message, args) => {
    if (!message.member.roles.cache.has('755604380295757824')) return message.reply("Você não é um membro STAFF.");

    newError = botUtils.newError;

    try {

      if (isNaN(parseInt(args[1] || args[0]))) return message.reply('Não foi possível identificar a quantia de dinheiro informada.');

      let money = parseInt(args[1] || args[0])
      let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

      Users.findById(user.id, (err, doc) => {
        if (err) {
          console.log("\n=> " + newError(err, module.exports.config.name, { user: user.id, server: message.guild.id, msg: message.id }));
          return;
        }

        if (!doc)  doc = new Users({ _id: user.id });

        try {
          let embedConfirm = new Discord.MessageEmbed()
            .setTitle(`Tem certeza que adicionar ${money}$ ao ${user.displayName || "`desconhecido`"}?`)
            .setDescription("Reaja com ✅ para confirmar.\nReaja com ❌ para cancelar.")
          message.channel.send(embedConfirm).then(msg => {
            msg.react("✅").then(() => {
              msg.react("❌");

              let filter = (reaction, user) => { return (reaction.emoji.name == '✅' || reaction.emoji.name == '❌') && user.id === message.author.id };
              var reactionCollector = msg.createReactionCollector(filter, { time: 30000 });

              reactionCollector.on('collect', (r, u) => {
                msg.reactions.removeAll();
                switch (r.emoji.name) {
                  case "✅": {
                    let embedReset = new Discord.MessageEmbed()
                      .setDescription(`O dinheiro de ${user.displayName || "`desconhecido`"} foi adicionado de ${doc.money} para ${doc.money + money}`);
                      
                    let embedLog = new Discord.MessageEmbed()
                      .setTitle("Dinheiro adicionado!")
                      .setAuthor(message.author.tag,message.author.displayAvatarURL())
                      .setThumbnail(user.user.displayAvatarURL({format:'png',dynamic:true}))
                      .setDescription(`${user.user.tag || "`desconhecido`"} ganhou ${money}$, (${doc.money}$ -> ${doc.money + money}$)`);

                    doc.money += money;
                    doc.save();
                    msg.edit(embedReset);
                    message.guild.channels.cache.get('767982805908324411').send(embedLog);
                    
                    reactionCollector.stop();
                    break;
                  }
                  case "❌": {
                    let embedCancelado = new Discord.MessageEmbed()
                      .setDescription(`Adição do dinheiro de ${user.displayName || "`desconhecido`"}foi cancelada.`);
                    msg.edit(embedCancelado);
                    reactionCollector.stop();
                    break;
                  }
                }
              });
            });
          });
        } catch (err2) {
          let embed = new Discord.MessageEmbed()
            .setTitle("Erro inesperado")
            .setDescription("Um erro inesperado aconteceu. por favor contate os Desenvolvedores do ReactorBot.\n\nUm log foi criado com mais informações do erro.");
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
        .setDescription("Um erro inesperado aconteceu. por favor contate os Desenvolvedores do ReactorBot.\n\nUm log foi criado com mais informações do erro.");
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
    name: "moneyadd",
    noalias: "Sem sinônimos",
    aliases: [],
    description: "Adiciona dinheiro na conta de um membro do servidor.",
    usage: "moneyadd [Membro] <Quantia>",
    accessableby: "STAFF"
  }
}
