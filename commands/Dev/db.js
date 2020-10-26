const Discord = require("discord.js");
const { Users } = require("../../database.js");

module.exports = {
  // Execução do comando
  run: (client, botUtils, message, args) => {
    if (!botUtils.isDev(message.author.id)) return message.channel.send("Voce não tem permissão para executar esse comando");

    newError = botUtils.newError;

    try {
      let user = message.mentions.users[0] || client.users.cache.get(args[0]) || message.author;

      Users.findById(user.id, (err, doc) => {
        if (err) {
          console.log("\n=> " + newError(err, "db", {user: user.id, server: message.guild.id, msg: message.id}));
          return;
        }

        if (!doc) {
          let newUser = new Users({ _id: user.id });
          newUser.save();

          message.channel.send("tente novamente");
          return;
        }

        let embed = new Discord.MessageEmbed()
          .setTitle(user.tag)
          .setDescription(`\`\`\`json\n${JSON.stringify(doc, null, 2)}\n\`\`\``)
        message.channel.send(embed);
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

  // Configuração do comando
  config: {
    name: "db",
    noalias: "Sem sinonimos",
    aliases: [],
    description: "Cheque as informações na database",
    usage: "db [@usuario ou ID]",
    accessableby: "Desenvolvedores"
  }
}