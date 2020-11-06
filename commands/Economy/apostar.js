const fs = require('fs');
const Discord = require('discord.js');
const { Users } = require("../../database.js");

module.exports = {
  run: async (client, botUtils, message, args) => {
    newError = botUtils.newError;

    try {
      return message.reply('ainda em progresso...');
      let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
      let money = args[1];

      if (!user) {
        message.channel.send("marca alguem seu retardado");
        return;
      }

      if(user.id == message.author.id) {
        message.channel.send("doente mental");
        return;
      }

      if (isNaN(money) || !money || money < 1) {
        message.channel.send("digita um numero valido");
        return;
      }

      money = Number.parseInt(money);

      Users.findById(message.author.id, (errGiver, giver) => {
        if (errGiver) {
          let embed = new Discord.MessageEmbed()
            .setTitle("Erro inesperado")
            .setDescription("Um erro inesperado aconteceu. por favor contate os ADMs\n\nUm log foi criado com mais informações do erro");
          message.channel.send(embed);

          let IDs = {
            server: message.guild.id,
            user: message.author.id,
            msg: message.id
          }
          console.log(`=> ${newError(errGiver, module.exports.config.name, IDs)}`);
          return;
        }

        if (!giver) {
          let newUser1 = new Users({
            _id: message.author.id
          });
          newUser1.save();
          message.channel.send("Tente novamente!");
          return;
        }

        Users.findById(user.id, async (errReciever, reciever) => {
          if (errReciever) {
            let embed = new Discord.MessageEmbed()
              .setTitle("Erro inesperado")
              .setDescription("Um erro inesperado aconteceu. por favor contate os ADMs\n\nUm log foi criado com mais informações do erro");
            message.channel.send(embed);

            let IDs = {
              server: message.guild.id,
              user: user.id,
              msg: message.id
            }
            console.log(`=> ${newError(errReciever, module.exports.config.name, IDs)}`);
            return;
          }

          if (!reciever) {
            let newUser2 = new Users({
              _id: user.id
            });
            await newUser2.save();
          }

          try {
            if(giver.money - money < 0) {
              message.channel.send("voce não tem dinheiro suficiente");
              return;
            }
            
            giver.money -= money;
            reciever.money += money;

            giver.save();
            reciever.save();

            let embedGive = new Discord.MessageEmbed()
              .setTitle(`Dinheiro enviado`)
              .setColor("RANDOM")
              .setTimestamp()
              .setDescription(`${user.displayName} recebeu ${money}$ de ${message.member.displayName}`);
            message.channel.send(embedGive);
            return;

          } catch (err1) {
            let IDs = {
              server: message.guild.id,
              user: message.author.id,
              msg: message.id
            }
            console.log(`=> ${newError(err1, module.exports.config.name, IDs)}`);
            return;
          }
        });
      });
    } catch (err) {
      let embed = new Discord.MessageEmbed()
        .setTitle('Erro inesperado')
        .setDescription(
          'Um erro inesperado aconteceu. por favor contate os ADMs\n\nUm log foi criado com mais informações do erro'
        );
      message.channel.send(embed);

      let IDs = {
        server: message.guild.id,
        user: message.author.id,
        msg: message.id
      };
      console.log(`=> ${newError(err, module.exports.config.name, IDs)}`);
    }
  },

  config: {
    name: 'apostar',
    aliases: [],
    description: 'Aposta uma quantia com alguem ou msm com varias pessoas',
    usage: 'apostar <valor> <membro1/all> [membro2] [membro3] ...',
    accessableby: 'Membros'
  }
};
