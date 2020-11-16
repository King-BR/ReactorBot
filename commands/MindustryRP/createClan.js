const Discord = require("discord.js");
const { Users, Clans } = require("../../database.js");

module.exports = {
  // Execução do comando
  run: (client, botUtils, message, args) => {
    newError = botUtils.newError;

    try {
      if (message.mentions.members.size > 2) return message.channel.send("Tem que marcar no maximo 2 usuarios");
      if (message.mentions.members.size < 2) return message.channel.send("Tem que marcar no minimo 2 usuarios");

      let founders = [message.member.id];
      let clanName = "Sem nome";

      if (args[2]) clanName = args.slice(2).join(" ");

      message.mentions.members.map(m => {
        founders.push(m.id);
      });

      Users.findById(message.author.id, (errDBuser, doc) => {
        if (errDBuser) {
          let embed = new Discord.MessageEmbed()
            .setTitle("Erro inesperado")
            .setDescription("Um erro inesperado aconteceu. por favor contate os ADMs\n\nUm log foi criado com mais informações do erro");
          message.channel.send(embed);

          let IDs = {
            server: message.guild.id,
            user: message.author.id,
            msg: message.id
          }
          console.log(`=> ${newError(errDBuser, module.exports.config.name, IDs)}`);
          return;
        }

        if (!doc) {
          let newUser = new Users({
            _id: message.author.id
          });
          newUser.save();
          message.channel.send("Você não tem dinheiro o suficiente para cria um clã");
          return;
        }

        if (doc.money - 20000 < 0) return message.channel.send("Você não tem dinheiro o suficiente para cria um clã");

        Clans.find({}, (errDB, clans) => {
          if (errDB) {
            let embed = new Discord.MessageEmbed()
              .setTitle("Erro inesperado")
              .setDescription("Um erro inesperado aconteceu. por favor contate os ADMs\n\nUm log foi criado com mais informações do erro");
            message.channel.send(embed);

            let IDs = {
              server: message.guild.id,
              user: message.author.id,
              msg: message.id
            }
            console.log(`=> ${newError(errDB, module.exports.config.name, IDs)}`);
            return;
          }

          if (!clans || clans.length < 1) {
            let newClan = new Clans({
              _id: botUtils.generateClanID(founders)
            });
            newClan.name = clanName;
            newClan.founders = founders;

            newClan.save();

            let embedClan = new Discord.MessageEmbed()
              .setTitle("Clã criado!")
              .setColor("RANDOM")
              .setTimestamp()
              .setFooter(`ID: ${newClan._id}`)
              .addField("Fundadores", `${message.guild.members.cache.get(founders[0])}\n${message.guild.members.cache.get(founders[1])}\n${message.guild.members.cache.get(founders[2])}`, true)
              .addField("Nome", clanName || "Sem nome", true);
            message.channel.send(embedClan);
            return;
          }

          try {
            let npode = false;
            founders.forEach(f => {
              let index = -1;
              clans.map(c => {
                if (c.members.indexOf(f) != -1) {
                  index = c.members.indexOf(f);
                  npode = true;
                } else if (c.founders.indexOf(f) != -1) {
                  index = c.founders.indexOf(f);
                  npode = true;
                } else {
                  index = -1;
                }
              });

              if (index != -1) return message.channel.send(`${message.guild.members.cache.get(f)} já participa de um clã`);
            });

            if (npode) return;

            let newClan = new Clans({
              _id: botUtils.generateClanID(founders)
            });
            newClan.name = clanName;
            newClan.founders = founders;

            newClan.save();

            let embedClan = new Discord.MessageEmbed()
              .setTitle("Clã criado!")
              .setColor("RANDOM")
              .setTimestamp()
              .setFooter(`ID: ${newClan._id}`)
              .addField("Fundadores", `${message.guild.members.cache.get(founders[0])}\n${message.guild.members.cache.get(founders[1])}\n${message.guild.members.cache.get(founders[2])}`, true)
              .addField("Nome", clanName || "Sem nome", true);
            message.channel.send(embedClan);
            return;
          } catch (err1) {
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
      })

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
    name: "criarcla",
    aliases: ["createclan", "cc"],
    description: "Crie um clã junto com 2 usuarios",
    usage: "criarcla <@user1> <@user2> [nome do clã]",
    accessableby: "Membros"
  }
}