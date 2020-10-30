const Discord = require("discord.js");
const { Users } = require("../../database.js");

module.exports = {
  // Execução do comando
  run: async (client, botUtils, message, args) => {
    if (!message.member.roles.cache.has('755604380295757824')) return message.reply("Você n é membro da STAFF");

    newError = botUtils.newError;
    try {
      // Codigo do comando
      if (!message.member.hasPermission("KICK_MEMBERS", "BAN_MEMBERS", "ADMINISTRATOR")) return message.reply("Você não tem permissão para isso");
      const user = message.mentions.users.first();
      const channel = message.guild.channels.cache.find(ch => ch.id === '764634049163427840');
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
            .setDescription("Um erro inesperado aconteceu. por favor contate os ADMs\n\nUm log foi criado com mais informações do erro");
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
        }

        try {
          doc.warn.quant++;
          doc.warn.history.push({
            _id: 0,
            reason: args[1] ? args.slice(1).join(" ") : "Sem razão informada"
          });

          doc.save();
        } catch (err2) {
          let embed = new Discord.MessageEmbed()
            .setTitle("Erro inesperado")
            .setDescription("Um erro inesperado aconteceu. por favor contate os ADMs\n\nUm log foi criado com mais informações do erro");
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
        .setDescription("Um erro inesperado aconteceu. por favor contate os ADMs\n\nUm log foi criado com mais informações do erro");
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
    noalias: "Sem sinonimos",
    aliases: [],
    description: "De um warn para um membro do server",
    usage: "warn <@member> [motivo]",
    accessableby: "STAFF"
  }
}