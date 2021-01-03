const Discord = require("discord.js");
const { Users } = require("../../database.js");
const botUtils = require("../../utils.js");

module.exports = {
  // Execução do comando
  run: (client, message, args) => {
    newError = botUtils.newError;

    try {
    let user = message.mentions.members.first() || client.guilds.cache.get("699823229354639471").members.cache.get(args[0]) || message.member;
      Users.findById(user.id, (err, doc) => {
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

        if (!doc) {
          let newUser = new Users({
            _id: user.id
          });
          newUser.save();
          message.channel.send("Tente novamente!");
          return;
        }

        try {
          let embedBal = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setTimestamp()
            .setTitle(`Carteira do ${user.displayName || user.tag}`)
            .setDescription(`${doc.money}`);
          message.channel.send(embedBal);
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
          return;
        }
        return;
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
      return;
    }
  },

  config: {
    name: "balance",
    noalias: "Money, Dinheiro, Carteira",
    aliases: ['money', 'dinheiro', 'carteira', 'bufunfa', 'b'],
    description: "Ve quanto dinheiro você possui",
    usage: "balance",
    accessableby: "Membros"
  }
}