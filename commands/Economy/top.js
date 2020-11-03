const fs = require("fs");
const Discord = require("discord.js");
const { Users } = require("../../database.js");

module.exports = {
  run: async (client, botUtils, message, args) => {
    newError = botUtils.newError;

    try {
      let Leaderboard = await Users.find({}).sort({ money: -1 }).exec(function(err, total) {
        if (err) {

        } else {

          //iniciando variaveis
          let pos = 0;
          let last = [0, Number.MAX_VALUE]
          let finded = false;
          let msg = '';
          let guild = client.guilds.cache.get('699823229354639471')
          let membId = message.mentions.members.first() || guild.members.cache.get(args[0]) || message.member;
          membId = membId.id;

          //Adicionando na lista
          total.forEach(user => {
            pos++;
            if (last[1] > user.money){
              last = [pos,user.money]
            }

            if (pos <= 10 || user._id == membId) {

              if (pos>11) msg += '...\n';
              if (user._id == membId) finded = true;
              
              let name = guild.members.cache.get(user._id) ? guild.members.cache.get(user._id).displayName : "Usuário desconhecido";

              if(!guild.members.cache.get(user._id)) {
                message.channel.send(user._id);
              }

              msg += '**' + last[0] + '.** '
              msg += user._id == membId ? `**${name}**` : name
              msg += ': **' + user.money + '**\n'
            }
          });

          //Caso o player n esteja na lista
          if (!finded){
            if(last[1] > 0) last[0]++;

            msg += `...\n**${last[0]}.** **${guild.members.cache.get(membId).displayName}**: ** 0 **`
          }

          //enviando lista
          let embed = new Discord.MessageEmbed()
            .setTitle("Top Money")
            .setColor("RANDOM")
            .setDescription(msg)
            .setFooter((last[1]==0?last[0]-1:last[0]) + ' membros'); //n contando membros com 0 de money
          message.channel.send(embed)
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

  config: {
    name: "top",
    noalias: "Sem sinonimos",
    aliases: [],
    description: "Ve quem tem mais dinheiro",
    usage: "top",
    accessableby: "Membros"
  }
}