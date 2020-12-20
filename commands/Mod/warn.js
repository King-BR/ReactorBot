const Discord = require("discord.js");
const { Users } = require("../../database.js");

module.exports = {
  // Execução do comando
  run: async (client, botUtils, message, args) => {
    if (!message.member.roles.cache.has('755604380295757824')) return message.reply("Você não é um membro STAFF.");

    newError = botUtils.newError;
    try {
      // Codigo do comando
      if (!message.member.hasPermission(["KICK_MEMBERS"])) return message.reply("Você não tem permissão para executar este comando.");
      if(!message.mentions.users.first()) return message.reply("marca alguem pow");

      const user = message.mentions.users.first();
			const channel = message.guild.channels.cache.get('764634049163427840');
      let embed = new Discord.MessageEmbed()
        .setColor('#FFFF00')
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setTitle('Aviso!')
        .setDescription(`${user} levou warn.\n\nMotivo: ${args[1] ? args.slice(1).join(" ") : "Sem razão informada"}`)
        .setThumbnail(user.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }))
        .setTimestamp();
      if (channel) await channel.send(embed);

      Users.findById(user.id, (err, doc) => {
        if (err) {
          let embed = new Discord.MessageEmbed()
            .setTitle("Erro inesperado")
            .setDescription("Um erro inesperado aconteceu. por favor contate os Desenvolvedores do ReactorBot.\n\nUm log foi criado com mais informações do erro.");
          message.channel.send(embed);

          let IDs = {
            server: message.guild.id,
            user: [message.author.id, user.id],
            msg: message.id
          }
          console.log(`=> ${newError(err, module.exports.config.name, IDs)}`);
          return;
        }

        if (!doc) {
          let newUser = new Users({
            _id: user.id
          });

          newUser.warn.quant++;
          newUser.warn.history.push({
            _id: 0,
            reason: args[1] ? args.slice(1).join(" ") : "Sem razão informada"
          });

          newUser.save();
          return;
        }

        try {
          doc.warn.quant++;
          doc.warn.history.push({
            _id: doc.warn.history.length,
            reason: args[1] ? args.slice(1).join(" ") : "Sem razão informada"
          });

          doc.save();
        } catch (err2) {
          let embed = new Discord.MessageEmbed()
            .setTitle("Erro inesperado")
            .setDescription("Um erro inesperado aconteceu. por favor contate os Desenvolvedores do ReactorBot\n\nUm log foi criado com mais informações do erro.");
          message.channel.send(embed);

          let IDs = {
            server: message.guild.id,
            user: [message.author.id, user.id],
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
        user: [message.author.id, user.id],
        msg: message.id
      }
      console.log(`=> ${newError(err, module.exports.config.name, IDs)}`);
    }
  },

  // Configuração do comando
  config: {
    name: "warn",
    noalias: "Sem sinônimos",
    aliases: [],
    description: "Aplique um warn em um membro do servidor.",
    usage: "warn <@membro> [motivo]",
    accessableby: "STAFF"
  }
}
