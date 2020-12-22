const fs = require("fs");
const Discord = require("discord.js");
const { Users } = require("../../database.js");

module.exports = {
  run: async (client, botUtils, message, args) => {
    newError = botUtils.newError;

    try {
      //o help
      if (!args[0] || args[0].toLowerCase() == "help") return message.channel.send({embed:{
        title:"Ajuda top",
        description: "**top money:** Mostra o placar de dinheiro\n**top lvl:** Mostra o placar de nível\n"
      }})

      //
      let sort = (a, b) => {
        return (args[0] && args[0].toLowerCase() == "lvl") ? b.txp - a.txp : b.money - a.money;
      }

      await Users.find({}, (err, doc) => {
        if(err) {
          console.log(err);
          return;
        }

        doc = doc.sort(sort);

          //iniciando variaveis
          let pos = 0;
          let last = [0, Number.MAX_VALUE]
          let finded = false;
          let msg = '';
          let guild = client.guilds.cache.get('699823229354639471');
          let membId = message.mentions.members.first() || guild.members.cache.get(args[0]) || message.member;
          membId = membId.id;

          //Adicionando na lista
          doc.forEach(user => {
            let levelSystem = botUtils.getLevel(user.txp);
            pos++;
            let val = (args[0] && args[0].toLowerCase() == 'lvl') ? levelSystem.level + " " + levelSystem.xpString : user.money;
            if (last[1] > val){
              last = [pos,val];
            }

            if (pos <= 10 || user._id == membId) {

              if (pos>11) msg += '...\n';
              if (user._id == membId) finded = true;
              
              let name = guild.members.cache.get(user._id) ? guild.members.cache.get(user._id).displayName : user.lastName ? user.lastName : "Usuário desconhecido";

              if(!guild.members.cache.get(user._id)) {
                message.channel.send(user._id);
              }

              msg += '**' + last[0] + '.** '
              msg += user._id == membId ? `**${name}**` : name
              msg += ': **' + val + '**\n'
            }
          });

          //Caso o player n esteja na lista
          if (!finded){
            if(last[1] > 0) last[0]++;

            msg += `...\n**${last[0]}.** **${guild.members.cache.get(membId).displayName}**: ** 0 **`
          }

          //enviando lista
          let title = "Money";
          if(args[0] && args[0].toLowerCase() == "lvl") title = "Level";

          let embed = new Discord.MessageEmbed()
            .setTitle("Top " + title)
            .setColor("RANDOM")
            .setDescription(msg)
            .setFooter((last[1]==0?last[0]-1:last[0]) + ' membros'); //n contando membros com 0 de money
          message.channel.send(embed)

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
    name: "top",
    noalias: "Sem sinonimos",
    aliases: [],
    description: "Ve quem tem mais dinheiro",
    usage: "top",
    accessableby: "Membros"
  }
}