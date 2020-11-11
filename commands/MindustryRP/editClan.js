const Discord = require("discord.js");
const { Clans } = require("../../database.js");
const isImageUrl = require("is-image-url");

module.exports = {
  // Execução do comando
  run: (client, botUtils, message, args) => {
    newError = botUtils.newError;

    if (!botUtils.isDev(message.author.id) /*&& !botUtils.isTester(message.author.id)*/) return message.channel.send("Comando em manutenção");

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
              if(!args[0]) {
                let embedConfig = new Discord.MessageEmbed()
                  .setTitle(clan.name);

                if(clan.image && isImageUrl(clan.image)) embedConfig.setThumbnail(clan.image);
                if(clan.desc && clan.desc.length > 0) embedConfig.setDescription(clan.desc);
                
                let clanFounders = clan.founders.filter(m => {
                  return message.guild.members.cache.get(m);
                });

                clanFounders = clanFounders.map(m => {
                  return message.guild.members.cache.get(m).displayName;
                });

                embedConfig.addField("Fundadores", clanFounders.join(", "));

                let clanMembers = clan.members.filter(m => {
                  return message.guild.members.cache.get(m);
                });

                clanMembers = clanMembers.map(m => {
                  return message.guild.members.cache.get(m).displayName;
                }).slice(0, 15);

                embedConfig.addField(`Membros: ${clanMembers.length}/${clan.maxMembers}`, clanMembers.join(", "));

                message.channel.send(embedConfig);
                return;
              }

              switch(args[0]) {
                case "name":
                case "nome": {
                  break;
                }
              }
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