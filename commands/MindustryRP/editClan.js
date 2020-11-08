const Discord = require("discord.js");
const { Clans } = require("../../database.js");

module.exports = {
  // Execução do comando
  run: (client, botUtils, message, args) => {
    newError = botUtils.newError;

    try {
      Clans.find({}, (errDBclans, clans) => {
        if (errDBclans) {
          let embed = new Discord.MessageEmbed()
            .setTitle("Erro inesperado")
            .setDescription("Um erro inesperado aconteceu. por favor contate os ADMs\n\nUm log foi criado com mais informações do erro");
          message.channel.send(embed);

          let IDs = {
            server: message.guild.id,
            user: message.author.id,
            msg: message.id
          }
          console.log(`=> ${newError(errDBclans, module.exports.config.name, IDs)}`);
          return;
        }

        if(!clans || clans.length == 0) return message.channel.send("Você precisa ser fundador de algum clã para poder usar esse comando");

        try {
          let c = clans.filter(c => {
            return c.founders.includes(message.author.id);
          });

          if(!c[0]) return message.channel.send("Você precisa ser fundador de algum clã para poder usar esse comando");

          Clans.findById(c[0]._id, (errDBclan, clan) => {
            if (errDBclan) {
              let embed = new Discord.MessageEmbed()
                .setTitle("Erro inesperado")
                .setDescription("Um erro inesperado aconteceu. por favor contate os ADMs\n\nUm log foi criado com mais informações do erro");
              message.channel.send(embed);

              let IDs = {
                server: message.guild.id,
                user: message.author.id,
                msg: message.id
              }
              console.log(`=> ${newError(errDBclan, module.exports.config.name, IDs)}`);
              return;
            }

            if(!clan) return message.channel.send("Você precisa ser fundador de algum clã para poder usar esse comando");

            try {
              
            } catch(err2) {
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
        } catch(err1) {
          let embed = new Discord.MessageEmbed()
            .setTitle("Erro inesperado")
            .setDescription("Um erro inesperado aconteceu. por favor contate os ADMs\n\nUm log foi criado com mais informações do erro");
          message.channel.send(embed);

          let IDs = {
            server: message.guild.id,
            user: message.author.id,
            msg: message.id
          }
          console.log(`=> ${newError(err1, module.exports.config.name, IDs)}`);
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

  // Configuração do comando
  config: {
    name: "editcla",
    aliases: ["editclan", "ec"],
    description: "Edite as informações do clã",
    usage: "editcla <opção> <informação a ser editada>",
    accessableby: "Membros"
  }
}